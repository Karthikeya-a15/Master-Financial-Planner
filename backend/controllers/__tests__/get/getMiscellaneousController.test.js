import getMiscellaneousController from "../../get/getMiscellaneousController.js";
import miscellaneous from "../../../models/miscellaneous.js";
import User from "../../../models/User.js";

jest.mock("../../../models/miscellaneous.js");
jest.mock("../../../models/User.js");

describe("getMiscellaneousController", () => {
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

  test("should return miscellaneous data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { miscellaneous: "67b82107183c091d4d3990d2" },
    };
    const mockMiscellaneous = { otherInsuranceProducts: 10, smallCase: 5 };

    User.findById.mockResolvedValue(mockUser);
    miscellaneous.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockMiscellaneous),
    });

    await getMiscellaneousController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(miscellaneous.findById).toHaveBeenCalledWith(mockUser.netWorth.miscellaneous);
    expect(res.json).toHaveBeenCalledWith({ miscellaneous: mockMiscellaneous });
  });

  test("should return an error message if miscellaneous data is not found", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { miscellaneous: "67b82107183c091d4d3990d2" },
    };

    User.findById.mockResolvedValue(mockUser);
    miscellaneous.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getMiscellaneousController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(miscellaneous.findById).toHaveBeenCalledWith(mockUser.netWorth.miscellaneous);
    expect(res.json).toHaveBeenCalledWith({ message: "Error while Fetching miscellaneous " });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getMiscellaneousController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
