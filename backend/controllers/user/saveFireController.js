import User from "../../models/User.js"

export default async function saveFireController(req, res){
    const id = req.user;
    const fireNumber = req.body.fireNumber;
    
    try {
        const user = await User.findOneAndUpdate(
            { _id: id }, 
            { $set: { fireNumber } },
            { new: true, fields: { fireNumber } } 
        ).select("-_id");
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        return res.json({ message: "Fire Number updated successfully" });
        } catch (e) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }