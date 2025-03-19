
import getGoldController from "./getGoldController.js";
import GoldModel from "../../models/Gold.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';


jest.mock("../../models/Gold.js");
jest.mock("../../models/User.js");

describe("getGoldController", () => {
    it("should return gold data for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { gold: "67b82107183c091d4d3990ce" } };
        const mockGold = { jewellery: 5, SGB: 2, digitalGoldAndETF: 3 };

        User.findById.mockResolvedValue(mockUser);
        GoldModel.findById.mockResolvedValue(mockGold);
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getGoldController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ gold: mockGold });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(GoldModel.findById).toHaveBeenCalledWith(mockUser.netWorth.gold);
        expect(GoldModel.findById(mockUser.netWorth.gold).select).toHaveBeenCalledWith('-_id -__v');
    });

    it("should return an error message if gold data is not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { gold: "goldId" } };

        User.findById.mockResolvedValue(mockUser);
        GoldModel.findById.mockResolvedValue(null);
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getGoldController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching Gold " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();
        await getGoldController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});