import User from "../../models/User.js";
import Goals from "../../models/Goals.js";
import goalSchema from "../../schemas/goalSchema.js";
import mongoose from "mongoose";
import RAM from "../../models/returnsAndAssets.js";


export default async function financialGoalsController(req,res) {
    const { goals  } = req.body;

    const { success , error } = goalSchema.safeParse({ goals });

    if(!success){
        return res.status(403).json({message : "Financial Goals input are Wrong" , error : error.format()});
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userId = req.user;

        const user = await User.findOne({_id : userId});
        
        const ramId = user.ram; 

        const returnsAndAssets = await RAM.findById(ramId);

        const sipAmountDistribution = getSipAmountDistribution(goals, returnsAndAssets);

        // const sipAssetAllocation = 

        const goalsId = user.goals;

        const userGoals = await Goals.findOne({_id : goalsId});


        const goalsUpdated = await Goals.findOneAndUpdate(
            {_id : goalsId},
            {
                $set : {
                    "goals" : goals,
                    "sipAssestAllocation" : { ...userGoals.sipAssetAllocation, ...sipAssetAllocation}
                }
            },
            {new  : true}
        );

        await session.commitTransaction();
        session.endSession();

        if(goalsUpdated){
            return res.json({message : "User Goals are Updated"});
        }else{
            return res.status(403).json({message : "User Goals are NOT Updated"});
        }

    }catch(e){
        return res.status(500).json({message : "Internal error", err : err.message});
    }


}

function getSipAmountDistribution(goals, returnsAndAssets){
    const { shortTerm, mediumTerm, longTerm } = returnsAndAssets;

    const sipAmounts = [];

    for(let i=0;i<goals.length;i++){
        const currentGoal = goals[i];

        const sipRequired = currentGoal.sipRequired;
        const time = currentGoal.time;

        if(time < 3){
            sipAmounts.push(getAmountDistribution(sipRequired, shortTerm));
        }
        else if(time < 7){
            sipAmounts.push(getAmountDistribution(sipRequired, mediumTerm));
        }
        else{
            sipAmounts.push(getAmountDistribution(sipRequired, longTerm));
        }
    }
}

function getAmountDistribution(sip, plan){
    let amount = {
        domesticEquity : 0,
        usEquity : 0,
        debt : 0,
        gold : 0,
        crypto : 0,
        realEstate : 0
    }

    const keys = Object.keys(plan);
    const values = Object.values(plan);

    for(let i=0;i<values.length;i++){
        if(values[i]!=0){
            const key = keys[i];

            amount[key] += (values[i]/100) * sip;
        }
    }

    return amount;
}
