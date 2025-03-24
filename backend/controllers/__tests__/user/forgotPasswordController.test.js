import forgotPasswordController from "../../user/forgotpasswordController.js";
import User from "../../../models/User.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../../utils/mailer";

jest.mock("../../../models/User.js");
jest.mock("crypto");
jest.mock("../../../utils/mailer");
jest.mock("nodemailer");

describe("forgotPasswordController", () => {
  it("should send password reset email successfully", async () => {
    const req = { body: { email: "test@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const user = { save: jest.fn() };
    User.findOne.mockResolvedValueOnce(user);
    crypto.randomBytes.mockReturnValueOnce(Buffer.from("resetToken"));
    crypto.createHash.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValueOnce("hashedToken"),
    });
    sendPasswordResetEmail.mockResolvedValueOnce({ success: true });

    await forgotPasswordController(req, res);

    expect(user.resetPasswordToken).toBe("hashedToken");
    expect(user.resetPasswordExpires).toBeGreaterThan(Date.now());
    expect(user.save).toHaveBeenCalled();
    expect(sendPasswordResetEmail).toHaveBeenCalledWith("test@example.com", expect.any(String));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Password reset instructions sent to your email" });
  });

  it("should return error if user is not found", async () => {
    const req = { body: { email: "test@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValueOnce(null);

    await forgotPasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle email sending failure", async () => {
    const req = { body: { email: "test@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const user = { save: jest.fn() };
    User.findOne.mockResolvedValueOnce(user);
    crypto.randomBytes.mockReturnValueOnce(Buffer.from("resetToken"));
    crypto.createHash.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValueOnce("hashedToken"),
    });
    sendPasswordResetEmail.mockResolvedValueOnce({ success: false });

    await forgotPasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to send reset email" });
  });

  it("should handle server errors", async () => {
    const req = { body: { email: "test@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockRejectedValueOnce(new Error("Database error"));

    await forgotPasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
  });
});
