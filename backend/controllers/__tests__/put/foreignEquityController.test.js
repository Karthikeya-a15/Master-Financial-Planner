import foreignEquityController from "../../put/foreignEquityController.js";
import mongoose from "mongoose";
import { foreignEquitySchema } from "../../../schemas/netWorthSchemas.js";
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

jest.mock("../../../models/ForeignEquity.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    // ... other Mongoose methods as needed
  },
}));
import ForeignEquity from "../../../models/ForeignEquity.js";

jest.mock("mongoose");
jest.mock("../../../models/ForeignEquity.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("foreignEquityController", () => {
  it("should update foreign equity data for a valid user and valid input", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { foreignEquity: "67b82107183c091d4d3990cc" },
    };
    const mockBody = { sAndp500: 25, otherETF: 12, mutualFunds: 18 };
    const mockExistingForeignEquity = {
      sAndp500: 10,
      otherETF: 5,
      mutualFunds: 10,
    }; // Example existing data

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    foreignEquitySchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findOne.mockResolvedValue(mockUser);
    ForeignEquity.findOne.mockResolvedValue(mockExistingForeignEquity);
    // Mock successful update. toObject() is called on mockExistingForeignEquity,
    // so we provide a mock implementation.
    ForeignEquity.findOneAndUpdate.mockImplementation(() => ({
      toObject: () => mockExistingForeignEquity, // Return the *existing* object for toObject()
      sAndp500: 25,
      otherETF: 12,
      mutualFunds: 18, //the *updated* values
    }));

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await foreignEquityController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "ForeignEquity updated successfully to Networth",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(ForeignEquity.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(foreignEquitySchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if input is invalid", async () => {
    const mockBody = { sAndp500: "invalid" }; // Invalid input
    const mockValidationError = { format: () => "Validation Error" };

    foreignEquitySchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });

    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await foreignEquityController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "ForeignEquity inputs are wrong",
      err: "Validation Error",
    });
    expect(foreignEquitySchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if foreign equity data is NOT updated", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { foreignEquity: "67b82107183c091d4d3990cc" },
    };
    const mockBody = { sAndp500: 25, otherETF: 12, mutualFunds: 18 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    foreignEquitySchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findOne.mockResolvedValue(mockUser);
    ForeignEquity.findOneAndUpdate.mockResolvedValue(null); // Update fails

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await foreignEquityController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "ForeignEquity not updated",
    });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = { sAndp500: 25, otherETF: 12, mutualFunds: 18 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    // Mock schema validation
    foreignEquitySchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError);
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await foreignEquityController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal error",
      err: "Database error",
    });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
