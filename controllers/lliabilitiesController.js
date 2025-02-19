import mongoose from "mongoose";
import liabilities from "../models/Liabilities.js";
import User from "../models/User.js";
import { liabilitiesSchema } from "../schemas/netWorthSchemas.js";


export default async function liabilitiesController(req,res){
    const body = req.body;

    const { success, error } = liabilitiesSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Liabilities inputs are wrong",err : error.format()});
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userId = req.user;

        const {homeLoan, educationLoan, carLoan, personalLoan, creditCard, other} = body;

        const user = await User.findOne({_id : userId});

        const liabilitiesId = user.netWorth.liabilities;

        const existingLiability = await liabilities.findOne({_id : liabilitiesId});

        const userLiabilities = await liabilities.findOneAndUpdate(
            { _id : liabilitiesId }, 
            { 
                ...existingLiability.toObject(),
                homeLoan,
                educationLoan,
                carLoan,
                personalLoan,
                creditCard,
                other
            }, 
            { new: true }
        );

        await session.commitTransaction();
        session.endSession();


        if(userLiabilities){
            return res.status(200).json({message : "Liabilities updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "Liabilities not updated"});
        }

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}