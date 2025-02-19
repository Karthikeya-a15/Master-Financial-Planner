import mongoose from "mongoose";
import miscellaneous from "../models/miscellaneous.js";
import User from "../models/User.js";
import { miscellaneousSchema } from "../schemas/netWorthSchemas.js";

export default async function miscellaneousController(req,res){
    const body = req.body;

    const {success, error} = miscellaneousSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Miscellaneous inputs are wrong",err : error.format()});
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userId = req.user;

        const {otherInsuranceProducts, smallCase} = body;

        const user = await User.findOne({_id : userId});
        
        const miscId = user.netWorth.miscellaneous;

        const existingMisc = await miscellaneous.findOne({_id : miscId});

        const userMisc = await miscellaneous.findOneAndUpdate(
            { _id : miscId }, 
            { 
                ...existingMisc.toObject(),
                otherInsuranceProducts,
                smallCase
             }, 
            { new: true }
        );

        await session.commitTransaction();
        session.endSession();


        if(userMisc){
            return res.status(200).json({message : "Miscellaneous updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "Miscellaneous not updated"});
        }

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}