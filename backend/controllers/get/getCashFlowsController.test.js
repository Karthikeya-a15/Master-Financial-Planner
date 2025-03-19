import getCashFlowsController from "./getCashFlowsController.js";
import CashFlows from "../../models/CashFlows.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/CashFlows.js");
jest.mock("../../models/User.js");

describe("getCashFlowsController", () => {
    it("should return cash flows for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { cashFlows: "67b82107183c091d4d3990c4" } };
        const mockCashFlows = { inflows: {}, outflows: {} };

        User.findById.mockResolvedValue(mockUser);
        CashFlows.findById.mockResolvedValue(mockCashFlows);

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getCashFlowsController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ cashFlows: mockCashFlows });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(CashFlows.findById).toHaveBeenCalledWith(mockUser.netWorth.cashFlows);
        expect(CashFlows.findById(mockUser.netWorth.cashFlows).select).toHaveBeenCalledWith('-_id -__v');
    });

    it("should return an error message if cash flows are not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { cashFlows: "67b82107183c091d4d3990c4" } };

        User.findById.mockResolvedValue(mockUser);
        CashFlows.findById.mockResolvedValue(null); // CashFlows not found

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getCashFlowsController(req, res);

        expect(res.statusCode).toBe(200); //returns 200 not 403 as per the controller
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching Cash Flows " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);

        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();

        await getCashFlowsController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});