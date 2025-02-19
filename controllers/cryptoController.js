import mongoose from "mongoose";
import CryptoCurrency from "../models/CryptoCurrency.js";
import User from "../models/User.js";
import { cryptoSchema } from "../schemas/netWorthSchemas.js";

export default async function cryptoController(req,res){
    const body = req.body;

    let {success, error} = cryptoSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Crypto inputs are wrong",err : error.format()});
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userId = req.user;

        const { crypto } = req.body;
        
        const user = await User.findOne({_id : userId});

        const cryptoId = user.netWorth.cryptocurrency;

        const existingCrypto = await CryptoCurrency.findOne({_id : cryptoId});

        const userCrypto = await CryptoCurrency.findOneAndUpdate(
            {_id : cryptoId},
            {
                crypto
            },
            {new : true}
        )

        await session.commitTransaction();
        session.endSession();

        if(userCrypto){
            return res.status(200).json({message : "Crypto updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "Crypto not updated"});
        }

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}