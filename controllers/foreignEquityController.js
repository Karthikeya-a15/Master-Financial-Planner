import ForeignEquity from "../models/ForeignEquity.js";
import User from "../models/User.js";
import { foreignEquitySchema } from "../schemas/netWorthSchemas.js";

export default async function foreignEquityController(req,res){
    const body = req.body;

    let {success, error} = foreignEquitySchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "ForeignEquity inputs are wrong",err : error.format()});
    }

    try{
        const userId = req.user;

        const { sAndp500,  otherETF, mutualFunds } = req.body;

        const user = await User.findOne({_id : userId});

        const ForeignEquityId = user.netWorth.foreignEquity;

        const existingForeignEquity = await ForeignEquity.findOne({_id : ForeignEquityId});

        const userForeignEquity = await ForeignEquity.findOneAndUpdate(
            {_id : ForeignEquityId}, 
            {
                ...existingForeignEquity.toObject(),
                sAndp500,
                otherETF,
                mutualFunds
            }, 
            {new : true});

        if(userForeignEquity){
            return res.status(200).json({message : "ForeignEquity updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "ForeignEquity not updated"});
        }

    }catch(err){
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}