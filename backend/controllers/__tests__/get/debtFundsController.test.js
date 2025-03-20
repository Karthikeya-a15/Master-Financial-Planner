import debtFundsController from "../../get/debtFundsController.js";
import User from "../../../models/User.js";
import DebtFunds from "../../../tools/Debt/index.js";

// Mock the models
jest.mock("../../../models/User.js");
jest.mock("../../../tools/Debt/index.js");

describe("debtFundsController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows method chaining
    };

    jest.clearAllMocks();
  });

  test("should return debt funds for a valid user", async () => {
    const mockUser = { _id: req.user };
    const mockFunds = [{
      liquidFund: [
        { particulars: "HDFC Bank", currentValue: 152000 },
        { particulars: "SBI Bank", currentValue: 20000 },
      ],
      fixedDeposit: [
        { bankName: "Axis", currentValue: 90000 },
        { bankName: "Kotak", currentValue: 500000 },
      ],
      debtFunds: [
        { name: "ICICI Corporate Bond Fund", currentValue: 176000 },
        { name: "Axis", currentValue: 85000 },
      ],
      governmentInvestments: [
        { name: "PPF", currentValue: 3000 },
        { name: "Sukanya Samriddhi Yojana", currentValue: 252000 },
        { name: "EPF", currentValue: 3000 },
      ],
      sipDebt: [
        { name: "Ujivan Bank FD", duration: "FD/RD/Arbitrage", currentValue: 600 },
        { name: "Federal Bank FD", duration: "FD/RD/Arbitrage", currentValue: 400 },
        { name: "IDFC Corp Bond Fund", duration: "Banking PSU/Corporate funds", currentValue: 5300 },
        { name: "PF", duration: "Government Securities/Equity Saver", currentValue: 1000 },
        { name: "Kotak Equity Savings Fund", duration: "Government Securities/Equity Saver", currentValue: 400 },
        { name: "Axis Arbitrage", duration: "FD/RD/Arbitrage", currentValue: 5000 },
      ],
    }];

    User.findById.mockResolvedValue(mockUser);
    DebtFunds.mockResolvedValue(mockFunds);

    await debtFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(DebtFunds).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200); // Corrected
    expect(res.json).toHaveBeenCalledWith(mockFunds); // Corrected
  });

  test("should return 403 if user is not found", async () => {
    User.findById.mockResolvedValue(null);

    await debtFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(403); // Corrected
    expect(res.json).toHaveBeenCalledWith({ message: "user Not Found" }); // Corrected
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await debtFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500); // Corrected
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "Database error",
    }); // Corrected
  });
});
