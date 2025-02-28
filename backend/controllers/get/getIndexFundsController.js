import User from "../../models/User.js";
// import Tools from "./../../models/Tools.js";

export default async function getToolsController(req, res){
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        // const tools = await Tools.findById(user.tools);

        // return res.status(200).json({"nifty50" : tools.nifty50, "niftyNext50" : tools.niftyNext50});
        return res.status(200).json({message : "This is in get tools controller"});
    }
    catch(err){
        return res.status(500).json({message: "Internal Server Error", err : err.message});
    }
}