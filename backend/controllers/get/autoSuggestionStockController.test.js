import autoSuggestionStockController from "./autoSuggestionStockController.js";
import { stockMapping } from "../../utils/stock_mapping.js";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("../../utils/stock_mapping.js", () => ({
    stockMapping: {
        "RELIANCE": {},
        "RELIANCE INDUSTRIES": {},
        "TATA": {},
    },
}));

describe("autoSuggestionStockController", () => {
    it("should return stock suggestions based on name", async () => {
        const req = createRequest({ query: { name: "rel" } });
        const res = createResponse();

        await autoSuggestionStockController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            suggestions: ["RELIANCE", "RELIANCE INDUSTRIES"],
        });
    });

    it("should return empty suggestions if no match", async () => {
        const req = createRequest({ query: { name: "xyz" } });
        const res = createResponse();

        await autoSuggestionStockController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ suggestions: [] });
    });

    it("should return all suggestions if name query is empty", async () => {
        const req = createRequest({ query: { name: "" } });
        const res = createResponse();

        await autoSuggestionStockController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            suggestions: ["RELIANCE", "RELIANCE INDUSTRIES", "TATA"],
        });
    });

    it("should handle case-insensitive matches", async () => {
        const req = createRequest({ query: { name: "REL" } });
        const res = createResponse();

        await autoSuggestionStockController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            suggestions: ["RELIANCE", "RELIANCE INDUSTRIES"],
        });
    });
});