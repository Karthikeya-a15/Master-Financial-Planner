import signupController from "../../user/signupController.js";
import mongoose from "mongoose";

jest.mock("../../../schemas/userSchemas", () => ({
  __esModule: true,
  signUpSchema: {
    safeParse: jest.fn(),
  },
}));
import { signUpSchema } from "../../../schemas/userSchemas.js";

jest.mock("../../../models/User", () => {
  return {
    __esModule: true,
    default: class {
      constructor(userData) {
        this.email = userData.email;
        this.password = userData.password;
      }
      hashPassword = jest.fn().mockResolvedValue("hashedPassword");
      save = jest.fn().mockResolvedValue(this);
    },
    findOne: jest.fn(),
    create: jest.fn(),
  };
});
import User from "../../../models/User.js";

jest.mock("../../../models/CashFlows.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/CryptoCurrency.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/Debt.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/DomesticEquity.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/ForeignEquity.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/Liabilities.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/RealEstate.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/miscellaneous.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/Gold.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/Goals.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/returnsAndAssets.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("../../../models/ToolsResults.js", () => ({ create: jest.fn().mockResolvedValue({ _id: "mocked_id" }) }));
jest.mock("mongoose");

describe("signupController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John",
        email: "john@example.com",
        password: "Password123",
        age: 30,
      },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mongoose.startSession.mockResolvedValue({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    });
  });

  it("should register a user successfully", async () => {
    signUpSchema.safeParse.mockReturnValue({
      success: true,
      error: { format: () => "Invalid input" }, // Mock validation error
    });
    User.prototype.hashPassword = jest.fn().mockResolvedValue("hashedPassword");
    User.prototype.save = jest.fn().mockResolvedValue({});
    await signupController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered Successfully",
    });
  });

  it("should return error if user inputs are invalid", async () => {
    signUpSchema.safeParse.mockReturnValue({
      success: false,
      error: { format: () => "Invalid input" }, // Mock validation error
    });
    req.body = {}; // Invalid body
    await signupController(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User inputs are incorrect" })
    );
  });
});
