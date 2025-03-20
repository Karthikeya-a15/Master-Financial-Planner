import User from "../../models/User";
import UserActivity from "../../models/UserActivity";
import Goals from "../../models/Goals";

export default async function adminDashboardController(req, res)  {
    try {
        const totalUsers = await User.countDocuments();
        const componentStats = await UserActivity.aggregate([
            {
                $group: {
                    _id: "$component",
                    count: { $sum: 1 }
                }
            }
        ]);
        const investmentDistribution = await Goals.aggregate([
            {
                $unwind : "$goals"
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$goals.time", 2] }, then: "Short Term" },
                                { case: { $lte: ["$goals.time", 6] }, then: "Medium Term" },
                                { case: { $gt: ["$goals.time", 6] }, then: "Long Term" }
                            ]
                        }
                    },
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$goals.amountRequiredToday" }
                }
            }
        ]);

        return res.json({
            totalUsers,
            componentStats,
            investmentDistribution
        });
    } catch(err) {
        return res.status(500).json({message: "Internal error", error: err.message});
    }
}