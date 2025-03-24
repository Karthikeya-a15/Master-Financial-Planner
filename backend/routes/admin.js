import express from "express";
import adminAuth from "../middleware/adminAuthMiddleware.js";
import ChatRoom from "../models/chat-app/ChatRoom.js";
import adminLoginController from "../controllers/admin/adminLoginController.js"
import adminDashboardController from "../controllers/admin/adminDashboardController.js"
import adminMutualfundsController from "../controllers/admin/adminMutualfundsController.js"
import userEngagementController from "../controllers/admin/userEngagementController.js"
import goaslController from "../controllers/admin/goalsController.js"
const router = express.Router();

router.post("/login", adminLoginController);

router.get("/dashboard", adminAuth, adminDashboardController);

router.get("/mutualfunds", adminAuth, adminMutualfundsController);

router.get('/analytics/user-engagement', adminAuth, userEngagementController);

router.get('/analytics/goals', adminAuth, goaslController);

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