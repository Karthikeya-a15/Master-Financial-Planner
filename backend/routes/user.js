import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { signUpSchema, loginSchema } from "../schemas/userSchemas.js";
import userAuth from "../middleware/userAuthMiddleware.js";

import CashFlows from "../models/CashFlows.js";
import CryptoCurrency from "../models/CryptoCurrency.js";
import Debt from "../models/Debt.js";
import DomesticEquity from "../models/DomesticEquity.js";
import ForeignEquity from "../models/ForeignEquity.js";
import liabilities from "../models/Liabilities.js";
import RealEstate from "../models/RealEstate.js";
import miscellaneous from "../models/miscellaneous.js";
import GoldModel from "../models/Gold.js";
import Goals from "../models/Goals.js";
import RAM from "../models/returnsAndAssets.js";
import Result from "../models/ToolsResults.js";
import ChatRoom from "../models/chat-app/ChatRoom.js";
import mongoose from "mongoose";
import axios from "axios";
import xml2js from "xml2js";


import { uploadImage } from "../controllers/post/uploadController.js";
import upload from "../middleware/multerConfig.js";
import chatUpload from "../middleware/chatMulterConfig.js";
import chatUploadController from "../controllers/post/chatUploadController.js";



const router = express.Router();

router.post("/signup",async (req, res) => {
    const body = req.body;

    let {success, error} = signUpSchema.safeParse(body);

    const session = await mongoose.startSession();
    session.startTransaction();
    try{
    
    if(!success){
        return res.status(403).json({message: "User inputs are incorrect",err : error.format()});
    }

        const {name, email, password, age} = body;

        const user = new User(body);

        user.password = await user.hashPassword();
        
        const userCashFlows = await CashFlows.create({});
        const userCrypto = await CryptoCurrency.create({});
        const userDebt = await Debt.create({});
        const userDomesticEquity = await DomesticEquity.create({});
        const userForeignEquity = await ForeignEquity.create({});
        const userGold = await GoldModel.create({});
        const userLiabilities = await liabilities.create({});
        const userMisc = await miscellaneous.create({});
        const userRealEstate = await RealEstate.create({});
        const userGoals = await Goals.create({});
        const userReturnsAndAssets = await RAM.create({});
        const userToolResults = await Result.create({});
        user.netWorth = {
            cashFlows : userCashFlows._id,
            domesticEquity : userDomesticEquity._id,
            debt : userDebt._id,
            realEstate : userRealEstate._id,
            foreignEquity : userForeignEquity._id,
            cryptocurrency : userCrypto._id,
            gold : userGold._id,
            liabilities : userLiabilities._id,
            miscellaneous : userMisc._id
        };
        
        user.goals = userGoals._id;
        user.ram = userReturnsAndAssets._id;
        user.toolResult = userToolResults._id;
        
        await user.save();
        await session.commitTransaction();
        session.endSession();

        return res.json({message : "User registered Successfully"});
    }
    catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(401).json({error : err.message, message : "User Already exists"});
    }
});

router.post("/login", async (req, res) => {
    const body = req.body;
    const {email,password} = body;
    
    let {success, error} = loginSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "User inputs are wrong",err : error.format()});
    }

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(403).json({message : "User not found"});
        }

        const isUserExist = await user.validatePassword(password);

        if(isUserExist){
            user.userEngagement.loginFrequency += 1;
            user.userEngagement.lastLogin = new Date();
            const token = await jwt.sign({id : user._id},process.env.JWT_SECRET,{
                expiresIn: "1d",
            });
            await user.save();
            return res.status(200).json({message : "Login Successful", token});
        }else{
            return res.status(403).json({message : "Username or Password is wrong"});
        }
    }
    catch(err){
        return res.status(500).json({message : "Internal error"});
    }
});

router.post("/logout", userAuth, async (req, res) => {
    const userId = req.user;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(500).json({message : "User not found"});
        }
        const lastLogin = new Date(user.userEngagement.lastLogin);
        const currentTime = new Date();
        const sessionDuration = Math.floor((currentTime - lastLogin) / 60000);

        user.userEngagement.timeSpent += sessionDuration;
        await user.save();

        return res.json({ message: "User logged out successfully" });
    }catch(error){
        return res.status(500).json({message : error.message});
    }

})

//profile-upload
router.post("/upload", userAuth, upload.single("image"), uploadImage);

//chat-upload
router.post("/chat-upload", chatUpload.single("file"), chatUploadController);

router.put("/profile", userAuth, async (req, res) => {
    const { name, age } = req.body;
  
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.user }, 
        { $set: { name, age } },
        { new: true, fields: { name: 1, age: 1, email : 1 } } // `new: true` returns the updated user
      ).select("-_id");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json({ message: "Profile updated successfully", user });
    } catch (e) {
      console.error("Profile update error:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

router.get("/me", userAuth, async(req, res)=>{
    const user = await User.findOne({
        _id : req.user
    })
    return res.status(200).json({"id" : user._id, "name" : user.name, "email" : user.email, "age" : user.age, "imageURL" : user.imageURL, "fire" : user.fireNumber});
})


router.put("/save-fire-number", userAuth , async(req, res)=>{
const id = req.user;
const fireNumber = req.body.fireNumber;

try {
    const user = await User.findOneAndUpdate(
        { _id: id }, 
        { $set: { fireNumber } },
        { new: true, fields: { fireNumber } } // `new: true` returns the updated user
    ).select("-_id");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Fire Number updated successfully" });
    } catch (e) {
    console.error("update error:", e);
    return res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/rooms", async (req, res)=>{
    const rooms = await ChatRoom.find();
    return res.json(rooms);
})

var allNews = [];

router.get("/allNews", async(req, res)=>{
    try{
        const rssUrl = "https://news.google.com/rss/search?q=indian%20stock%20market";
        const response = await axios.get(rssUrl, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error("XML Parsing Error:", err);
                return res.status(500).json({ error: "Failed to parse XML" });
            }

            if (!result?.rss?.channel?.item) {
                return res.status(500).json({ error: "Invalid RSS structure" });
            }

            allNews = result.rss.channel.item.map(item => ({
                title: item.title,
                link: item.link,
                pubDate: new Date(item.pubDate), 
                source: item.source ? item.source._ : "Unknown",
            })).sort((a, b) => b.pubDate - a.pubDate);

            return res.json({})
        });

    }catch (error) {
        console.error("Fetching Error:", error);
        res.status(500).json({ error: "Failed to fetch news", details: error.message });
    }
})

router.get("/news", async (req, res) => {
    try {
        
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let startIndex = (page - 1) * limit;
        let endIndex = startIndex + limit;

        const paginatedNews = allNews.slice(startIndex, endIndex);
        const totalPages = Math.ceil(allNews.length / limit)

        res.json({
            currentPage: page,
            totalPages,
            totalResults: allNews.length,
            resultsPerPage: limit,
            news: paginatedNews,
        });

    } catch (error) {
        console.error("Fetching Error:", error);
        res.status(500).json({ error: "Failed to fetch news", details: error.message });
    }
});

export default router;