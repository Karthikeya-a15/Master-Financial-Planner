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
import mongoose from "mongoose";

import { uploadImage } from "../controllers/post/uploadController.js";
import upload from "../middleware/multerConfig.js";

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
            const token = await jwt.sign({id : user._id},process.env.JWT_SECRET);
            return res.status(200).json({message : "Login Successful", token});
        }else{
            return res.status(403).json({message : "Username or Password is wrong"});
        }
    }
    catch(err){
        return res.status(500).json({message : "Internal error"});
    }
});

router.post("/upload", userAuth, upload.single("image"), uploadImage);

router.get("/me", userAuth, async(req, res)=>{
    const user = await User.findOne({
        _id : req.user
    })
    // console.log(user);
    return res.status(200).json({"name" : user.name, "email" : user.email, "age" : user.age, "imageURL" : user.imageURL});
})


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
  

export default router;