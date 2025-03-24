import express from "express";
import User from "../models/User.js";

import userAuth from "../middleware/userAuthMiddleware.js";


import ChatRoom from "../models/chat-app/ChatRoom.js";

import { uploadImage } from "../controllers/post/uploadController.js";
import upload from "../middleware/multerConfig.js";
import chatUpload from "../middleware/chatMulterConfig.js";
import chatUploadController from "../controllers/post/chatUploadController.js";
import signupController from "../controllers/user/signupController.js";
import loginController from "../controllers/user/loginController.js"
import logoutConroller from "../controllers/user/logoutController.js"
import profileController from "../controllers/user/profileController.js"
import saveFireController from "../controllers/user/saveFireController.js"
import forgotPasswordController from "../controllers/user/forgotpasswordController.js"
import resetPasswordController from "../controllers/user/resetPasswordController.js"

const router = express.Router();

router.post("/signup",signupController)

router.post("/login", loginController);

router.post("/logout", userAuth, logoutConroller);

//profile-upload
router.post("/upload", userAuth, upload.single("image"), uploadImage);

//chat-upload
router.post("/chat-upload", chatUpload.single("file"), chatUploadController);

router.put("/profile", userAuth, profileController);

router.get("/me", userAuth, async(req, res)=>{
    const user = await User.findOne({
        _id : req.user
    })
    return res.status(200).json({"id" : user._id, "name" : user.name, "email" : user.email, "age" : user.age, "imageURL" : user.imageURL, "fire" : user.fireNumber});
})


router.put("/save-fire-number", userAuth , saveFireController);

router.get("/rooms", async (req, res)=>{
    const rooms = await ChatRoom.find();
    return res.json(rooms);
})

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);
export default router;