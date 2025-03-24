import profileController from "../../user/profileController.js";

jest.mock("../../../models/User", () => ({
  findOneAndUpdate: jest.fn(),
}));
import User from "../../../models/User.js";


describe("profileController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "userId", body: { name: "John", age: 30 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it("should update the user profile successfully", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select : jest.fn().mockResolvedValue({ name: "John", age: 30, email: "john@example.com" })
    });
    await profileController(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Profile updated successfully" }));
  });

  it("should return 404 if user is not found", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select : jest.fn().mockResolvedValue(null)
    });
    await profileController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle internal server errors", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select : jest.fn().mockRejectedValue(new Error("Database error"))
    });
    await profileController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
