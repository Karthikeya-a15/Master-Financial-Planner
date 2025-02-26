import User from "./../../models/User.js";
import main from "../../tools/EquitySaver/index.js";
import Result from "../../models/ToolsResults.js";

export default async function equitySaverController(req, res){
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const toolResultId = user.toolResult;

        if(!user){
            return res.status(403).json({message : "User not found"});
        }

        const body = req.body;

        const {expenseRatio, rollingReturns, probabilityRatio, sortinoRatio} = body;
        const weightage = {expenseRatio, rollingReturns, probabilityRatio, sortinoRatio} ;

        const funds = await main(weightage);

        await Result.updateOne(
            {_id : toolResultId},
            {
                $set : {
                    equitySaverFunds : funds
                }
            }
        )

        return res.status(200).json(funds);
    }catch(err){
        return res.status(500).json({message : "Internal Server Error", error : err.message});
    }
}
