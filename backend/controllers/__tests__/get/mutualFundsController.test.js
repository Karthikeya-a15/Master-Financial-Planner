import mutualFundsController from "../../get/mutualFundsController.js";
import User from "../../../models/User.js";
import main from "../../../tools/MFs/index.js";

jest.mock("../../../models/User.js");
jest.mock("../../../tools/MFs/index.js");

describe("mutualFundsController", () => {
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

  test("should return mutual funds for a valid user", async () => {
    const mockUser = { _id: req.user };
    const mockFunds = [{ "SmallCapFund": [{
      name: 'Bandhan Small Cap',
      AUM: 8474.84,
      FiveYearCAGR: 35.93,
      SortinoRatio: 0.98,
      expenseRatio: 0.46,
      FiveYearAvgRollingReturns: 33.77,
      GreaterThan15Probability: 100
    }] }];

    User.findById.mockResolvedValue(mockUser);
    main.mockResolvedValue(mockFunds);

    await mutualFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(main).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ funds: mockFunds });
  });

  test("should return 403 if user is not found", async () => {
    User.findById.mockResolvedValue(null);

    await mutualFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await mutualFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      err: "Database error",
    });
  });
});
