import adminDashboardController from "../../admin/adminDashboardController";
import User from "../../../models/User";
import Goals from "../../../models/Goals";

jest.mock("../../../models/User");
jest.mock("../../../models/Goals");

describe("adminDashboardController", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it("should return dashboard data", async () => {
        User.countDocuments.mockResolvedValueOnce(100);
        Goals.aggregate.mockResolvedValueOnce([
            { _id: "Short Term", count: 10, totalAmount: 5000 }
        ]);

        await adminDashboardController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            totalUsers: 100,
            investmentDistribution: [{ _id: "Short Term", count: 10, totalAmount: 5000 }]
        });
    });

    it("should handle errors", async () => {
        User.countDocuments.mockRejectedValueOnce(new Error("Database error"));

        await adminDashboardController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal error",
            error: "Database error"
        });
    });
});
