import adminMutualfundsController from "../../admin/adminMutualfundsController";
import DomesticEquity from "../../../models/DomesticEquity";

jest.mock("../../../models/DomesticEquity");

describe("adminMutualfundsController", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it("should return mutual funds data", async () => {
        DomesticEquity.aggregate.mockResolvedValueOnce([
            { _id: "mid cap", totalInvestment: 10000, investorCount: 5 }
        ]);

        await adminMutualfundsController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            mutualFunds: [{ _id: "mid cap", totalInvestment: 10000, investorCount: 5 }]
        });
    });

    it("should handle errors", async () => {
        DomesticEquity.aggregate.mockRejectedValueOnce(new Error("Database error"));

        await adminMutualfundsController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal error",
            error: "Database error"
        });
    });
});
