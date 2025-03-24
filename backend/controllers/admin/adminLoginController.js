import { loginSchema } from "../../schemas/adminSchema.js";
import Admin from "../../models/Admin.js";
import jwt from "jsonwebtoken"
export default async function adminLoginController(req, res) {
    const body = req.body;
    const {email, password} = body;
    
    let {success, error} = loginSchema.safeParse(body);

    if(!success){
        return res.status(403).json({message : "Invalid input", err : error.format()});
    }

    try {
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(403).json({message : "Admin not found"});
        }

        const isValid = await admin.validatePassword(password);

        if(isValid){
            admin.lastLogin = new Date();
            await admin.save();
            
            const token = jwt.sign({id : admin._id}, process.env.JWT_SECRET);
            return res.status(200).json({
                message : "Login Successful", 
                token,
                
            });
        } else {
            return res.status(403).json({message : "Invalid credentials"});
        }
    } catch(err){
        return res.status(500).json({message : "Internal error", error: err.message});
    }
}