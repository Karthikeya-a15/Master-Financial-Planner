import loginController from "../../user/loginController.js";
import jwt from "jsonwebtoken";
import { loginSchema } from "../../../schemas/userSchemas.js";

jest.mock("jsonwebtoken");
jest.mock("../../../schemas/userSchemas.js");
jest.mock("../../../models/User.js",() => {
  const mockUserSchema = {
    methods: {
      hashPassword: jest.fn(), 
      validatePassword: jest.fn(),
    },
  };
  return {
    __esModule: true, 
    default: {
      findOne: jest.fn(),
    },
    userSchema: mockUserSchema, 
  };
})
import User from "../../../models/User.js";
describe("loginController", () => {
  it("should log in the user successfully", async () => {
    const req = { body: { email: "test@example.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    loginSchema.safeParse.mockReturnValueOnce({ success: true });
    const user = {
      validatePassword: jest.fn().mockResolvedValueOnce(true),
      userEngagement: { loginFrequency: 0, lastLogin: null },
      save: jest.fn(),
      _id: "userId",
    };
    User.findOne.mockResolvedValueOnce(user);
    jwt.sign.mockReturnValueOnce("token");

    await loginController(req, res);

    expect(user.userEngagement.loginFrequency).toBe(1);
    expect(user.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Login Successful", token: "token" });
  });

  it("should return error for invalid inputs", async () => {
    const req = { body: { email: "test@example.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    loginSchema.safeParse.mockReturnValue({ success: false, error: { format: jest.fn().mockReturnValue({}) } });

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User inputs are wrong", err: expect.any(Object) });
  });

  it("should return error if user is not found", async () => {
    const req = { body: { email: "test@example.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    loginSchema.safeParse.mockReturnValueOnce({ success: true });
    User.findOne.mockResolvedValueOnce(null);

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle server errors", async () => {
    const req = { body: { email: "test@example.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    loginSchema.safeParse.mockReturnValueOnce({ success: true });
    User.findOne.mockRejectedValueOnce(new Error("Database error"));

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal error" });
  });
});
