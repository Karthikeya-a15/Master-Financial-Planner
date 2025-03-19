import liabilitiesController from "../../put/liabilitiesController.js";
import mongoose from "mongoose";
import { liabilitiesSchema } from "../../../schemas/netWorthSchemas.js";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("../../../models/User.js", () => {
  const mockUserSchema = {
    methods: {
      hashPassword: jest.fn(), // Provide a mock function
      validatePassword: jest.fn(),
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
  };
});
import User from "../../../models/User.js";

jest.mock("../../../models/Liabilities.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    // ... other Mongoose methods
  },
}));
import liabilities from "../../../models/Liabilities.js";

jest.mock("mongoose");
jest.mock("../../../models/Liabilities.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("liabilitiesController", () => {
  it("should update liabilities data for a valid user and valid input", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { liabilities: "67b82107183c091d4d3990d0" },
    };
    const mockBody = {
      homeLoan: 60,
      educationLoan: 12,
      carLoan: 6,
      personalLoan: 3,
      creditCard: 2,
      other: 1,
    };
    const mockExistingLiabilities = {
      homeLoan: 50,
      educationLoan: 10,
      carLoan: 5,
      personalLoan: 2,
      creditCard: 1,
      other: 0,
    };

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    liabilitiesSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    liabilities.findOne.mockResolvedValue(mockExistingLiabilities); // Return existing
    liabilities.findOneAndUpdate.mockImplementation(() => ({
      toObject: () => mockExistingLiabilities,
      homeLoan: 60,
      educationLoan: 12,
      carLoan: 6,
      personalLoan: 3,
      creditCard: 2,
      other: 1,
    }));
    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();

    await liabilitiesController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Liabilities updated successfully to Networth",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(liabilities.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(liabilitiesSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if input is invalid", async () => {
    const mockBody = { homeLoan: "invalid" };
    const mockValidationError = { format: () => "Validation Error" };

    liabilitiesSchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();

    await liabilitiesController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Liabilities inputs are wrong",
      err: "Validation Error",
    });
    expect(liabilitiesSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if liabilities data is NOT updated", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { liabilities: "67b82107183c091d4d3990d0" },
    };
    const mockBody = {
      homeLoan: 60,
      educationLoan: 12,
      carLoan: 6,
      personalLoan: 3,
      creditCard: 2,
      other: 1,
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    liabilitiesSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    liabilities.findOneAndUpdate.mockResolvedValue(null); // Update fails
    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await liabilitiesController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "Liabilities not updated" });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = {
      homeLoan: 60,
      educationLoan: 12,
      carLoan: 6,
      personalLoan: 3,
      creditCard: 2,
      other: 1,
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    liabilitiesSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError);
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await liabilitiesController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal error",
      err: "Database error",
    });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
