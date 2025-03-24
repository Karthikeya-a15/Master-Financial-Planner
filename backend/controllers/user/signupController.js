import CashFlows from "../../models/CashFlows.js";
import CryptoCurrency from "../../models/CryptoCurrency.js";
import Debt from "../../models/Debt.js";
import DomesticEquity from "../../models/DomesticEquity.js";
import ForeignEquity from "../../models/ForeignEquity.js";
import liabilities from "../../models/Liabilities.js";
import RealEstate from "../../models/RealEstate.js";
import miscellaneous from "../../models/miscellaneous.js";
import GoldModel from "../../models/Gold.js";
import Goals from "../../models/Goals.js";
import RAM from "../../models/returnsAndAssets.js";
import mongoose from "mongoose";
import User from "../../models/User.js";
import { signUpSchema } from "../../schemas/userSchemas.js";

export default async function signupController (req, res){
    const body = req.body;

    let {success, error} = signUpSchema.safeParse(body);
    // console.log(success);
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
    
    if(!success){
        return res.status(403).json({message: "User inputs are incorrect",err : error.format()});
    }

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
};