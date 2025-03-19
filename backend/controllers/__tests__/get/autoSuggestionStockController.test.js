import autoSuggestionStockController from "../../get/autoSuggestionStockController.js";
import { stockMapping } from "../../../utils/stock_mapping.js";

// Mock stockMapping
jest.mock("../../../utils/stock_mapping.js", () => ({
  stockMapping: {
    RELIANCE: {},
    "RELIANCE INDUSTRIES": {},
    TATA: {},
  },
}));

describe("autoSuggestionStockController", () => {
  let req, res;

  beforeEach(() => {
    req = { query: { name: "" } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Enables method chaining
    };

    jest.clearAllMocks();
  });

  test("should return stock suggestions based on name", async () => {
    req.query.name = "rel";

    await autoSuggestionStockController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      suggestions: ["RELIANCE", "RELIANCE INDUSTRIES"],
    });
  });

  test("should return empty suggestions if no match", async () => {
    req.query.name = "xyz";

    await autoSuggestionStockController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ suggestions: [] });
  });

  test("should return all suggestions if name query is empty", async () => {
    req.query.name = "";

    await autoSuggestionStockController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      suggestions: ["RELIANCE", "RELIANCE INDUSTRIES", "TATA"],
    });
  });

  test("should handle case-insensitive matches", async () => {
    req.query.name = "REL"; // Uppercase input

    await autoSuggestionStockController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      suggestions: ["RELIANCE", "RELIANCE INDUSTRIES"],
    });
  });
});
