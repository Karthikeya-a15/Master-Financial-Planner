import getCryptoController from "../../get/getCryptoController.js";
import CryptoCurrency from "../../../models/CryptoCurrency.js";
import User from "../../../models/User.js";

// Mock Mongoose models
jest.mock("../../../models/CryptoCurrency.js");
jest.mock("../../../models/User.js");

describe("getCryptoController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows chaining `res.status().json()`
    };

    jest.clearAllMocks();
  });

  test("should return cryptocurrency data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { cryptocurrency: "67b82107183c091d4d3990c6" },
    };
    const mockCrypto = { crypto: 1000 };

    User.findById.mockResolvedValue(mockUser);
    CryptoCurrency.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockCrypto),
    });

    await getCryptoController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(CryptoCurrency.findById).toHaveBeenCalledWith(
      mockUser.netWorth.cryptocurrency
    );
    expect(res.json).toHaveBeenCalledWith({ cryptoCurrency: mockCrypto });
  });

  test("should return an error message if cryptocurrency data is not found", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { cryptocurrency: "67b82107183c091d4d3990c6" },
    };

    User.findById.mockResolvedValue(mockUser);
    CryptoCurrency.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getCryptoController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(CryptoCurrency.findById).toHaveBeenCalledWith(
      mockUser.netWorth.cryptocurrency
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Error while Fetching Cryptocurrency ",
    });
  });

  test("should return a 500 error if User.findById throws an error", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getCryptoController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });

  test("should return a 500 error if CryptoCurrency.findById throws an error", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { cryptocurrency: "67b82107183c091d4d3990c6" },
    };

    User.findById.mockResolvedValue(mockUser);
    CryptoCurrency.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    await getCryptoController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(CryptoCurrency.findById).toHaveBeenCalledWith(
      mockUser.netWorth.cryptocurrency
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });

  test("should return 500 if user is not found", async () => {
    User.findById.mockResolvedValue(null);

    await getCryptoController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Cannot read properties of null (reading 'netWorth')",
    });
  });
});
