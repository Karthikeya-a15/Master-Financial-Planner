import logoutController from "../../user/logoutController.js";
import User from "../../../models/User.js";

jest.mock("../../../models/User.js");

describe("logoutController", () => {
  it("should log out the user and update engagement", async () => {
    const req = { user: "userId" };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const user = {
      userEngagement: { lastLogin: new Date(Date.now() - 60000), timeSpent: 0 },
      save: jest.fn(),
    };
    User.findById.mockResolvedValueOnce(user);

    await logoutController(req, res);

    expect(user.userEngagement.timeSpent).toBe(1);
    expect(user.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "User logged out successfully" });
  });

  it("should return error if user is not found", async () => {
    const req = { user: "userId" };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findById.mockResolvedValueOnce(null);

    await logoutController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle server errors", async () => {
    const req = { user: "userId" };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findById.mockRejectedValueOnce(new Error("Database error"));

    await logoutController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
  });
});
