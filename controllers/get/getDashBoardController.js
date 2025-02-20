import liabilities from "../../models/Liabilities.js";
import getNetWorth  from "../../common/getNetWorth.js";
import User from "../../models/User.js";
import Goals from "../../models/Goals.js";
import RAM from "../../models/returnsAndAssets.js";

export default async function getDashBoardController(req, res){
    try{
        const userid = req.user;
        const user = await User.findById(userid);
        const {illiquid , liquid, message} = await getNetWorth(userid);
        if(message){
            return res.status(500).json({message}); 
        }
        const liability = await liabilities.findById(user.netWorth.liabilities);
        const Liabilities = {
            homeLoan : liability.homeLoan,
            educationLoan : liability.educationLoan,
            carLoan : liability.carLoan,
            personalLoan : liability.personalLoan,
            creditCard : liability.creditCard,
            other : liability.other
        }

        const ans = await requiredInvestableAssetAllocation(user);

        return res.status(200).json({illiquid, liquid, Liabilities, requiredInvestableAssetAllocation : ans});
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }

}


async function requiredInvestableAssetAllocation(user){
    try{
        const userGoals = await Goals.findById(user.goals);
        const goals = userGoals.goals;

        const { shortTerm, mediumTerm, longTerm } = await RAM.findById(user.ram);

        
        var riaa = {
            "debt" : 0,
            "domesticEquity" : 0,
            "usEquity" : 0,
            "gold" : 0,
            "crypto" : 0,
            "realEstate" : 0,
        }

        

        for(let i=0; i<goals.length; i++){
            const currentGoal = goals[i];

            const amountAvailable = currentGoal.amountAvailableToday;
            const timePeriod = currentGoal.time;

            if(timePeriod < 3){          
                riaa = getValue(shortTerm, riaa, amountAvailable);
            }
            else if(timePeriod < 7){
                riaa = getValue(mediumTerm, riaa, amountAvailable);
            }
            else{
                riaa = getValue(longTerm, riaa, amountAvailable);
            }
        }

        return riaa;
    }catch(e){
        console.log(e.message);
    }
}

function getValue(plan, riaa, amountAvailable){
    const keys = Object.keys(plan);
    const values = Object.values(plan);
    
    
    for(let i=0;i<values.length;i++){
        if (values[i] !== 0) {
            const key = keys[i];
            let compute = 0;
            compute += (values[i] / 100) * amountAvailable ;
            riaa[key] += compute;
        }
    }
    
    return riaa;

}
