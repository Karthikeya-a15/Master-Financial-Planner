import Debt from "../models/Debt.js";
import User from "../models/User.js";
import { debtSchema } from "../schemas/netWorthSchemas.js";

export default async function debtController(req,res){
    const body = req.body;

    const { success, error } = debtSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Debt inputs are wrong",err : error.format()});
    }

    try{
        const userId = req.user;
        
        const { liquidFund, fixedDeposit, debtFunds, governmentInvestments, sipDebt } = body;

        const user = await User.findOne({_id : userId});

        const debtId = user.netWorth.debt;

        const userDebt = await Debt.findOneAndUpdate(
            {_id : debtId}, 
            {
                $set : {
                    "liquidFund" : liquidFund,
                    "fixedDeposit" : fixedDeposit,
                    "debtFunds" : debtFunds,
                    "governmentInvestments" : governmentInvestments
                }
            }, 
            {new : true});
        
            if(userDebt){
                return res.status(200).json({message : "Debt updated successfully to Networth"});
            }else{
                return res.status(403).json({message : "Debt not added"});
            }

    }catch(err){
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}