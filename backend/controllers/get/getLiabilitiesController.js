import liabilities from "../../models/Liabilities.js";
import User from "../../models/User.js";

export default async function getLiabilitiesController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const userLiability = await liabilities.findById(user.netWorth.liabilities).select('-_id -__v');

        if(userLiability)
            return res.json({liabilities : userLiability});
        else 
            return res.json({message : "Error while Fetching liabilities "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
    
}