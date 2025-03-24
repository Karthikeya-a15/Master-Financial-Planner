import RealEstate from "../../models/RealEstate.js";
import User from "../../models/User.js";

export default async function getRealEstateController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const userRealEstate = await RealEstate.findById(user.netWorth.realEstate).select('-_id -__v');

        if(userRealEstate)
            return res.json({realEstate : userRealEstate});
        else
            return res.json({message : "Error while Fetching Real Estate"});

    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
    
}