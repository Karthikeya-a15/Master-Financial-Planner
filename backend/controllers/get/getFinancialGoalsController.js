import Goals from "../../models/Goals.js";
import User from "../../models/User.js";
import RAM from "../../models/returnsAndAssets.js";
import CashFlows from "../../models/CashFlows.js";
import getCurrentInvestibleAssets from "../../common/currentInvestibleAssets.js";

export default async function getFinancialGoalsController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findOne({_id : userId});

        const userGoals  = await Goals.findOne({_id : user.goals})

        const ram = await RAM.findOne({_id : user.ram});

        const userCashFlows = await CashFlows.findOne({_id : user.netWorth.cashFlows});

        const sum = (obj) => Object.values(obj).reduce((acc, val) => acc + val, 0);

        const cashAvailable = sum(userCashFlows.inflows) - sum(userCashFlows.outflows);

        const { currentInvestibleAssets } = await getCurrentInvestibleAssets(userId); 

        return res.json(
            {
                goals : userGoals.goals,
                returnsAndAssets : ram,
                cashAvailable,
                currentInvestibleAssets,
                sipAmountDistribution : userGoals.sipAmountDistribution,
                sipAssetAllocation : userGoals.sipAssetAllocation
            }
        );


    }catch(err){
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}