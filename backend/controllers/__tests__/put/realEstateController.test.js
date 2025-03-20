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
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3", body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should update real estate data for a valid user and valid input", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { realEstate: "67b82107183c091d4d3990d4" },
    };
    const mockBody = { home: 120, otherRealEstate: 60, REITs: 20 };
    const mockExistingRealEstate = {
      toObject: jest.fn().mockReturnValue({ home: 100, otherRealEstate: 50, REITs: 15 }),
    };
    const mockUpdatedRealEstate = { home: 120, otherRealEstate: 60, REITs: 20 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    realEstateSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    RealEstate.findOne.mockResolvedValue(mockExistingRealEstate);
    RealEstate.findOneAndUpdate.mockResolvedValue(mockUpdatedRealEstate);

    req.body = mockBody;
    await realEstatesController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Real-Estate updated successfully to Networth" });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: req.user });
    expect(RealEstate.findOneAndUpdate).toHaveBeenCalledWith(
      {_id : mockUser.netWorth.realEstate},
      {
        ...mockExistingRealEstate.toObject(),
        ...mockBody
      },
      { new: true }
    );
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(realEstateSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  test("should return 403 if input is invalid", async () => {
    const mockBody = { home: "invalid" };
    realEstateSchema.safeParse.mockReturnValue({ success: false, error: { format: () => "Validation Error" } });
    req.body = mockBody;

    await realEstatesController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Real-Estate inputs are wrong", err: "Validation Error" });
  });

  test("should return 403 if real estate data is NOT updated", async () => {
    const mockUser = {
      _id: req.user,
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
    RealEstate.findOneAndUpdate.mockResolvedValue(null);

    req.body = mockBody;
    await realEstatesController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Real-Estate not updated" });
  });

  test("should handle database errors and abort transaction", async () => {
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
    User.findOne.mockRejectedValue(mockError);

    req.body = mockBody;
    await realEstatesController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal error", err: "Database error" });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});

