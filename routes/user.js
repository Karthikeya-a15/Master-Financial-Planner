import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { signUpSchema, loginSchema, cashFlowsSchema } from "../schemas/userSchemas.js";
import userAuth from "../middleware/userAuthMiddleware.js";
import NetWorth from "../models/NetWorth.js";

const router = express.Router();

router.post("/signup",async (req, res) => {
    const body = req.body;

    let {success, error} = signUpSchema.safeParse(body);
    try{
    
    if(!success){
        return res.status(403).json({message: "User inputs are incorrect",err : error.format()});
    }

        const {name, email, password, age} = body;

        const user = new User(body);

        user.password = await user.hashPassword();

        await user.save();
        return res.status(500).json({message : "User registered Successfully"});
    }
    catch(err){
        return res.status(401).json({error : err.message});
    }
});

router.post("/login", async (req, res) => {
    const body = req.body;
    const {email,password} = body;
    
    let {success, error} = loginSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "User inputs are wrong",err : error.format()});
    }

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(403).json({message : "User not found"});
        }

        const isUserExist = await user.validatePassword(password);

        if(isUserExist){
            const token = await jwt.sign({id : user._id},process.env.JWT_SECRET);
            return res.status(200).json({message : "Login Successful", token});
        }else{
            return res.status(403).json({message : "Username or Password is wrong"});
        }
    }
    catch(err){
        return res.status(500).json({message : "Internal error"});
    }
});

router.post('/cashflows', userAuth, async (req,res)=>{
    const body = req.body;

    let {success, error} = cashFlowsSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Cash-Flow inputs are wrong",err : error.format()});
    }

    try{
        const user = req.user;
        const {inflows, outflows} = body;

        const userCashFlows = await NetWorth.create({user, inflows, outflows});

        if(userCashFlows){
            return res.status(200).json({message : "Cash-Flows added successfully"});
        }else{
            return res.status(403).json({message : "Cash-Flows not added"});
        }

    }catch(err){
        return res.status(500).json({message : "Internal error", err : err.message});
    }

})

export default router;