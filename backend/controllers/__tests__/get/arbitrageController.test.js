import arbitrageController from "../../get/arbitrageController.js";
import User from "../../../models/User.js";
import main from "../../../tools/Arbitrage/index.js";

jest.mock("../../../models/User.js");
jest.mock("../../../tools/Arbitrage/index.js");

describe("arbitrageController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  test("should return arbitrage funds for a valid user", async () => {
    const mockUser = { _id: req.user };
    const mockFunds = [{ name: "Fund 1", value: 100 }];

    User.findById.mockResolvedValue(mockUser);
    main.mockResolvedValue(mockFunds);

    await arbitrageController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockFunds);
    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(main).toHaveBeenCalled();
  });

  test("should return 403 if user is not found", async () => {
    User.findById.mockResolvedValue(null);

    await arbitrageController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

});