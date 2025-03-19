import realEstatesController from "../../put/realEstateController.js";
import mongoose from "mongoose";
import { realEstateSchema } from "../../../schemas/netWorthSchemas.js";
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

jest.mock("../../../models/RealEstate.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    // ... other Mongoose methods
  },
}));
import RealEstate from "../../../models/RealEstate.js";

jest.mock("mongoose");
jest.mock("../../../models/RealEstate.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("realEstatesController", () => {
  it("should update real estate data for a valid user and valid input", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { realEstate: "67b82107183c091d4d3990d4" },
    };
    const mockBody = { home: 120, otherRealEstate: 60, REITs: 20 };
    const mockExistingRealEstate = {
      home: 100,
      otherRealEstate: 50,
      REITs: 15,
    };

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    realEstateSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findOne.mockResolvedValue(mockUser);
    RealEstate.findOne.mockResolvedValue(mockExistingRealEstate);
    RealEstate.findOneAndUpdate.mockImplementation(() => ({
      toObject: () => mockExistingRealEstate,
      home: 120,
      otherRealEstate: 60,
      REITs: 20,
    }));

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();

    await realEstatesController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Real-Estate updated successfully to Networth",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(RealEstate.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(realEstateSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if input is invalid", async () => {
    const mockBody = { home: "invalid" };
    const mockValidationError = { format: () => "Validation Error" };

    realEstateSchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await realEstatesController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Real-Estate inputs are wrong",
      err: "Validation Error",
    });
    expect(realEstateSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if real estate data is NOT updated", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { realEstate: "67b82107183c091d4d3990d4" },
    };
    const mockBody = { home: 120, otherRealEstate: 60, REITs: 20 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    realEstateSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    RealEstate.findOneAndUpdate.mockResolvedValue(null); // Update fails
    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await realEstatesController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "Real-Estate not updated" });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = { home: 120, otherRealEstate: 60, REITs: 20 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");
    realEstateSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError); // Simulate error
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await realEstatesController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal error",
      err: "Database error",
    });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
