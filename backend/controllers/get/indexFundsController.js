import User from "../../models/User.js";
import getFinalIndexFunds from "../../tools/Index/index.js";

export default async function indexFundsController(req, res){
    const userId = req.user;

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(403).json({message : "User Not Found"});
        }

        const funds = await getFinalIndexFunds();

        return res.status(200).json({funds});
        
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error", err : err.message});
    }
}