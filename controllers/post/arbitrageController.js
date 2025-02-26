import Result from "../../models/ToolsResults.js";
import User from "../../models/User.js";
import main from "../../tools/Arbitrage/index.js";


export default async function arbitrageController(req, res){
    const userId = req.user;
    
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(403).json({message : "User not found"});
        }        

        const toolResultId = user.toolResult;

        const body = req.body;

        const {expenseRatio, rollingReturns, aumRatio, exitLoadRatio} = body;

        const weightage = {expenseRatio, rollingReturns, aumRatio, exitLoadRatio};

        const funds = await main(weightage);

        await Result.updateOne(
            {_id : toolResultId},
            {
                $set : {
                    arbitrageFunds : funds
                }
            }
        )
        return res.status(200).json(funds);
    }catch(err){
        return res.json(500).json({message : "Internal Server Error", err : err.message});
    }
}
