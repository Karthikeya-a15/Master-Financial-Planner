import autoSuggestionStockController from "../../get/autoSuggestionStockController.js";

// Mock stockMapping
jest.mock("../../../utils/stock_mapping.js", () => ({
  stockMapping: {
    RELIANCE: {},
    "RELIANCE INDUSTRIES": {},
    TATA: {},
  },
}));

// Import the mocked stockMapping
import { stockMapping } from "../../../utils/stock_mapping.js";

describe("autoSuggestionStockController", () => {
  let req, res;

  beforeEach(() => {
    req = { query: { name: "" } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Enables method chaining
    };

    // Reset stockNames before each test
    jest.resetModules(); // This ensures the module is reloaded and stockNames is reset
  });

  test("should return stock suggestions based on name", async () => {
    req.query.name = "rel";

    await autoSuggestionStockController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      suggestions: ["RELIANCE", "RELIANCE INDUSTRIES"],
    });
  });

  test("should return empty suggestions if no match", async () => {
    req.query.name = "xyz";

    await autoSuggestionStockController(req, res);

    expect(res.json).toHaveBeenCalledWith({ suggestions: [] });
  });

  test("should handle case-insensitive matches", async () => {
    req.query.name = "REL"; // Uppercase input

    await autoSuggestionStockController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      suggestions: ["RELIANCE", "RELIANCE INDUSTRIES"],
    });
  });
});