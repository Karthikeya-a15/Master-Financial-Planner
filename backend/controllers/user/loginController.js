import User from "../../models/User.js"
import jwt from "jsonwebtoken";
import { loginSchema } from "../../schemas/userSchemas.js";

export default async function loginController(req, res){
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
            user.userEngagement.loginFrequency += 1;
            user.userEngagement.lastLogin = new Date();
            const token = await jwt.sign({id : user._id},process.env.JWT_SECRET,{
                expiresIn: "1d",
            });
            await user.save();
            return res.status(200).json({message : "Login Successful", token});
        }else{
            return res.status(403).json({message : "Username or Password is wrong"});
        }
    }
    catch(err){
        return res.status(500).json({message : "Internal error"});
    }
}