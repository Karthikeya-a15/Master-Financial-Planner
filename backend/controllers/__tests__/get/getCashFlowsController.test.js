import getCashFlowsController from "../../get/getCashFlowsController.js";
import CashFlows from "../../../models/CashFlows.js";
import User from "../../../models/User.js";

// Mock the models
jest.mock("../../../models/User.js");
jest.mock("../../../models/CashFlows.js");

describe("getCashFlowsController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "user123" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  test("should return cash flows when user and cash flows exist", async () => {
    const mockUser = { netWorth: { cashFlows: "cashFlow123" } };
    const mockCashFlows = { income: 5000, expenses: 2000 };
  
    User.findById.mockResolvedValue(mockUser);
    CashFlows.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockCashFlows), // Mock the select method
    });
  
    await getCashFlowsController(req, res);
  
    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(CashFlows.findById).toHaveBeenCalledWith("cashFlow123");
    expect(res.json).toHaveBeenCalledWith({ cashFlows: mockCashFlows });
  });
  

  test("should return an error message when cash flows do not exist", async () => {
    const mockUser = { netWorth: { cashFlows: "cashFlow123" } };
  
    User.findById.mockResolvedValue(mockUser);
    CashFlows.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null), // Fix for select() method
    });
  
    await getCashFlowsController(req, res);
  
    expect(res.json).toHaveBeenCalledWith({
      message: "Error while Fetching Cash Flows ",
    });
  });
  

  test("should return a 500 error when User.findById throws an error", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getCashFlowsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
