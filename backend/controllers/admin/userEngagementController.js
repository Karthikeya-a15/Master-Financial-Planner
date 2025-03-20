import User from "../../models/User";
export default async function userEngagementController(req, res) {
    // console.log(req);
    try {
        const totalUsers = await User.countDocuments();
        
        const newUsersLastMonth = await User.countDocuments({
            "userEngagement.createdAt": { 
                $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) 
            }
        });

        const activeUsersDaily = await User.countDocuments({
            "userEngagement.lastLogin": { 
                $gte: new Date(new Date().setDate(new Date().getDate() - 1)) 
            }
        });
        
        const activeUsersWeekly = await User.countDocuments({
            "userEngagement.lastLogin": { 
                $gte: new Date(new Date().setDate(new Date().getDate() - 7)) 
            }
        });
        
        const activeUsersMonthly = await User.countDocuments({
            "userEngagement.lastLogin": { 
                $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) 
            }
        });
        
        const logins = await User.aggregate([
            {
                $group: {
                    _id: null,
                    TotalLogins: { $sum: "$userEngagement.loginFrequency" } 
                }
            }
        ]);

        const totalTimeSpent = await User.aggregate([
            {
                $group: {
                    _id: null,
                    TimeSpent: {$sum: "$userEngagement.timeSpent"}
                }
            }
        ])

        res.json({
            totalUsers,
            newUsersLastMonth,
            activeUsers: {
                daily: activeUsersDaily,
                weekly: activeUsersWeekly,
                monthly: activeUsersMonthly
            },
            logins : logins[0].TotalLogins,
            timeSpent: totalTimeSpent[0].TimeSpent
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching analytics", error });
    }
}