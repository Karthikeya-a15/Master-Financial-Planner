import getAssumptionController from "../../get/getAssumptionController.js";
import RAM from "../../../models/returnsAndAssets.js";
import User from "../../../models/User.js";

// Mock the models
jest.mock("../../../models/returnsAndAssets.js");
jest.mock("../../../models/User.js");

describe("getAssumptionController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  test("should return returns and assets for a valid user", async () => {
    const mockUser = { _id: req.user, ram: "67b82107183c091d4d3990d9" };
    const mockRam = {
      expectedReturns: { domesticEquity: 12, usEquity: 12, debt: 6, gold: 6, crypto: 20, realEstate: 10 },
      shortTerm: { domesticEquity: 0, usEquity: 0, debt: 100, gold: 0, crypto: 0, realEstate: 0 },
      mediumTerm: { domesticEquity: 40, usEquity: 0, debt: 50, gold: 10, crypto: 0, realEstate: 0 },
      longTerm: { domesticEquity: 60, usEquity: 10, debt: 15, gold: 5, crypto: 5, realEstate: 5 },
      effectiveReturns: { shortTermReturns: 6, mediumTermReturns: 6.96, longTermReturns: 11.1 },
    };

    User.findById.mockResolvedValue(mockUser);
    RAM.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockRam),
    });

    await getAssumptionController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(RAM.findById).toHaveBeenCalledWith(mockUser.ram);
    expect(res.json).toHaveBeenCalledWith({ returnsAndAssets: mockRam });
  });

  test("should return an error message if RAM is not found", async () => {
    const mockUser = { _id: req.user, ram: "67b82107183c091d4d3990d9" };

    User.findById.mockResolvedValue(mockUser);
    RAM.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getAssumptionController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(RAM.findById).toHaveBeenCalledWith(mockUser.ram);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error while Fetching Returns & Assets Mix Assumption ",
    });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getAssumptionController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
