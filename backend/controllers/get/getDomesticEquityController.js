import DomesticEquity from "../../models/DomesticEquity.js";
import User from "../../models/User.js";


export default async function getDomesticEquityController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const userDomesticEquity = await DomesticEquity.findById(user.netWorth.domesticEquity).select('-_id -__v');

        if(userDomesticEquity)
            return res.json({domesticEquity : userDomesticEquity});
        else 
            return res.json({message : "Error while Fetching Domestic Equity "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}