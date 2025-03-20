import liabilitiesController from "../../put/liabilitiesController.js";
import mongoose from "mongoose";
import { liabilitiesSchema } from "../../../schemas/netWorthSchemas.js";

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

jest.mock("../../../models/Liabilities.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
  },
}));
import liabilities from "../../../models/Liabilities.js";

jest.mock("mongoose");
jest.mock("../../../models/Liabilities.js");
jest.mock("../../../models/User.js");
jest.mock("../../../schemas/netWorthSchemas.js");

describe("liabilitiesController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3", body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should update liabilities data for a valid user and valid input", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { liabilities: "67b82107183c091d4d3990d0" },
    };
    const mockBody = {
      homeLoan: 60,
      educationLoan: 12,
      carLoan: 6,
      personalLoan: 3,
      creditCard: 1,
      other: 0,
    };
    const mockExistingLiabilities = {
      toObject: jest.fn().mockReturnValue({
        homeLoan: 50,
        educationLoan: 10,
        carLoan: 5,
        personalLoan: 2,
        creditCard: 1,
        other: 0,
      }),
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
  
    liabilitiesSchema.safeParse.mockReturnValue({ success: true });
  
    mongoose.startSession.mockResolvedValue(mockSession);
  
    User.findOne.mockResolvedValue(mockUser);
  
    liabilities.findOne.mockResolvedValue(mockExistingLiabilities);
  
    liabilities.findOneAndUpdate.mockResolvedValue({
      ...mockExistingLiabilities.toObject(),
      ...mockBody,
    });
  
    req.body = mockBody;
  
    await liabilitiesController(req, res);
  
    const updatedLiabilities = {
      ...mockExistingLiabilities.toObject(),
      ...mockBody,
    };
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Liabilities updated successfully to Networth",
    });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: req.user });
    expect(liabilities.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: mockUser.netWorth.liabilities },
      updatedLiabilities, // Use the merged object
      { new: true }
    );
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(liabilitiesSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  test("should return 403 if input is invalid", async () => {
    const mockBody = { homeLoan: "invalid" };
    liabilitiesSchema.safeParse.mockReturnValue({ success: false, error: { format: () => "Validation Error" } });
    req.body = mockBody;

    await liabilitiesController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Liabilities inputs are wrong", err: "Validation Error" });
  });

  test("should return 403 if liabilities data is NOT updated", async () => {
    const mockUser = { _id: req.user, netWorth: { liabilities: "67b82107183c091d4d3990d0" } };
    const mockBody = {
      homeLoan: 60,
      educationLoan: 12,
      carLoan: 6,
      personalLoan: 3,
      creditCard: 2,
      other: 1,
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    liabilitiesSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    liabilities.findOneAndUpdate.mockResolvedValue(null);

    req.body = mockBody;
    await liabilitiesController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Liabilities not updated" });
  });

  test("should handle database errors and abort transaction", async () => {
    const mockBody = {
      homeLoan: 60,
      educationLoan: 12,
      carLoan: 6,
      personalLoan: 3,
      creditCard: 2,
      other: 1,
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    liabilitiesSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError);

    req.body = mockBody;
    await liabilitiesController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal error", err: "Database error" });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});

