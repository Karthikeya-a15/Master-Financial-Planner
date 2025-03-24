import RAM from "../../models/returnsAndAssets.js";
import User from "../../models/User.js";

export default async function getAssumptionController (req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const ram = await RAM.findById(user.ram).select('-_id -__v');

        if(ram)
            return res.status(200).json({returnsAndAssets : ram});
        else
            return res.status(403).json({message : "Error while Fetching Returns & Assets Mix Assumption "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}