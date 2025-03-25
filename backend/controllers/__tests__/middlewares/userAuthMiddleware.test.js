// File: userAuthMiddleware.test.js
import userAuth from "../../../middleware/userAuthMiddleware.js"; // Adjust path as necessary
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("userAuth Middleware", () => {
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

  it("should authenticate user with a valid token", async () => {
    const mockUserId = "user123";
    const mockToken = "valid.jwt.token";
    req.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockReturnValue({ id: mockUserId });

    await userAuth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret");
    expect(req.user).toBe(mockUserId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); // Ensure no error response
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 401 if no authorization header is present", async () => {
    await userAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header is not a Bearer token", async () => {
    req.headers.authorization = "Basic some-other-token";

    await userAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is missing", async () => {
    req.headers.authorization = "Bearer "; // Empty token

    await userAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token is missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 500 if JWT verification fails", async () => {
    const mockToken = "invalid.jwt.token";
    req.headers.authorization = `Bearer ${mockToken}`;

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await userAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 500 if the decoded user ID is missing", async () => {
    const mockToken = "valid.jwt.token";
    req.headers.authorization = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue({}); // Return an object without 'id'

    await userAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "User not authenticated" });
    expect(next).not.toHaveBeenCalled();
  });
});