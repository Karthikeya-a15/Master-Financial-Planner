import User from "../../models/User.js";
import main from "../../tools/EquitySaver/index.js";

export default async function equitySaverController(req, res){
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(403).json({message : "User not found"});
        }

        const funds = await main();

        return res.status(200).json(funds);
    }catch(err){
        return res.status(500).json({message : "Internal Server Error", error : err.message});
    }
}

