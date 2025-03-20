import goldController from "../../put/goldController.js";
import mongoose from "mongoose";
import { goldSchema } from "../../../schemas/netWorthSchemas.js";

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
    userSchema: mockUserSchema,
  };
});
import User from "../../../models/User.js";

jest.mock("../../../models/Gold.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(), 
  },
}));
import GoldModel from "../../../models/Gold.js";

jest.mock("mongoose");
jest.mock("../../../models/Gold.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("goldController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3", body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should update gold data for a valid user and valid input", async () => {
    const mockUser = { _id: req.user, netWorth: { gold: "goldId" } };
    const mockBody = { jewellery: 6, SGB: 3, digitalGoldAndETF: 4 };
    const mockExistingGold = {
      toObject: jest.fn().mockReturnValue({ jewellery: 5, SGB: 2, digitalGoldAndETF: 3 }),
    };
    const mockUpdatedGold = { jewellery: 6, SGB: 3, digitalGoldAndETF: 4 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    goldSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    GoldModel.findOne.mockResolvedValue(mockExistingGold);
    GoldModel.findOneAndUpdate.mockResolvedValue(mockUpdatedGold);

    req.body = mockBody;
    await goldController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Gold updated successfully to Networth" });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: req.user });
    expect(GoldModel.findOneAndUpdate).toHaveBeenCalledWith(
      {_id : mockUser.netWorth.gold},
      {
        ...mockExistingGold.toObject(),
        ...mockBody
      },
      {new : true}
    );
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(goldSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  test("should return 403 if input is invalid", async () => {
    const mockBody = { jewellery: "invalid" };
    goldSchema.safeParse.mockReturnValue({ success: false, error: { format: () => "Validation Error" } });
    req.body = mockBody;

    await goldController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Gold inputs are wrong", err: "Validation Error" });
  });

  test("should return 403 if gold data is NOT updated", async () => {
    const mockUser = { _id: req.user, netWorth: { gold: "goldId" } };
    const mockBody = { jewellery: 6, SGB: 3, digitalGoldAndETF: 4 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    goldSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    GoldModel.findOneAndUpdate.mockResolvedValue(null);

    req.body = mockBody;
    await goldController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Gold not updated" });
  });

  test("should handle database errors and abort transaction", async () => {
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

    req.body = mockBody;
    await goldController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal error", err: "Database error" });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});
