import GoldModel from "../models/Gold.js";
import User from "../models/User.js";
import { goldSchema } from "../schemas/netWorthSchemas.js";

export default async function goldController (req,res) {
    const body = req.body;

    let {success, error} = goldSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Gold inputs are wrong",err : error.format()});
    }
    

    try{
        const userId = req.user;

        const {jewellery, SGB, digitalGold, goldETF} = body;

        const user = await User.findOne({_id : userId});

        const goldId = user.netWorth.gold;

        const existingGold = await GoldModel.findOne({_id : goldId});

        const userGold = await GoldModel.findOneAndUpdate(
            {_id : goldId}, 
            {
                ...existingGold.toObject(),
                jewellery,
                SGB,
                digitalGold,
                goldETF
            }, 
            {new : true});

        if(userGold){
            return res.status(200).json({message : "Gold updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "Gold not updated"});
        }

    }catch(err){
        return res.status(500).json({message : "Internal error", err : err.message});
    }

}