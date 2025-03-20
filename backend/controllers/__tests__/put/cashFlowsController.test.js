import cashFlowsController from "../../put/cashFlowsController.js";
import mongoose from "mongoose";
import { cashFlowsSchema } from "../../../schemas/netWorthSchemas.js";
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

jest.mock("../../../models/CashFlows.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    // ... other methods as needed
  },
}));
import CashFlows from "../../../models/CashFlows.js";

jest.mock("mongoose");
jest.mock("../../../models/CashFlows.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("cashFlowsController", () => {
  it("should update cash flows for a valid user and valid input", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { cashFlows: "67b82107183c091d4d3990c4" },
    };
    const mockBody = {
      inflows: { salary: 6000 },
      outflows: { expenses: 2500 },
    };
    const mockExistingCashFlow = {
      inflows: { other: 1000 },
      outflows: { rent: 1000 },
    }; // Example existing data

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    cashFlowsSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findOne.mockResolvedValue(mockUser);
    CashFlows.findOne.mockResolvedValue(mockExistingCashFlow); // Return existing document
    CashFlows.findOneAndUpdate.mockResolvedValue({}); // Mock successful update

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();

    await cashFlowsController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Cash-Flows Updated successfully",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(CashFlows.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(cashFlowsSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if input is invalid", async () => {
    const mockBody = { invalidInput: "invalid" };
    const mockValidationError = { format: () => "Validation Error" };

    // Mock schema validation to fail
    cashFlowsSchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });

    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await cashFlowsController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Cash-Flow inputs are wrong",
      err: "Validation Error",
    });
    expect(cashFlowsSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if cash flows are NOT updated", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { cashFlows: "67b82107183c091d4d3990c4" },
    };
    const mockBody = {
      inflows: { salary: 6000 },
      outflows: { expenses: 2500 },
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    cashFlowsSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    CashFlows.findOneAndUpdate.mockResolvedValue(null); // Update fails
    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();

    await cashFlowsController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "Cash-Flows not updated" });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = {
      inflows: { salary: 6000 },
      outflows: { expenses: 2500 },
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    // Mock schema validation
    cashFlowsSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError); // Simulate database error
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await cashFlowsController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal error",
      err: "Database error",
    });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
