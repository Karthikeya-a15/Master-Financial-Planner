import assumptionController from "../../put/assumptionController.js";
import mongoose from "mongoose";
import ramSchema from "../../../schemas/ramSchema.js";
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

jest.mock("../../../models/returnsAndAssets.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    // ... other Mongoose methods you might need
  },
}));
import RAM from "../../../models/returnsAndAssets.js";

jest.mock("mongoose");
jest.mock("../../../models/User.js");
jest.mock("../../../models/returnsAndAssets.js");
jest.mock("../../../schemas/ramSchema.js");

describe("assumptionController", () => {
  it("should update returns and assets mix assumptions for a valid user and valid input", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = { _id: mockUserId, ram: "67b82107183c091d4d3990d9" };
    const mockBody = {
      expectedReturns: { equity: 12, debt: 6 },
      shortTerm: { debt: 80, equity: 20 },
      mediumTerm: { debt: 60, equity: 40 },
      longTerm: { debt: 20, equity: 80 },
      effectiveReturns: 8,
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    ramSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findOne.mockResolvedValue(mockUser);
    RAM.findOne.mockResolvedValue({}); // Mock RAM document exists
    RAM.findOneAndUpdate.mockResolvedValue({}); // Mock successful update

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await assumptionController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Returns & Assets Mix Assumptions are set",
    });

    // Verify mongoose operations
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(RAM.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(ramSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if input is invalid", async () => {
    const mockBody = { invalidInput: "invalid" };
    const mockValidationError = { format: () => "Validation Error" };

    // Mock schema validation to fail
    ramSchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await assumptionController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Inputs are incorrect",
      err: "Validation Error",
    });
    expect(ramSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if RAM assumptions are NOT set", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = { _id: mockUserId, ram: "67b82107183c091d4d3990d9" };
    const mockBody = {
      expectedReturns: { equity: 12, debt: 6 },
      shortTerm: { debt: 80, equity: 20 },
      mediumTerm: { debt: 60, equity: 40 },
      longTerm: { debt: 20, equity: 80 },
      effectiveReturns: 8,
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    // Mock schema validation
    ramSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findOne.mockResolvedValue(mockUser);
    RAM.findOneAndUpdate.mockResolvedValue(null); // Update fails

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await assumptionController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Returns & Assets Mix Assumptions are NOT set",
    });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = {
      expectedReturns: { equity: 12, debt: 6 },
      shortTerm: { debt: 80, equity: 20 },
      mediumTerm: { debt: 60, equity: 40 },
      longTerm: { debt: 20, equity: 80 },
      effectiveReturns: 8,
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    // Mock schema validation
    ramSchema.safeParse.mockReturnValue({ success: true });
    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError); // Simulate database error

    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();

    await assumptionController(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: "Database error" });

    // Verify transaction was aborted
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
