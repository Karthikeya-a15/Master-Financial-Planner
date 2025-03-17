import CashFlows from "../../models/CashFlows.js";
import User from "../../models/User.js";


export default async function getCashFlowsController(req, res) {
    const userId = req.user;
    
    try{
        const user = await User.findById(userId);

        const userCashFlows = await CashFlows.findById(user.netWorth.cashFlows).select('-_id -__v');

        if(userCashFlows)
            return res.json({cashFlows : userCashFlows});
        else 
            return res.json({message : "Error while Fetching Cash Flows "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}