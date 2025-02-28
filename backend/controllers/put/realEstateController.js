import RealEstate from '../../models/RealEstate.js';
import { realEstateSchema } from '../../schemas/netWorthSchemas.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

export default async  function realEstatesController (req,res){
    const body = req.body;

    let {success, error} = realEstateSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Real-Estate inputs are wrong",err : error.format()});
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userId = req.user;

        const {home, otherRealEstate, REITs} = body;

        const user = await User.findOne({_id : userId});

        const realEstateId = user.netWorth.realEstate;

        const existingRealEstate = await RealEstate.findOne({_id : realEstateId});

        const userRealEstate = await RealEstate.findOneAndUpdate(
            { _id : realEstateId }, 
            {
                ...existingRealEstate.toObject(),
                home,
                otherRealEstate,
                REITs
            }, 
            { new: true }
        );

        await session.commitTransaction();
        session.endSession();


        if(userRealEstate){
            return res.status(200).json({message : "Real-Estate updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "Real-Estate not updated"});
        }

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}