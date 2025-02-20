import Goals from "../../models/Goals.js";
import User from "../../models/User.js";
import RAM from "../../models/returnsAndAssets.js";
import CashFlows from "../../models/CashFlows.js";
// import { illiquid, liquid } from "../../common/"

export default async function getFinancialGoalsController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findOne({_id : userId});

        const goals = await Goals.findOne({_id : user.goals})

        const ram = await RAM.findOne({_id : user.ram});

        /*
            let realEstate = liquid.otherRealEstate + illiquid.reits;
            let domesticEquity = liquid.stocks + liquid.mutualFunds + liquid.smallCase + illiquid.ulips
            let usEquity = liquid.usEquity
            let debt = illiquid.govermentInvestments + liquid.fixedDeposit + liquid.debtFunds + liquid.liquidFunds
            let gold = liquid.liquidGold + illiquid.sgb
            let crypto = liquid.crypto
        */


    }catch(e){
        return res.status(500).json({message : "Internal error", err : err.message});
    }
}