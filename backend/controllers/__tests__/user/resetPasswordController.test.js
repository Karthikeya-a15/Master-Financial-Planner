import resetPasswordController from "../../user/resetPasswordController.js";
import User from "../../../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

jest.mock("../../../models/User.js");
jest.mock("bcrypt");
jest.mock("crypto");

describe("resetPasswordController", () => {
  it("should reset the password successfully", async () => {
    const req = {
      body: {
        token: "validToken",
        password: "newPassword",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const hashedToken = "hashedToken";
    crypto.createHash.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(hashedToken),
    });

    const user = {
      save: jest.fn(),
      password: "",
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    };
    User.findOne.mockResolvedValueOnce(user);
    bcrypt.hash.mockResolvedValueOnce("hashedPassword");

    await resetPasswordController(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: expect.any(Number) },
    });
    expect(user.password).toBe("hashedPassword");
    expect(user.resetPasswordToken).toBeUndefined();
    expect(user.resetPasswordExpires).toBeUndefined();
    expect(user.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Password reset successful" });
  });

  it("should return error for invalid or expired token", async () => {
    const req = { body: { token: "invalidToken", password: "newPassword" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await resetPasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
  });

  it("should handle server errors", async () => {
    const req = { body: { token: "validToken", password: "newPassword" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findOne.mockRejectedValue(new Error("Database error"));

    await resetPasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
  });
});
