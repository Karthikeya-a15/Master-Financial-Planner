import mongoose from "mongoose";
import GoldModel from "../../models/Gold.js";
import User from "../../models/User.js";
import { goldSchema } from "../../schemas/netWorthSchemas.js";

export default async function goldController (req,res) {
    const body = req.body;

    let {success, error} = goldSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Gold inputs are wrong",err : error.format()});
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userId = req.user;

        const {jewellery, SGB, digitalGoldAndETF } = body;

        const user = await User.findOne({_id : userId});

        const goldId = user.netWorth.gold;

        const existingGold = await GoldModel.findOne({_id : goldId});

        const userGold = await GoldModel.findOneAndUpdate(
            {_id : goldId}, 
            {
                ...existingGold.toObject(),
                jewellery,
                SGB,
                digitalGoldAndETF,
                
            }, 
            {new : true});
        
        await session.commitTransaction();
        session.endSession();

        if(userGold){
            return res.status(200).json({message : "Gold updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "Gold not updated"});
        }

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message : "Internal error", err : err.message});
    }

}