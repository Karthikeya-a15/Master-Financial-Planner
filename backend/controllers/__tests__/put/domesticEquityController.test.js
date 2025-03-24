import domesticEquityController from "../../put/domesticEquityController.js";
import mongoose from "mongoose";
import { domesticEquitySchema } from "../../../schemas/netWorthSchemas.js";
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

jest.mock("../../../models/DomesticEquity.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(), // Add if you use it
    // ... other Mongoose methods
  },
}));
import DomesticEquity from "../../../models/DomesticEquity.js";

jest.mock("mongoose");
jest.mock("../../../models/DomesticEquity.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("domesticEquityController", () => {
  it("should update domestic equity data with valid input and selection", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { domesticEquity: "67b82107183c091d4d3990ca" },
    };
    const mockBody = {
      directStocks: { stock1: 100, stock2: 200 },
      mutualFunds: { fund1: 50, fund2: 75 },
      sipEquity: { sip1: 10, sip2: 15 },
      selection: "directStocks", // Example selection
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation (similar to debtController)
    domesticEquitySchema.safeParse.mockImplementation(
      ({ directStocks, mutualFunds, sipEquity }) => {
        if (directStocks) return { success: true };
        if (mutualFunds) return { success: true };
        if (sipEquity) return { success: true };

        return { success: false, error: { format: () => "Validation Error" } };
      },
    );

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    DomesticEquity.findOneAndUpdate.mockResolvedValue({}); // Mock successful update

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await domesticEquityController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Domestic Equity updated successfully to Networth",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(DomesticEquity.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(domesticEquitySchema.safeParse).toHaveBeenCalled();
  });

  it("should return 403 if input is invalid", async () => {
    const mockBody = { directStocks: "invalid", selection: "directStocks" };
    const mockValidationError = { format: () => "Validation Error" };

    domesticEquitySchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await domesticEquityController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Domestic Equity inputs are wrong",
      err: "Validation Error",
    });
    expect(domesticEquitySchema.safeParse).toHaveBeenCalled();
  });

  it("should return 403 if selection is not provided", async () => {
    const mockBody = { directStocks: { stock1: 100 } }; // No selection
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await domesticEquityController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "Selection not provided" });
  });

  it("should return 403 if domestic equity data is NOT updated", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { domesticEquity: "67b82107183c091d4d3990ca" },
    };
    const mockBody = {
      directStocks: { stock1: 100 },
      selection: "directStocks",
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    domesticEquitySchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    DomesticEquity.findOneAndUpdate.mockResolvedValue(null); // Update fails
    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();
    await domesticEquityController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Domestic Equity not updated",
    });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = {
      directStocks: { stock1: 100 },
      selection: "directStocks",
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");
    domesticEquitySchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError); // Simulate error
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();
    await domesticEquityController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal error",
      err: "Database error",
    });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
