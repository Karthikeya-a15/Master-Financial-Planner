
import financialGoalsController, { getSipAmountDistribution, getAmountDistribution, sumOfSip } from "./financialGoalsController.js";
import mongoose from "mongoose";
import Goals from "../../models/Goals.js";
import goalSchema from "../../schemas/goalSchema.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/User.js", () => {
  const mockUserSchema = {
    methods: {
      hashPassword: jest.fn(), // Provide a mock function
      validatePassword: jest.fn()
    },
    // Add other required mock schema properties if needed
  };
  return {
    __esModule: true, // Important for ES modules
    default: {
      findOne: jest.fn(),
      // ... any other User methods you use in your test ...
    },
    userSchema: mockUserSchema, // Export the mock schema
  }
});
import User from "../../models/User.js";

jest.mock("../../models/returnsAndAssets.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(), // <---  findById was added here
    // ... other methods as needed
  }
}));
import RAM from '../../models/returnsAndAssets.js';


jest.mock("mongoose");
jest.mock("../../models/User.js");
jest.mock("../../models/Goals.js");
jest.mock("../../schemas/goalSchema.js");
jest.mock("../../models/returnsAndAssets.js");

describe("financialGoalsController", () => {
    it("should update financial goals for a valid user and valid input", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, goals: "67b82107183c091d4d3990d7", ram: "67b82107183c091d4d3990d9" };
        const mockBody = { goals: [{ name: "Goal 1", amount: 1000, time: 5, sipRequired : 50 }] }; //simplified goals
        const mockRAM = {
          shortTerm: { debt: 50, domesticEquity: 30, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 },
          mediumTerm: { debt: 30, domesticEquity: 40, usEquity: 15, gold: 10, crypto: 5, realEstate: 0 },
          longTerm: { debt: 10, domesticEquity: 50, usEquity: 20, gold: 10, crypto: 5, realEstate: 5 },
        };

        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        // Mock schema validation
        goalSchema.safeParse.mockReturnValue({ success: true });

        // Mock mongoose session
        mongoose.startSession.mockResolvedValue(mockSession);

        User.findOne.mockResolvedValue(mockUser);
        RAM.findById.mockResolvedValue(mockRAM); // Mock successful update

        const updatedGoals = {
            goals: mockBody.goals,
            sipAmountDistribution: getSipAmountDistribution(mockBody.goals, mockRAM), // Assuming you have a function to calculate this
            sipAssetAllocation: sumOfSip(getSipAmountDistribution(mockBody.goals, mockRAM)),
        };

        Goals.findOneAndUpdate.mockResolvedValue(updatedGoals);

        const req = createRequest({user: mockUserId, body: mockBody});
        const res = createResponse();
        await financialGoalsController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "User Goals are Updated" });
        expect(mongoose.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
        expect(Goals.findOneAndUpdate).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
        expect(goalSchema.safeParse).toHaveBeenCalledWith({ goals: mockBody.goals });
    });

    it("should return 403 if input is invalid", async () => {
        const mockBody = { goals: "invalid" };
        const mockValidationError = { format: () => "Validation Error" };

        // Mock schema validation to fail
        goalSchema.safeParse.mockReturnValue({ success: false, error: mockValidationError });

        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();
        await financialGoalsController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "Financial Goals input are Wrong", error: "Validation Error" });
        expect(goalSchema.safeParse).toHaveBeenCalledWith({goals : mockBody.goals});
    });


    it("should handle database errors and abort transaction", async () => {
        const mockBody = { goals: [{ name: "Goal 1", amount: 1000, time: 5, sipRequired: 50 }] };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        const mockError = new Error("Database error");

        // Mock schema validation
        goalSchema.safeParse.mockReturnValue({ success: true });

        // Mock mongoose session
        mongoose.startSession.mockResolvedValue(mockSession);

        User.findOne.mockRejectedValue(mockError); // Simulate database error
        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();
        await financialGoalsController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal error", err: "Database error" });
        expect(mockSession.abortTransaction).toHaveBeenCalled();  // Corrected expectation
        expect(mockSession.endSession).toHaveBeenCalled();
    });
});


