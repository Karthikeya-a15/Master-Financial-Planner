import User from "../../models/User.js";
import Goals from "../../models/Goals.js";

export default async function adminDashboardController(req, res)  {
    try {
        const totalUsers = await User.countDocuments();
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
            investmentDistribution
        });
    } catch(err) {
        return res.status(500).json({message: "Internal error", error: err.message});
    }
}