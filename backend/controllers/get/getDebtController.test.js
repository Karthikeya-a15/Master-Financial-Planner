import getDebtController from "./getDebtController.js";
import Debt from "../../models/Debt.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/Debt.js");
jest.mock("../../models/User.js");

describe("getDebtController", () => {
    it("should return debt data for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { debt: "67b82107183c091d4d3990c8" } };
        const mockDebt = { liquidFund: 10, fixedDeposit: 20, debtFunds: 30, governmentInvestments: 40 };

        User.findById.mockResolvedValue(mockUser);
        Debt.findById.mockResolvedValue(mockDebt);

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getDebtController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ debt: mockDebt });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(Debt.findById).toHaveBeenCalledWith(mockUser.netWorth.debt);
        expect(Debt.findById(mockUser.netWorth.debt).select).toHaveBeenCalledWith('-_id -__v');

    });

    it("should return an error message if debt data is not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { debt: "67b82107183c091d4d3990c8" } };

        User.findById.mockResolvedValue(mockUser);
        Debt.findById.mockResolvedValue(null);

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getDebtController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching Debt " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();

        await getDebtController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});