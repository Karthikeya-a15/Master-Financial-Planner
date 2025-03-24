import getStockPriceController from "../../get/getStockPriceController.js";
import { getStockPriceByName } from "../../../utils/nse.js";

jest.mock("../../../utils/nse.js");

describe("getStockPriceController", () => {
  let req, res;

  beforeEach(() => {
    req = { query: { name: "Reliance" } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return the stock price for a valid stock name", async () => {
    const mockPrice = 2500;
    getStockPriceByName.mockResolvedValue(mockPrice);

    await getStockPriceController(req, res);

    expect(getStockPriceByName).toHaveBeenCalledWith(req.query.name.toLowerCase()); // Ensure lowercase conversion
    expect(res.json).toHaveBeenCalledWith({ price: mockPrice });
  });

  test("should return 0 if stock price is not found", async () => {
    getStockPriceByName.mockResolvedValue(null);
    req.query.name = "invalidStock";

    await getStockPriceController(req, res);

    expect(getStockPriceByName).toHaveBeenCalledWith(req.query.name.toLowerCase()); // Lowercase check
    expect(res.json).toHaveBeenCalledWith({message : "Stock Price Not Found"});
  });

  
  test("should handle internal server errors", async () => {
    getStockPriceByName.mockRejectedValue(new Error("Database error"));

    await getStockPriceController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server error",
      err: "Database error",
    });
  });
});
