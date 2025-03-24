import User from "../../models/User.js"

export default async function logoutController(req, res){
    const userId = req.user;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(500).json({message : "User not found"});
        }
        const lastLogin = new Date(user.userEngagement.lastLogin);
        const currentTime = new Date();
        const sessionDuration = Math.floor((currentTime - lastLogin) / 60000);

        user.userEngagement.timeSpent += sessionDuration;
        await user.save();

        return res.json({ message: "User logged out successfully" });
    }catch(error){
        return res.status(500).json({message : error.message});
    }

}