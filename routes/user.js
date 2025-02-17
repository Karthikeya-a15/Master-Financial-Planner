import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import zod from "zod";


const signUpSchema = zod.object({
    name : zod.string(),
    email : zod.string().email(),
    password : zod.string()
    .min(6, { message: "Password must be at least 6 characters long" }) // Minimum length check
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    ),
    age : zod.number(),
});

const loginSchema = zod.object({
    email : zod.string().email(),
    password : zod.string()
    .min(6, { message: "Password must be at least 6 characters long" }) // Minimum length check
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    )
});


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
})

export default router;