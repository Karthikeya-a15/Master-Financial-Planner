import indexFundsController from "../../get/indexFundsController.js";
import User from "../../../models/User.js";
import getFinalIndexFunds from "../../../tools/Index/index.js";

jest.mock("../../../models/User.js");
jest.mock("../../../tools/Index/index.js");

describe("indexFundsController", () => {
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

  test("should return index funds for a valid user", async () => {
    const mockUser = { _id: req.user };
    const mockFunds = [{
      name: 'Motilal Oswal Nifty 200 Momentum 30 Index Fund',
      aum: 773.1619000000001,
      expRatio: 0.31,
      trackErr: 0.1523952755173204
    }];

    User.findById.mockResolvedValue(mockUser);
    getFinalIndexFunds.mockResolvedValue(mockFunds);

    await indexFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(getFinalIndexFunds).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ funds: mockFunds });
  });

  test("should return 403 if user is not found", async () => {
    User.findById.mockResolvedValue(null);

    await indexFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await indexFundsController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      err: "Database error",
    });
  });
});
