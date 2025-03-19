import getCryptoController from "./getCryptoController.js";
import CryptoCurrency from "../../models/CryptoCurrency.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/CryptoCurrency.js");
jest.mock("../../models/User.js");

describe("getCryptoController", () => {
    it("should return cryptocurrency data for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { cryptocurrency: "67b82107183c091d4d3990c6" } };
        const mockCrypto = { crypto: 1000 };

        User.findById.mockResolvedValue(mockUser);
        CryptoCurrency.findById.mockResolvedValue(mockCrypto);

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getCryptoController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ cryptoCurrency: mockCrypto });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(CryptoCurrency.findById).toHaveBeenCalledWith(mockUser.netWorth.cryptocurrency);
        expect(CryptoCurrency.findById(mockUser.netWorth.cryptocurrency).select).toHaveBeenCalledWith('-_id -__v');
    });

    it("should return an error message if cryptocurrency data is not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { cryptocurrency: "67b82107183c091d4d3990c6" } };

        User.findById.mockResolvedValue(mockUser);
        CryptoCurrency.findById.mockResolvedValue(null);

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getCryptoController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching Cryptocurrency " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();

        await getCryptoController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});