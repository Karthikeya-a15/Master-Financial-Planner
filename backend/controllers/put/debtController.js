import mongoose from "mongoose";
import Debt from "../../models/Debt.js";
import User from "../../models/User.js";
import { debtSchema } from "../../schemas/netWorthSchemas.js";

export default async function debtController(req,res){
    const {liquidFund, fixedDeposit, debtFunds, governmentInvestments, sipDebt} = req.body;

    const { success, error } = debtSchema.safeParse({liquidFund, fixedDeposit, debtFunds, governmentInvestments, sipDebt});

    if(!success){
        return res.status(403).json({message : "Debt inputs are wrong",err : error.format()});
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    

    try{
        const userId = req.user;
        
        const { selection }= req.body; 

        if(!selection){
            return res.status(403).json({message : "Selection not provided"});
        }

        if(!selection)
            return res.status(403).json({message : "Selection not provided"});

        const user = await User.findOne({_id : userId});

        const debtId = user.netWorth.debt;

        const updateField = {
            liquidFund : { liquidFund },
            fixedDeposit : { fixedDeposit },
            debtFunds : { debtFunds },
            governmentInvestments : { governmentInvestments },
            sipDebt : { sipDebt }
        }[selection] || { sipDebt }


        const userDebt = await Debt.findOneAndUpdate(
            {_id : debtId}, 
            {
                $set : updateField
            }, 
            {new : true});
        
        await session.commitTransaction();
        session.endSession();
        
        if(userDebt){
            return res.status(200).json({message : "Debt updated successfully to Networth"});
        }else{
            return res.status(403).json({message : "Debt not added"});
        }

    }catch(err){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}