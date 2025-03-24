import User from "../../models/User.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../utils/mailer.js";

export default async function forgotPasswordController (req, res){
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Generate a reset token (valid for 1 hour)
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
        await user.save();
    
        // Generate reset link
        const resetLink = `${process.env.FRONTEND_URL}/forgot-password/${resetToken}`;
    
        // Send email
        const emailResponse = await sendPasswordResetEmail(email, resetLink);
    
        if (!emailResponse.success) {
          return res.status(500).json({ message: "Failed to send reset email" });
        }
    
        res.status(200).json({ message: "Password reset instructions sent to your email" });
      } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
      }
}