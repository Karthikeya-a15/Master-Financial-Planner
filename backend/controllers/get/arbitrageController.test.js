
import arbitrageController from "./arbitrageController.js";
import User from "../../models/User.js";
import main from "../../tools/Arbitrage/index.js";
import { createRequest, createResponse } from 'node-mocks-http'; //for creating mock req and res

jest.mock("../../models/User");
jest.mock("../../tools/Arbitrage/index.js");

describe("arbitrageController", () => {
    it("should return arbitrage funds for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId };
        const mockFunds = [{ name: "Fund 1", value: 100 }];

        User.findById.mockResolvedValue(mockUser);
        main.mockResolvedValue(mockFunds);

        const req = createRequest({ user: mockUserId });
        const res = createResponse();

        await arbitrageController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockFunds);
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(main).toHaveBeenCalled();
    });

    it("should return 403 if user is not found", async () => {
        User.findById.mockResolvedValue(null);

        const req = createRequest({ user: "in67b82107183c091d4d3990c3" });
        const res = createResponse();

        await arbitrageController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "User not found" });
    });

    // it("should handle internal server errors", async () => {
    //     const mockError = new Error("Database connection error");
    //     User.findById.mockRejectedValue(mockError);

    //     const req = createRequest({ user: "67b82107183c091d4d3990c3" });
    //     const res = createResponse();

    //     await arbitrageController(req, res);
    //     expect(res.statusCode).toBe(500);
    //     expect(res._getJSONData()).toEqual({
    //         message: "Internal Server Error",
    //         err: "Database connection error",
    //     });
    // });
});