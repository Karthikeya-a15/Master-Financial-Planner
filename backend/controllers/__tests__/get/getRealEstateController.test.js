import getRealEstateController from "../../get/getRealEstateController.js";
import RealEstate from "../../../models/RealEstate.js";
import User from "../../../models/User.js";

jest.mock("../../../models/RealEstate.js");
jest.mock("../../../models/User.js");

describe("getRealEstateController", () => {
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

  test("should return real estate data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { realEstate: "67b82107183c091d4d3990d4" },
    };
    const mockRealEstate = { home: 100, otherRealEstate: 50, REITs: 15 };

    User.findById.mockResolvedValue(mockUser);
    RealEstate.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockRealEstate),
    });
    
    await getRealEstateController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(RealEstate.findById).toHaveBeenCalledWith(mockUser.netWorth.realEstate);
    expect(res.json).toHaveBeenCalledWith({ realEstate: mockRealEstate });
  });

  test("should return an error message if real estate data is not found", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { realEstate: "67b82107183c091d4d3990d4" },
    };

    User.findById.mockResolvedValue(mockUser);
    RealEstate.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });   

    await getRealEstateController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(RealEstate.findById).toHaveBeenCalledWith(mockUser.netWorth.realEstate);
    expect(res.json).toHaveBeenCalledWith({message : "Error while Fetching Real Estate"});
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getRealEstateController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
