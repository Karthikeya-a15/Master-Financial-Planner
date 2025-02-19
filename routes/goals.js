import express from "express";
import { goalSchema} from "../schemas/goalSchema/js";
import userAuth from "../middleware/userAuthMiddleware.js";
import User from "../models/User.js";
import RAM from "..models/returnsAndAssets.js";

const router = express.Router();

router.use(userAuth);

router.put("/assumptions", async (req, res) => {
    const body = req.body;

    let {success, error} = goalSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Inputs are incorrect", err : error.format()});
    }

    try{
        const {expectedReturns, shortTerm, MediumTerm, longTerm} = body;
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
                    "longTerm" : {...RAM.longTerm, ...longTerm}
                }
            }
        )
        

    }
    catch(err){
        return res.status(401).json({error : err.message});
    }
});