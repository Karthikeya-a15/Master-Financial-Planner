// File: adminAuthMiddleware.test.js
import adminAuth from "../../../middleware/adminAuthMiddleware.js"; // Adjust path as necessary
import jwt from "jsonwebtoken";
import Admin from "../../../models/Admin.js"; // Adjust path as necessary

jest.mock("jsonwebtoken");
jest.mock("../../../models/Admin");

describe("adminAuth Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.JWT_SECRET;
  });

  it("should authenticate admin with a valid token", async () => {
    const mockAdminId = "admin123";
    const mockToken = "valid.jwt.token";
    req.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockReturnValue({ id: mockAdminId });
    Admin.findById.mockResolvedValue({ _id: mockAdminId }); // Mock admin exists

    await adminAuth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret");
    expect(Admin.findById).toHaveBeenCalledWith(mockAdminId);
    expect(req.admin).toBe(mockAdminId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); // Ensure no error response
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 401 if no authorization header is present", async () => {
    await adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Admin not authenticated" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header is not a Bearer token", async () => {
    req.headers.authorization = "Basic some-other-token";

    await adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Admin not authenticated" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is missing", async () => {
    req.headers.authorization = "Bearer "; // Empty token

    await adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token is missing" });
    expect(next).not.toHaveBeenCalled();
  });

    it("should return 401 if admin is not found", async () => {
        const mockAdminId = "admin123";
        const mockToken = "valid.jwt.token";
        req.headers.authorization = `Bearer ${mockToken}`;

        jwt.verify.mockReturnValue({ id: mockAdminId });
        Admin.findById.mockResolvedValue(null); // Mock admin not found

        await adminAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid admin token" });
        expect(next).not.toHaveBeenCalled();
    });

  it("should return 500 if JWT verification fails", async () => {
    const mockToken = "invalid.jwt.token";
    req.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

    it("should return 500 if there is an error finding the admin", async () => {
        const mockAdminId = "admin123";
        const mockToken = "valid.jwt.token";
        req.headers.authorization = `Bearer ${mockToken}`;

        jwt.verify.mockReturnValue({ id: mockAdminId });
        Admin.findById.mockRejectedValue(new Error("Database error"));

        await adminAuth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
        expect(next).not.toHaveBeenCalled();
    });
});