import ForeignEquity from "../../models/ForeignEquity.js";
import User from "../../models/User.js";

export default async function getForeignEquityController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const userForeignEquity = await ForeignEquity.findById(user.netWorth.foreignEquity).select('-_id -__v');

        if(userForeignEquity)
            return res.json({foreignEquity : userForeignEquity});
        else 
            return res.json({message : "Error while Fetching Foreign Equity "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}