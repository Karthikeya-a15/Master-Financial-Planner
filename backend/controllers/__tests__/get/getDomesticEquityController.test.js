import getDomesticEquityController from "../../get/getDomesticEquityController.js";
import DomesticEquity from "../../../models/DomesticEquity.js";
import User from "../../../models/User.js";

// Mock the models
jest.mock("../../../models/DomesticEquity.js");
jest.mock("../../../models/User.js");

describe("getDomesticEquityController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Enables method chaining
    };

    jest.clearAllMocks();
  });

  test("should return domestic equity data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { domesticEquity: "67b82107183c091d4d3990ca" },
    };
    const mockDomesticEquity = { directStocks: 50, mutualFunds: 30 };

    User.findById.mockResolvedValue(mockUser);
    DomesticEquity.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockDomesticEquity),
    });

    await getDomesticEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(DomesticEquity.findById).toHaveBeenCalledWith(
      mockUser.netWorth.domesticEquity
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ domesticEquity: mockDomesticEquity });
  });

  test("should return an error message if domestic equity data is not found", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { domesticEquity: "67b82107183c091d4d3990ca" },
    };

    User.findById.mockResolvedValue(mockUser);
    DomesticEquity.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getDomesticEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(DomesticEquity.findById).toHaveBeenCalledWith(
      mockUser.netWorth.domesticEquity
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error while Fetching Domestic Equity ",
    });
  });

  test("should return 500 if User.findById throws an error", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getDomesticEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });

  test("should return 500 if DomesticEquity.findById throws an error", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { domesticEquity: "67b82107183c091d4d3990ca" },
    };

    User.findById.mockResolvedValue(mockUser);
    DomesticEquity.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    await getDomesticEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(DomesticEquity.findById).toHaveBeenCalledWith(
      mockUser.netWorth.domesticEquity
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });

  test("should return 500 if user is not found", async () => {
    User.findById.mockResolvedValue(null);

    await getDomesticEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Cannot read properties of null (reading 'netWorth')",
    });
  });
});
