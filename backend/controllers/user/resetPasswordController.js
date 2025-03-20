import User from "../../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default async function resetPasswordController (req,res) {
    try {
        const { token } = req.body;
        const newPassword = req.body.password;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
        // Find user by reset token
        const user = await User.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpires: { $gt: Date.now() }, // Check if token is valid
        });
    
        if (!user) {
          return res.status(400).json({ message: "Invalid or expired token" });
        }
        console.log(newPassword)
    
        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
    
        await user.save();
        return res.status(200).json({ message: "Password reset successful" });
      } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Something went wrong" });
      }
}