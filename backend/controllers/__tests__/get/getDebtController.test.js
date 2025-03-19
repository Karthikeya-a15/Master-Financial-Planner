import getDebtController from "../../get/getDebtController.js";
import Debt from "../../../models/Debt.js";
import User from "../../../models/User.js";

// Mock the models
jest.mock("../../../models/Debt.js");
jest.mock("../../../models/User.js");

describe("getDebtController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Enables method chaining
    };

    jest.clearAllMocks();
  });

  test("should return debt data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { debt: "67b82107183c091d4d3990c8" },
    };
    const mockDebt = {
      liquidFund: 10,
      fixedDeposit: 20,
      debtFunds: 30,
      governmentInvestments: 40,
    };

    User.findById.mockResolvedValue(mockUser);
    Debt.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockDebt),
    });

    await getDebtController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(Debt.findById).toHaveBeenCalledWith(mockUser.netWorth.debt);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ debt: mockDebt });
  });

  test("should return an error message if debt data is not found", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { debt: "67b82107183c091d4d3990c8" },
    };

    User.findById.mockResolvedValue(mockUser);
    Debt.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getDebtController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(Debt.findById).toHaveBeenCalledWith(mockUser.netWorth.debt);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Error while Fetching Debt"});
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getDebtController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
