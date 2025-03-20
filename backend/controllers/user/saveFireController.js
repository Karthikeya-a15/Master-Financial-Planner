import User from "../../models/user.js"

export default async function saveFireController(req, res){
    const id = req.user;
    const fireNumber = req.body.fireNumber;
    
    try {
        const user = await User.findOneAndUpdate(
            { _id: id }, 
            { $set: { fireNumber } },
            { new: true, fields: { fireNumber } } // `new: true` returns the updated user
        ).select("-_id");
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        return res.json({ message: "Fire Number updated successfully" });
        } catch (e) {
        console.error("update error:", e);
        return res.status(500).json({ message: "Internal server error" });
        }
    }