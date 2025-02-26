import User from "./../../models/User.js";

import main from "../../tools/EquitySaver/index.js";

export default async function equitySaverController(req, res){
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(403).json({message : "User not found"});
        }

        const body = req.body;

        const {expenseRatio, rollingReturns, probabilityRatio, sortinoRatio} = body;
        const weightage = {expenseRatio, rollingReturns, probabilityRatio, sortinoRatio} ;

        const funds = await main(weightage);
        return res.status(200).json(funds);
    }catch(err){
        return res.status(500).json({message : "Internal Server Error", error : err.message});
    }
}
