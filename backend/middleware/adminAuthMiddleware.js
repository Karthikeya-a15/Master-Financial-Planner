import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

async function adminAuth(req, res, next) {
    const jwtToken = req.headers.authorization;  

    if (!jwtToken || !jwtToken.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Admin not authenticated" });
    }
    
    const token = jwtToken.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(id);
        
        if (!admin) {
            return res.status(401).json({ message: "Invalid admin token" });
        }
        
        req.admin = id;
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default adminAuth;