import resetPasswordController from "../../user/resetPasswordController.js";
import User from "../../../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { resetPasswordSchema } from "../../../schemas/userSchemas.js";

jest.mock("../../../models/User.js");
jest.mock("bcrypt");
jest.mock("crypto");
jest.mock("../../../schemas/userSchemas.js", () => ({
  resetPasswordSchema: {
    safeParse: jest.fn(),
  },
}));

describe("resetPasswordController", () => {
  let req, res, user, hashedToken;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        token: "validToken",
        password: "newPassword",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    hashedToken = "hashedToken";

    crypto.createHash.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(hashedToken),
    });

    user = {
      save: jest.fn(),
      password: "",
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    };

    bcrypt.hash.mockResolvedValue("hashedPassword");
  });

  it("should reset the password successfully", async () => {
    resetPasswordSchema.safeParse.mockReturnValue({ success: true });

    User.findOne.mockResolvedValueOnce(user);

    await resetPasswordController(req, res);

    expect(resetPasswordSchema.safeParse).toHaveBeenCalledWith({ password: "newPassword" });
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
    resetPasswordSchema.safeParse.mockReturnValue({ success: true });

    User.findOne.mockResolvedValue(null);

    await resetPasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
  });

  it("should return error for invalid password format", async () => {
    resetPasswordSchema.safeParse.mockReturnValue({
      success: false,
      error: { format: jest.fn().mockReturnValue("Invalid format") },
    });

    await resetPasswordController(req, res);

    expect(resetPasswordSchema.safeParse).toHaveBeenCalledWith({ password: "newPassword" });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password doesn't match criteria",
      err: "Invalid format",
    });
  });

  it("should handle server errors", async () => {
    resetPasswordSchema.safeParse.mockReturnValue({ success: true });

    User.findOne.mockRejectedValue(new Error("Database error"));

    await resetPasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
  });
});
