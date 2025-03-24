import miscellaneous from "../../models/miscellaneous.js";
import User from "../../models/User.js";


export default async function getMiscellaneousController(req, res) {
    const userId = req.user;

    try{

        const user = await User.findById(userId);

        const userMisc = await miscellaneous.findById(user.netWorth.miscellaneous).select('-_id -__v');

        if(userMisc)
            return res.json({miscellaneous : userMisc});
        else
        return res.json({message : "Error while Fetching miscellaneous "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}