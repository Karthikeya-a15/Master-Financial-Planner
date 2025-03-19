import getDomesticEquityController from "./getDomesticEquityController.js";
import DomesticEquity from "../../models/DomesticEquity.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/DomesticEquity.js");
jest.mock("../../models/User.js");

describe("getDomesticEquityController", () => {
    it("should return domestic equity data for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { domesticEquity: "67b82107183c091d4d3990ca" } };
        const mockDomesticEquity = { directStocks: 50, mutualFunds: 30 };

        User.findById.mockResolvedValue(mockUser);
        DomesticEquity.findById.mockResolvedValue(mockDomesticEquity);
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getDomesticEquityController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ domesticEquity: mockDomesticEquity });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(DomesticEquity.findById).toHaveBeenCalledWith(mockUser.netWorth.domesticEquity);
        expect(DomesticEquity.findById(mockUser.netWorth.domesticEquity).select).toHaveBeenCalledWith('-_id -__v');
    });

    it("should return an error message if domestic equity data is not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { domesticEquity: "67b82107183c091d4d3990ca" } };

        User.findById.mockResolvedValue(mockUser);
        DomesticEquity.findById.mockResolvedValue(null);

        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getDomesticEquityController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching Domestic Equity " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();
        await getDomesticEquityController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});