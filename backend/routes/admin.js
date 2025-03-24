import express from "express";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { loginSchema } from "../schemas/adminSchema.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import User from "../models/User.js";
import DomesticEquity from "./../models/DomesticEquity.js"
import Goals from "../models/Goals.js";
import ChatRoom from "../models/chat-app/ChatRoom.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const body = req.body;
    const {email, password} = body;
    
    let {success, error} = loginSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Invalid input", err : error.format()});
    }

    try {
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(403).json({message : "Admin not found"});
        }

        const isValid = await admin.validatePassword(password);

        if(isValid){
            admin.lastLogin = new Date();
            await admin.save();
            
            const token = jwt.sign({id : admin._id}, process.env.JWT_SECRET);
            return res.status(200).json({
                message : "Login Successful", 
                token,
                
            });
        } else {
            return res.status(403).json({message : "Invalid credentials"});
        }
    } catch(err){
        return res.status(500).json({message : "Internal error", error: err.message});
    }
});

router.get("/dashboard", adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        // const componentStats = await UserActivity.aggregate([
        //     {
        //         $group: {
        //             _id: "$component",
        //             count: { $sum: 1 }
        //         }
        //     }
        // ]);
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
});

router.get("/mutualfunds", adminAuth, async (req, res) => {
    try {
        const mutualFunds = await DomesticEquity.aggregate([
            {
                $unwind: "$mutualFunds"
            },
            {
                $group : {
                    _id : "$mutualFunds.category",
                    totalInvestment: { $sum: "$mutualFunds.currentValue" },
                    investorCount: { $sum: 1 }
                }
            },  
            {
                $sort: { totalInvestment: -1 }
            }
        ]);

        return res.json({ mutualFunds });
    } catch(err) {
        return res.status(500).json({message: "Internal error", error: err.message});
    }
});


router.get('/analytics/user-engagement', adminAuth, async (req, res) => {
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
});

router.get('/analytics/goals', adminAuth, async (req, res) => {
    try{
        const calculateOverallAverages = (goalsAggregation) => {
            if (goalsAggregation.length === 0) return null;
        
            let totalAvgSip = 0, totalShortTerm = 0, totalMediumTerm = 0, totalLongTerm = 0;
            let count = goalsAggregation.length;
        
            goalsAggregation.forEach(goal => {
                totalAvgSip += goal.avgSipRequired;
                totalShortTerm += goal.shortTermAvgSip;
                totalMediumTerm += goal.mediumTermAvgSip;
                totalLongTerm += goal.longTermAvgSip;
            });
        
            return {
                avgSipRequired: totalAvgSip / count,
                shortTermAvgSip: totalShortTerm / count,
                mediumTermAvgSip: totalMediumTerm / count,
                longTermAvgSip: totalLongTerm / count
            };
        };
        
        
        const goalCounts = await Goals.aggregate([
            { $unwind: "$goals" }, 
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $lt: ["$goals.time", 3] },
                            then: "shortTerm",
                            else: {
                                $cond: {
                                    if: { $lt: ["$goals.time", 7] },
                                    then: "mediumTerm",
                                    else: "longTerm"
                                }
                            }
                        }
                    },
                    count: { $sum: 1 } 
                }
            }
        ]);
        const formattedCounts = {
            shortTerm: 0,
            mediumTerm: 0,
            longTerm: 0
        };
        goalCounts.forEach(item => {
            formattedCounts[item._id] = item.count;
        });
        // console.log(formattedCounts);
        const goalsAggregation = await Goals.aggregate([
            {
              $unwind: "$goals"
            },
            {
              $group: {
                _id: "$_id",
                avgSipRequired: { $avg: "$goals.sipRequired" },
                shortTermAvgSip: {
                  $avg: {
                    $cond: [{ $lt: ["$goals.time", 3] }, "$goals.sipRequired", null]
                  }
                },
                mediumTermAvgSip: {
                  $avg: {
                    $cond: [
                      { $and: [{ $gte: ["$goals.time", 3] }, { $lt: ["$goals.time", 7] }] },
                      "$goals.sipRequired",
                      null
                    ]
                  }
                },
                longTermAvgSip: {
                  $avg: {
                    $cond: [{ $gte: ["$goals.time", 7] }, "$goals.sipRequired", null]
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                avgSipRequired: { $ifNull: ["$avgSipRequired", 0] },
                shortTermAvgSip: { $ifNull: ["$shortTermAvgSip", 0] },
                mediumTermAvgSip: { $ifNull: ["$mediumTermAvgSip", 0] },
                longTermAvgSip: { $ifNull: ["$longTermAvgSip", 0] }
              }
            }
          ]);
        const averagesPerTerm = calculateOverallAverages(goalsAggregation);
        // console.log(averagesPerTerm)          
        return res.status(200).json({formattedCounts, averagesPerTerm});
        
    }catch(error){
        return res.status(500).json({message: "Internal Server Error", error : error.message});
    }
})

router.post("/rooms", adminAuth, async (req, res)=>{
    try{
        const { name, description } = req.body;
        const room = await ChatRoom.create({name, description});

        return res.json({room});
    }catch(err){
        return res.status(500).json({error : err.message})
    }
})
export default router;