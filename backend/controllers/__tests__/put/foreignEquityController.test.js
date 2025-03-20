import foreignEquityController from "../../put/foreignEquityController.js";
import mongoose from "mongoose";
import { foreignEquitySchema } from "../../../schemas/netWorthSchemas.js";

jest.mock("../../../models/User.js", () => {
  const mockUserSchema = {
    methods: {
      hashPassword: jest.fn(), 
      validatePassword: jest.fn(),
    },
  };
  return {
    __esModule: true, 
    default: {
      findOne: jest.fn(),
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
  },
}));
import ForeignEquity from "../../../models/ForeignEquity.js";

jest.mock("mongoose");
jest.mock("../../../models/ForeignEquity.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("foreignEquityController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3", body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should update foreign equity data for a valid user and valid input", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { foreignEquity: "67b82107183c091d4d3990cc" },
    };
    const mockBody = { sAndp500: 25, otherETF: 12, mutualFunds: 18 };
    const mockExistingForeignEquity = {
      toObject: jest.fn().mockReturnValue({ sAndp500: 10, otherETF: 5, mutualFunds: 10 }),
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    foreignEquitySchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    ForeignEquity.findOne.mockResolvedValue(mockExistingForeignEquity);
    ForeignEquity.findOneAndUpdate.mockResolvedValue(mockBody);

    req.body = mockBody;
    await foreignEquityController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "ForeignEquity updated successfully to Networth" });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: req.user });
    expect(ForeignEquity.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockUser.netWorth.foreignEquity },
      { ...mockExistingForeignEquity.toObject(), ...mockBody },
      { new: true }
    );
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(foreignEquitySchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  test("should return 403 if input is invalid", async () => {
    const mockBody = { sAndp500: "invalid" };
    foreignEquitySchema.safeParse.mockReturnValue({ success: false, error: { format: () => "Validation Error" } });
    req.body = mockBody;

    await foreignEquityController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "ForeignEquity inputs are wrong", err: "Validation Error" });
  });

  test("should return 403 if foreign equity data is NOT updated", async () => {
    const mockUser = { _id: req.user, netWorth: { foreignEquity: "67b82107183c091d4d3990cc" } };
    const mockBody = { sAndp500: 25, otherETF: 12, mutualFunds: 18 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    foreignEquitySchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    ForeignEquity.findOneAndUpdate.mockResolvedValue(null);

    req.body = mockBody;
    await foreignEquityController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "ForeignEquity not updated" });
  });

  test("should handle database errors and abort transaction", async () => {
    const mockBody = { sAndp500: 25, otherETF: 12, mutualFunds: 18 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    foreignEquitySchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError);

    req.body = mockBody;
    await foreignEquityController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal error", err: "Database error" });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
