import getForeignEquityController from "../../get/getForeignEquityController.js";
import ForeignEquity from "../../../models/ForeignEquity.js";
import User from "../../../models/User.js";

jest.mock("../../../models/ForeignEquity.js");
jest.mock("../../../models/User.js");

describe("getForeignEquityController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return foreign equity data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { foreignEquity: "67b82107183c091d4d3990cc" },
    };
    const mockForeignEquity = { sAndp500: 20, otherETF: 10, mutualFunds: 15 };

    User.findById.mockResolvedValue(mockUser);
    ForeignEquity.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockForeignEquity),
    });

    await getForeignEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(ForeignEquity.findById).toHaveBeenCalledWith(mockUser.netWorth.foreignEquity);
    expect(res.json).toHaveBeenCalledWith({ foreignEquity: mockForeignEquity });
  });

  test("should return an error message if foreign equity data is not found", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { foreignEquity: "67b82107183c091d4d3990cc" },
    };

    User.findById.mockResolvedValue(mockUser);
    ForeignEquity.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getForeignEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(ForeignEquity.findById).toHaveBeenCalledWith(mockUser.netWorth.foreignEquity);
    expect(res.json).toHaveBeenCalledWith({ message: "Error while Fetching Foreign Equity " });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getForeignEquityController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
