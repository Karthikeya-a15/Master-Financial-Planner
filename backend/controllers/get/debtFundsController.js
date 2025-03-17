import Result from "../../models/ToolsResults.js";
import User from "../../models/User.js";
import DebtFunds from "../../tools/Debt/index.js";

export default async function debtFundsController(req, res){
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(403).json({message : "user Not Found"});
        }

        const funds = await DebtFunds();

        return res.status(200).json(funds);
    }catch(err){
        return res.status(500).json({message : "Internal Server Error", error : err.message});
    }
}