import getRealEstateController from "../../get/getRealEstateController.js";
import RealEstate from "../../../models/RealEstate.js";
import User from "../../../models/User.js";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("../../../models/RealEstate.js");
jest.mock("../../../models/User.js");

describe("getRealEstateController", () => {
  it("should return real estate data for a valid user", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { realEstate: "67b82107183c091d4d3990d4" },
    };
    const mockRealEstate = { home: 100, otherRealEstate: 50, REITs: 15 };

    User.findById.mockResolvedValue(mockUser);
    RealEstate.findById.mockResolvedValue(mockRealEstate);
    const req = createRequest({ user: mockUserId });
    const res = createResponse();
    await getRealEstateController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ realEstate: mockRealEstate });
    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(RealEstate.findById).toHaveBeenCalledWith(
      mockUser.netWorth.realEstate,
    );
    expect(
      RealEstate.findById(mockUser.netWorth.realEstate).select,
    ).toHaveBeenCalledWith("-_id -__v");
  });

  it("should return an error message if real estate data is not found", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { realEstate: "67b82107183c091d4d3990d4" },
    };

    User.findById.mockResolvedValue(mockUser);
    RealEstate.findById.mockResolvedValue(null);
    const req = createRequest({ user: mockUserId });
    const res = createResponse();
    await getRealEstateController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Error while Fetching Real Estate ",
    });
  });

  it("should handle internal server errors", async () => {
    const mockError = new Error("Database error");
    User.findById.mockRejectedValue(mockError);
    const req = createRequest({ user: "67b82107183c091d4d3990c3" });
    const res = createResponse();
    await getRealEstateController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
