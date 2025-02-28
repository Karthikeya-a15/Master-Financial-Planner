import Result from "../../models/ToolsResults.js";
import User from "../../models/User.js";
// import Tools from "../../models/Tools.js";
import getRankOfFunds from "../../tools/Index/indexFunds.js";

export default async function indexFundsController(req, res){
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const toolResultId = user.toolResult;

        const body = req.body;
        const {expenseRatio, trackingError } = body;


        const {finalRankings, nifty50, niftyNext50} = await getRankOfFunds(expenseRatio, trackingError);

        await Result.updateOne(
            {_id : toolResultId},
            {
                $set : {
                    indexFunds : { nifty50, niftyNext50}
                }
            }
        )

        return res.status(200).json({finalRankings, conclusion :  {nifty50, niftyNext50}});
        
    }
    catch(err){
        return res.status(500).json({message : "Internal Server Error", err : err.message});
    }
}