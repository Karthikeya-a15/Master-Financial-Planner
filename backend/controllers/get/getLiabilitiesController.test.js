import getLiabilitiesController from "./getLiabilitiesController.js";
import liabilities from "../../models/Liabilities.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';


jest.mock("../../models/Liabilities.js");
jest.mock("../../models/User.js");

describe("getLiabilitiesController", () => {
    it("should return liabilities data for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { liabilities: "67b82107183c091d4d3990d0" } };
        const mockLiabilities = { homeLoan: 50, educationLoan: 10, carLoan: 5, personalLoan: 2, creditCard: 1, other: 0 };

        User.findById.mockResolvedValue(mockUser);
        liabilities.findById.mockResolvedValue(mockLiabilities);
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getLiabilitiesController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ liabilities: mockLiabilities });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(liabilities.findById).toHaveBeenCalledWith(mockUser.netWorth.liabilities);
        expect(liabilities.findById(mockUser.netWorth.liabilities).select).toHaveBeenCalledWith('-_id -__v');
    });

    it("should return an error message if liabilities data is not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { liabilities: "67b82107183c091d4d3990d0" } };

        User.findById.mockResolvedValue(mockUser);
        liabilities.findById.mockResolvedValue(null);
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getLiabilitiesController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching liabilities " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();
        await getLiabilitiesController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});