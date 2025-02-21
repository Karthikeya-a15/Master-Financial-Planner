import User from "../../models/User.js";
import Goals from "../../models/Goals.js";
import goalSchema from "../../schemas/goalSchema.js";
import mongoose from "mongoose";


export default async function financialGoalsController(req,res) {
    const { goals, sipAssetAllocation } = req.body;

    const { success , error } = goalSchema.safeParse({ goals, sipAssetAllocation });

    if(!success){
        return res.status(403).json({message : "Financial Goals input are Wrong" , error : error.format()});
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const userId = req.user;

        const user = await User.findOne({_id : userId});

        const goalsId = user.goals;

        const userGoals = await Goals.findOne({_id : goalsId});

        const goalsUpdated = await Goals.findOneAndUpdate(
            {_id : goalsId},
            {
                $set : {
                    "goals" : { ...userGoals.goals, ...goals},
                    "sipAssestAllocation" : { ...userGoals.sipAssestAllocation, ...sipAssetAllocation}
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


function sumOfSip(sipAssetAllocation){
    let sumValues = {
        domesticEquity : 0,
        usEquity : 0,
        debt : 0,
        gold : 0,
        crypto : 0,
        realEstate : 0,
    }

    for(let goal in sipAssetAllocation){
        for(let asset in sipAssetAllocation[goal]){
            sumValues[asset] += sipAssetAllocation[goal][asset];
        }
    }
    return sumValues;
}
