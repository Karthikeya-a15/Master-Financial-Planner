import getLiabilitiesController from "../../get/getLiabilitiesController.js";
import liabilities from "../../../models/Liabilities.js";
import User from "../../../models/User.js";

jest.mock("../../../models/Liabilities.js");
jest.mock("../../../models/User.js");

describe("getLiabilitiesController", () => {
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

  test("should return liabilities data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { liabilities: "67b82107183c091d4d3990d0" },
    };
    const mockLiabilities = {
      homeLoan: 50,
      educationLoan: 10,
      carLoan: 5,
      personalLoan: 2,
      creditCard: 1,
      other: 0,
    };

    User.findById.mockResolvedValue(mockUser);
    liabilities.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockLiabilities),
    });

    await getLiabilitiesController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(liabilities.findById).toHaveBeenCalledWith(mockUser.netWorth.liabilities);
    expect(res.json).toHaveBeenCalledWith({ liabilities: mockLiabilities });
  });

  test("should return an error message if liabilities data is not found", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { liabilities: "67b82107183c091d4d3990d0" },
    };

    User.findById.mockResolvedValue(mockUser);
    liabilities.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getLiabilitiesController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(liabilities.findById).toHaveBeenCalledWith(mockUser.netWorth.liabilities);
    expect(res.json).toHaveBeenCalledWith({ message: "Error while Fetching liabilities " });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getLiabilitiesController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
