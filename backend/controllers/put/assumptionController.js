import mongoose from "mongoose";
import User from "../../models/User.js";
import RAM from "../../models/returnsAndAssets.js";
import ramSchema from "../../schemas/ramSchema.js";

export default async function (req, res){
    const body = req.body;

    let {success, error} = ramSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Inputs are incorrect", err : error.format()});
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {expectedReturns, shortTerm, mediumTerm, longTerm, effectiveReturns} = body;
        const userId = req.user;

        const user = await User.findOne({_id : userId});

        const ramId = user.ram;

        const ram = await RAM.findOne({_id : ramId});

        const userRetruns  = await RAM.findOneAndUpdate({_id : ramId},
            {
                $set : {
                    "expectedReturns" : {...RAM.expectedReturns, ...expectedReturns},
                    "shortTerm" : {...RAM.shortTerm, ...shortTerm},
                    "mediumTerm" : {...RAM.mediumTerm, ...mediumTerm},
                    "longTerm" : {...RAM.longTerm, ...longTerm},
                    "effectiveReturns" : effectiveReturns
                }
            }
        )

        await session.commitTransaction();
        session.endSession();
        
        if(userRetruns){
            return res.json({message : "Returns & Assets Mix Assumptions are set"});
        }else{
            return res.status(403).json({message : "Returns & Assets Mix Assumptions are NOT set"})
        }
    }
    catch(err){
        await session.abortTransaction();
        session.endSession();

        return res.status(401).json({error : err.message});
    }
}