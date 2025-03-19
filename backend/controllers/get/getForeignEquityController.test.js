
import getForeignEquityController from "./getForeignEquityController.js";
import ForeignEquity from "../../models/ForeignEquity.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';


jest.mock("../../models/ForeignEquity.js");
jest.mock("../../models/User.js");

describe("getForeignEquityController", () => {
    it("should return foreign equity data for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { foreignEquity: "67b82107183c091d4d3990cc" } };
        const mockForeignEquity = { sAndp500: 20, otherETF: 10, mutualFunds: 15 };

        User.findById.mockResolvedValue(mockUser);
        ForeignEquity.findById.mockResolvedValue(mockForeignEquity);

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getForeignEquityController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ foreignEquity: mockForeignEquity });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(ForeignEquity.findById).toHaveBeenCalledWith(mockUser.netWorth.foreignEquity);
        expect(ForeignEquity.findById(mockUser.netWorth.foreignEquity).select).toHaveBeenCalledWith('-_id -__v');

    });

    it("should return an error message if foreign equity data is not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { foreignEquity: "67b82107183c091d4d3990cc" } };

        User.findById.mockResolvedValue(mockUser);
        ForeignEquity.findById.mockResolvedValue(null);
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getForeignEquityController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching Foreign Equity " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();
        await getForeignEquityController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});