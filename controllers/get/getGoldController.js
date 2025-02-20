import GoldModel from "../../models/Gold.js";
import User from "../../models/User.js";


export default async function getGoldController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const userGold = await GoldModel.findById(user.netWorth.gold).select('-_id -__v');

        if(userGold)
            return res.json({gold : userGold});
        else
            return res.json({message : "Error while Fetching Gold "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }    
}