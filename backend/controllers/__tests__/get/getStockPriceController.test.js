import getStockPriceController from "../../get/getStockPriceController.js";
import { getStockPriceByName } from "../../../utils/nse.js";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("../../../utils/nse.js");

describe("getStockPriceController", () => {
  it("should return the stock price for a valid stock name", async () => {
    const mockStockName = "reliance";
    const mockPrice = 2500;

    getStockPriceByName.mockResolvedValue(mockPrice);

    const req = createRequest({ query: { name: mockStockName } });
    const res = createResponse();

    await getStockPriceController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ price: mockPrice });
    expect(getStockPriceByName).toHaveBeenCalledWith(mockStockName);
  });

  it("should return 0 if stock price is not found", async () => {
    const mockStockName = "invalidStock";

    getStockPriceByName.mockResolvedValue(null);

    const req = createRequest({ query: { name: mockStockName } });
    const res = createResponse();
    await getStockPriceController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ price: 0 });
    expect(getStockPriceByName).toHaveBeenCalledWith(mockStockName);
  });
});
