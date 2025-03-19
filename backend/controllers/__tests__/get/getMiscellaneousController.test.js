import getMiscellaneousController from "../../get/getMiscellaneousController.js";
import miscellaneous from "../../../models/miscellaneous.js";
import User from "../../../models/User.js";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("../../../models/miscellaneous.js");
jest.mock("../../../models/User.js");

describe("getMiscellaneousController", () => {
  it("should return miscellaneous data for a valid user", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { miscellaneous: "67b82107183c091d4d3990d2" },
    };
    const mockMiscellaneous = { otherInsuranceProducts: 10, smallCase: 5 };

    User.findById.mockResolvedValue(mockUser);
    miscellaneous.findById.mockResolvedValue(mockMiscellaneous);

    const req = createRequest({ user: mockUserId });
    const res = createResponse();
    await getMiscellaneousController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ miscellaneous: mockMiscellaneous });
    expect(User.findById).toHaveBeenCalledWith(mockUserId);
    expect(miscellaneous.findById).toHaveBeenCalledWith(
      mockUser.netWorth.miscellaneous,
    );
    expect(
      miscellaneous.findById(mockUser.netWorth.miscellaneous).select,
    ).toHaveBeenCalledWith("-_id -__v");
  });

  it("should return an error message if miscellaneous data is not found", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      netWorth: { miscellaneous: "67b82107183c091d4d3990d2" },
    };

    User.findById.mockResolvedValue(mockUser);
    miscellaneous.findById.mockResolvedValue(null);

    const req = createRequest({ user: mockUserId });
    const res = createResponse();
    await getMiscellaneousController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Error while Fetching liabilities ",
    });
  });

  it("should handle internal server errors", async () => {
    const mockError = new Error("Database error");
    User.findById.mockRejectedValue(mockError);

    const req = createRequest({ user: "67b82107183c091d4d3990c3" });
    const res = createResponse();
    await getMiscellaneousController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
