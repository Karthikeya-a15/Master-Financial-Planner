import Debt from "../../models/Debt.js";
import User from "../../models/User.js";

export default async function getDebtController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const userDebt = await Debt.findById(user.netWorth.debt).select('-_id -__v');

        if(userDebt)
            return res.json({debt : userDebt});
        else 
            return res.json({message : "Error while Fetching Debt "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
    
}