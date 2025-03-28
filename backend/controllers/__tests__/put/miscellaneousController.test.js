import miscellaneousController from "../../put/miscellaneousController.js";
import mongoose from "mongoose";
import { miscellaneousSchema } from "../../../schemas/netWorthSchemas.js";

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
jest.mock("../../../models/miscellaneous.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
  },
}));

import miscellaneous from "../../../models/miscellaneous.js";

jest.mock("mongoose");
jest.mock("../../../models/miscellaneous.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");


describe("miscellaneousController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: "67b82107183c091d4d3990c3", 
      body: {}, 
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(), 
    };

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should update miscellaneous data for a valid user and valid input", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { miscellaneous: "67b82107183c091d4d3990d2" },
    };
    const mockBody = { otherInsuranceProducts: 12, smallCase: 6 };
    const mockExistingMisc = {
      toObject: jest.fn().mockReturnValue({ otherInsuranceProducts: 10, smallCase: 5 }),
    };
    const mockUpdatedMisc = { otherInsuranceProducts: 12, smallCase: 6 };

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    miscellaneousSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    miscellaneous.findOne.mockResolvedValue(mockExistingMisc);
    miscellaneous.findOneAndUpdate.mockResolvedValue(mockUpdatedMisc);

    // Set request body
    req.body = mockBody;

    await miscellaneousController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Miscellaneous updated successfully to Networth",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(miscellaneous.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockUser.netWorth.miscellaneous },
      { ...mockExistingMisc.toObject(), ...mockBody },
      { new: true }
    );
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(miscellaneousSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });
  it("should return 403 if input is invalid", async () => {
    const mockBody = { otherInsuranceProducts: "invalid" };
    const mockValidationError = { format: () => "Validation Error" };

    // Mock schema validation failure
    miscellaneousSchema.safeParse.mockReturnValue({
      success: false,
      error: mockValidationError,
    });

    // Set request body
    req.body = mockBody;

    await miscellaneousController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Miscellaneous inputs are wrong",
      err: "Validation Error",
    });
    expect(miscellaneousSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  it("should return 500 if miscellaneous data is NOT updated", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { miscellaneous: "67b82107183c091d4d3990d2" },
    };
    const mockBody = { otherInsuranceProducts: 12, smallCase: 6 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock schema validation
    miscellaneousSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    miscellaneous.findOneAndUpdate.mockResolvedValue(null); // Simulate update failure

    // Set request body
    req.body = mockBody;

    await miscellaneousController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      "message": "Miscellaneous not updated"
    });
  });

  it("should handle database errors and abort transaction", async () => {
    const mockBody = { otherInsuranceProducts: 12, smallCase: 6 };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    // Mock schema validation
    miscellaneousSchema.safeParse.mockReturnValue({ success: true });

    // Mock mongoose session
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError); // Simulate database error

    // Set request body
    req.body = mockBody;

    await miscellaneousController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal error",
      err: "Database error",
    });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});