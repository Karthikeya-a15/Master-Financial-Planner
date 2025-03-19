
import indexFundsController from "./indexFundsController.js";
import User from "../../models/User.js";
import getRankOfFunds from "../../tools/Index/index.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/User.js");
jest.mock("../../tools/Index/index.js");

describe("indexFundsController", () => {
    it("should return index funds for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId };
        const mockFunds = [{ name: "Index Fund 1", rank: 1 }];

        User.findById.mockResolvedValue(mockUser);
        getRankOfFunds.mockResolvedValue(mockFunds);
        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await indexFundsController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ funds: mockFunds });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(getRankOfFunds).toHaveBeenCalled();
    });

    it("should return 403 if user is not found", async () => {
        User.findById.mockResolvedValue(null);

        const req = createRequest({user: "in67b82107183c091d4d3990c3"});
        const res = createResponse();
        await indexFundsController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "user Not Found" });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();

        await indexFundsController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server Error", err: "Database error" });
    });
});