describe('getSipAmountDistribution', () => {
  const mockReturnsAndAssets = {
    shortTerm: { debt: 50, domesticEquity: 30, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 },
    mediumTerm: { debt: 30, domesticEquity: 40, usEquity: 15, gold: 10, crypto: 5, realEstate: 0 },
    longTerm: { debt: 10, domesticEquity: 50, usEquity: 20, gold: 10, crypto: 5, realEstate: 5 },
  };

  it('should calculate SIP amount distribution correctly for a single short-term goal', () => {
    const goals = [{ sipRequired: 100, time: 2 }];
    const expectedDistribution = [getAmountDistribution(100, mockReturnsAndAssets.shortTerm)];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(expectedDistribution);
  });

  it('should calculate SIP amount distribution correctly for a single medium-term goal', () => {
    const goals = [{ sipRequired: 200, time: 5 }];
    const expectedDistribution = [getAmountDistribution(200, mockReturnsAndAssets.mediumTerm)];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(expectedDistribution);
  });

  it('should calculate SIP amount distribution correctly for a single long-term goal', () => {
    const goals = [{ sipRequired: 300, time: 10 }];
    const expectedDistribution = [getAmountDistribution(300, mockReturnsAndAssets.longTerm)];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(expectedDistribution);
  });

    it('should calculate SIP amount distribution correctly for a multiple goals', () => {
    const goals = [{ sipRequired: 300, time: 10 }, { sipRequired: 200, time: 5 }, { sipRequired: 100, time: 2 }];
    const expectedDistribution = [getAmountDistribution(300, mockReturnsAndAssets.longTerm), getAmountDistribution(200, mockReturnsAndAssets.mediumTerm), getAmountDistribution(100, mockReturnsAndAssets.shortTerm)];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(expectedDistribution);
  });
});

describe('getAmountDistribution', () => {
  it('should correctly distribute SIP amount based on plan', () => {
    const sip = 100;
    const plan = { debt: 50, domesticEquity: 30, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 };
    const expectedDistribution = {
      debt: 50,         // 50% of 100
      domesticEquity: 30,  // 30% of 100
      usEquity: 10,        // 10% of 100
      gold: 5,           // 5% of 100
      crypto: 5,           // 5% of 100
      realEstate: 0,       // 0% of 100
    };
    expect(getAmountDistribution(sip, plan)).toEqual(expectedDistribution);
  });

  it('should handle zero values in plan correctly', () => {
    const sip = 200;
    const plan = { debt: 0, domesticEquity: 100, usEquity: 0, gold: 0, crypto: 0, realEstate: 0 };
    const expectedDistribution = {
      debt: 0,         // 0% of 200
      domesticEquity: 200, // 100% of 200
      usEquity: 0,        // 0% of 200
      gold: 0,           // 0% of 200
      crypto: 0,           // 0% of 200
      realEstate: 0,       // 0% of 200
    };
    expect(getAmountDistribution(sip, plan)).toEqual(expectedDistribution);
  });
});


describe('sumOfSip', () => {
  it('should correctly sum SIP amounts across multiple goals', () => {
    const sipAmountDistribution = [
      { domesticEquity: 10, usEquity: 5, debt: 20, gold: 2, crypto: 1, realEstate: 0 },
      { domesticEquity: 20, usEquity: 10, debt: 30, gold: 5, crypto: 2, realEstate: 3 },
      { domesticEquity: 30, usEquity: 15, debt: 40, gold: 8, crypto: 3, realEstate: 5 },
    ];
    const expectedSum = {
      domesticEquity: 60, // 10 + 20 + 30
      usEquity: 30,       // 5 + 10 + 15
      debt: 90,         // 20 + 30 + 40
      gold: 15,          // 2 + 5 + 8
      crypto: 6,          // 1 + 2 + 3
      realEstate: 8,       // 0 + 3 + 5
    };
    expect(sumOfSip(sipAmountDistribution)).toEqual(expectedSum);
  });

  it('should handle empty input array correctly', () => {
    const sipAmountDistribution = [];
    const expectedSum = {
      domesticEquity: 0,
      usEquity: 0,
      debt: 0,
      gold: 0,
      crypto: 0,
      realEstate: 0,
    };
    expect(sumOfSip(sipAmountDistribution)).toEqual(expectedSum);
  });
});