import getGoldController from "../../get/getGoldController.js";
import GoldModel from "../../../models/Gold.js";
import User from "../../../models/User.js";

jest.mock("../../../models/Gold.js");
jest.mock("../../../models/User.js");

describe("getGoldController", () => {
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

  test("should return gold data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { gold: "67b82107183c091d4d3990ce" },
    };
    const mockGold = { jewellery: 5, SGB: 2, digitalGoldAndETF: 3 };

    User.findById.mockResolvedValue(mockUser);
    GoldModel.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockGold),
    });

    await getGoldController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(GoldModel.findById).toHaveBeenCalledWith(mockUser.netWorth.gold);
    expect(res.json).toHaveBeenCalledWith({ gold: mockGold });
  });

  test("should return an error message if gold data is not found", async () => {
    const mockUser = { _id: req.user, netWorth: { gold: "goldId" } };

    User.findById.mockResolvedValue(mockUser);
    GoldModel.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getGoldController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(GoldModel.findById).toHaveBeenCalledWith(mockUser.netWorth.gold);
    expect(res.json).toHaveBeenCalledWith({ message: "Error while Fetching Gold " });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getGoldController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
