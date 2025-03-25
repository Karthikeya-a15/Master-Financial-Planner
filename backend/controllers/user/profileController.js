import User from "../../models/User.js";

export default async function profileController(req, res){
    const { name, age } = req.body;
  
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.user }, 
        { $set: { name, age } },
        { new: true, fields: { name: 1, age: 1, email : 1 } } // `new: true` returns the updated user
      ).select("-_id");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json({ message: "Profile updated successfully", user });
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }