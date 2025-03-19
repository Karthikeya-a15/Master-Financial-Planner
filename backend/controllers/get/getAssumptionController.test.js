import getAssumptionController from "./getAssumptionController.js";
import RAM from "../../models/returnsAndAssets.js";
import User from "../../models/User.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/returnsAndAssets.js");
jest.mock("../../models/User.js");

describe("getAssumptionController", () => {
    it("should return returns and assets for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, ram: "67b82107183c091d4d3990d9" };
        const mockRam = { expectedReturns: {}, shortTerm: {}, mediumTerm: {}, longTerm: {} };

        User.findById.mockResolvedValue(mockUser);
        RAM.findById.mockResolvedValue(mockRam);

        const req = createRequest({user: mockUserId});
        const res = createResponse();

        await getAssumptionController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ returnsAndAssets: mockRam });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(RAM.findById).toHaveBeenCalledWith(mockUser.ram);
        // Check if select was called with the correct arguments
        expect(RAM.findById(mockUser.ram).select).toHaveBeenCalledWith('-_id -__v');

    });

    it("should return an error message if RAM is not found", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, ram: "67b82107183c091d4d3990d9" };

        User.findById.mockResolvedValue(mockUser);
        RAM.findById.mockResolvedValue(null); // RAM not found

        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getAssumptionController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Error while Fetching Returns & Assets Mix Assumption " });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);

        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();
        await getAssumptionController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal Server error", err: "Database error" });
    });
});