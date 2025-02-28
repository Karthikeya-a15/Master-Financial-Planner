import Result from "../../models/ToolsResults.js";
import User from "../../models/User.js";
import DebtFunds from "../../tools/Debt/index.js";

export default async function debtFundsController(req, res){
    const userId = req.user;

    try{
        const body =req.body;
        const user = await User.findById(userId);

        const toolResultId = user.toolResult;

        if(!user){
            return res.status(403).json({message : "user Not Found"});
        }

        const {cagrRanksRatio, volatalityRankRatio, tenureRankRatio, sortinoRatio, expectedInterestRateChange} = body;
        const weightage = {cagrRanksRatio, volatalityRankRatio, tenureRankRatio, sortinoRatio, expectedInterestRateChange};

        const funds = await DebtFunds(weightage);

        await Result.updateOne(
            {_id : toolResultId},
            {
                $set : {
                    BankingAndPSU : funds.BankingAndPSU,
                    CorporateBonds : funds.CorporateBonds
                }
            }
        )

        return res.status(200).json(funds);
    }catch(err){
        return res.status(500).json({message : "Internal Server Error", error : err.message});
    }
}