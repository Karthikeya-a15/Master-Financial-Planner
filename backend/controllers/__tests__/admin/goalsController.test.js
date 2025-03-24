import goalsController from "../../admin/goalsController";
import Goals from "../../../models/Goals";

jest.mock("../../../models/Goals");

describe("goalsController", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it("should return goal counts and averages", async () => {
        Goals.aggregate
            .mockResolvedValueOnce([{ _id: "shortTerm", count: 5 }]) // goalCounts
            .mockResolvedValueOnce([
                {
                    avgSipRequired: 1000,
                    shortTermAvgSip: 500,
                    mediumTermAvgSip: 300,
                    longTermAvgSip: 200
                }
            ]); // goalsAggregation

        await goalsController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            formattedCounts: { shortTerm: 5, mediumTerm: 0, longTerm: 0 },
            averagesPerTerm: {
                avgSipRequired: 1000,
                shortTermAvgSip: 500,
                mediumTermAvgSip: 300,
                longTermAvgSip: 200
            }
        });
    });

    it("should handle errors", async () => {
        Goals.aggregate.mockRejectedValueOnce(new Error("Database error"));

        await goalsController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal Server Error",
            error: "Database error"
        });
    });
});
