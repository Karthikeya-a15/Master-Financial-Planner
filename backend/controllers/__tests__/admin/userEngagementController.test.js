import userEngagementController from "../../admin/userEngagementController";
import User from "../../../models/User";

jest.mock("../../../models/User");

describe("userEngagementController", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it("should return user engagement analytics", async () => {
        User.countDocuments.mockResolvedValueOnce(100); // totalUsers
        User.countDocuments.mockResolvedValueOnce(10); // newUsersLastMonth
        User.countDocuments.mockResolvedValueOnce(20); // activeUsersDaily
        User.countDocuments.mockResolvedValueOnce(50); // activeUsersWeekly
        User.countDocuments.mockResolvedValueOnce(80); // activeUsersMonthly
        User.aggregate.mockResolvedValueOnce([{ TotalLogins: 500 }]); // logins
        User.aggregate.mockResolvedValueOnce([{ TimeSpent: 1000 }]); // totalTimeSpent

        await userEngagementController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            totalUsers: 100,
            newUsersLastMonth: 10,
            activeUsers: {
                daily: 20,
                weekly: 50,
                monthly: 80
            },
            logins: 500,
            timeSpent: 1000
        });
    });

    it("should handle errors", async () => {
        User.countDocuments.mockRejectedValueOnce(new Error("Database error"));

        await userEngagementController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error fetching analytics",
            error: expect.any(Error)
        });
    });
});
