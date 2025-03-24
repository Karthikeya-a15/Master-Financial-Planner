import saveFireController from "../../user/saveFireController.js";

jest.mock("../../../models/User", () => ({
  findOneAndUpdate: jest.fn(),
}));
import User from "../../../models/User.js";


describe("saveFireController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "userId", body: { fireNumber: 1000000 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it("should update the FIRE number successfully", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue({ fireNumber: 1000000 })
    });
    await saveFireController(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "Fire Number updated successfully" });
  });

  it("should return 404 if user is not found", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    await saveFireController(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle internal server errors", async () => {
    User.findOneAndUpdate.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error"))
    });
    await saveFireController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
