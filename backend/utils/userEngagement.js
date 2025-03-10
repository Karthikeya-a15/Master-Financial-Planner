import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import adminAuth from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.use(adminAuth)

router.get('/analytics/user-engagement', async (req, res) => {
    console.log("hello");
    try {
        const totalUsers = await User.countDocuments();
        
        const newUsersLastMonth = await User.countDocuments({
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
        });

        const activeUsersDaily = await User.countDocuments({
            lastLogin: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) }
        });

        const activeUsersWeekly = await User.countDocuments({
            lastLogin: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        });

        const activeUsersMonthly = await User.countDocuments({
            lastLogin: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
        });

        res.json({
            totalUsers,
            newUsersLastMonth,
            activeUsers: {
                daily: activeUsersDaily,
                weekly: activeUsersWeekly,
                monthly: activeUsersMonthly
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching analytics", error });
    }
});

export default router;
