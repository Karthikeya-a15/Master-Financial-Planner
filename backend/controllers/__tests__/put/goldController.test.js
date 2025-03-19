import goldController from "../../put/goldController.js";
import mongoose from "mongoose";
import { goldSchema } from "../../../schemas/netWorthSchemas.js";
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

jest.mock("../../../models/Gold.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(), // Add if you use it
    // ... other Mongoose methods as needed
  },
}));
import GoldModel from "../../../models/Gold.js";

jest.mock("mongoose");
jest.mock("../../../models/Gold.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("goldController", () => {
  it("should update gold data for a valid user and valid input", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = { _id: mockUserId, netWorth: { gold: "goldId" } };
    const mockBody = { jewellery: 6, SGB: 3, digitalGoldAndETF: 4 };
    const mockExistingGold = { jewellery: 5, SGB: 2, digitalGoldAndETF: 3 };

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    goldSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findOne.mockResolvedValue(mockUser);
    GoldModel.findOne.mockResolvedValue(mockExistingGold);
    GoldModel.findOneAndUpdate.mockImplementation(() => ({
      toObject: () => mockExistingGold,
      jewellery: 6,
      SGB: 3,
      digitalGoldAndETF: 4,
    }));

    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();

    await goldController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Gold updated successfully to Networth",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(GoldModel.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(goldSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if input is invalid", async () => {
    const mockBody = { jewellery: "invalid" };
    const mockValidationError = { format: () => "Validation Error" };

    goldSchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });
    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();

    await goldController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({
      message: "Gold inputs are wrong",
      err: "Validation Error",
    });
    expect(goldSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 403 if gold data is NOT updated", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = { _id: mockUserId, netWorth: { gold: "goldId" } };
    const mockBody = { jewellery: 6, SGB: 3, digitalGoldAndETF: 4 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    goldSchema.safeParse.mockReturnValue({ success: true });
    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    GoldModel.findOneAndUpdate.mockResolvedValue(null);
    const req = createRequest({ user: mockUserId, body: mockBody });
    const res = createResponse();

    await goldController(req, res);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "Gold not updated" });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = { jewellery: 6, SGB: 3, digitalGoldAndETF: 4 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");
    goldSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError);

    const req = createRequest({
      user: "67b82107183c091d4d3990c3",
      body: mockBody,
    });
    const res = createResponse();

    await goldController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal error",
      err: "Database error",
    });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
