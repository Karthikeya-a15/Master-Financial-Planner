import express from "express";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { loginSchema } from "../schemas/adminSchema.js";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import User from "../models/User.js";
import UserActivity from "../models/UserActivity.js";
import NewsUpdate from "../models/NewsUpdate.js";
import DomesticEquity from "./../models/DomesticEquity.js"
import Goals from "../models/Goals.js";

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
});

router.get("/midcap-analysis", adminAuth, async (req, res) => {
    try {
        const mutualFunds = await DomesticEquity.aggregate([
            {
                $unwind: "$mutualFunds"
            },
            {
                // $match: {
                //     "mutualFunds.category": "mid cap"
                // }
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

router.post("/news", adminAuth, async (req, res) => {
    try {
        const { title, content, category, priority } = req.body;
        
        const newsUpdate = new NewsUpdate({
            title,
            content,
            category,
            priority,
            publishedBy: req.admin
        });
        
        await newsUpdate.save();
        
        return res.json({
            message: "News update published successfully",
            newsUpdate
        });
    } catch(err) {
        return res.status(500).json({message: "Internal error", error: err.message});
    }
});

router.get("/news", adminAuth, async (req, res) => {
    try {
        const news = await NewsUpdate.find()
            .sort({ publishedAt: -1 })
            .populate('publishedBy', 'email');
            
        return res.json({ news });
    } catch(err) {
        return res.status(500).json({message: "Internal error", error: err.message});
    }
});

export default router;