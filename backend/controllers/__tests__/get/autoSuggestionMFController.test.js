import autoSuggestionMFController from "../../get/autoSuggestionMFController.js";
import axios from "axios";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("axios");

describe("autoSuggestionMFController", () => {
  const mockFundsResponse = {
    data: {
      data: {
        result: [
          {
            name: "Fund A Plan Growth",
            values: [
              { filter: "subsector", strVal: "Flexi Cap Fund" },
              { filter: "navClose", doubleVal: 10.5 },
            ],
          },
          {
            name: "Fund B Plan Direct",
            values: [
              { filter: "subsector", strVal: "Large Cap Fund" },
              { filter: "navClose", doubleVal: 12.2 },
            ],
          },
          {
            name: "Fund C Plan Growth",
            values: [
              { filter: "subsector", strVal: "Multi Cap Fund" },
              { filter: "navClose", doubleVal: 10.5 },
            ],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    axios.post.mockResolvedValue(mockFundsResponse);
  });

  it("should return filtered funds based on name and category", async () => {
    const req = createRequest({
      query: { name: "fund a", category: "flexi/multi cap" },
    });
    const res = createResponse();

    await autoSuggestionMFController(req, res);
    const funds = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(funds).toHaveLength(1);
    expect(funds[0].name).toBe("Fund A ");
    expect(funds[0].category).toBe("Flexi/Multi Cap Fund");
    expect(funds[0].nav).toBe(10.5);
    expect(axios.post).toHaveBeenCalled();
  });

  it("should return filtered funds based on name and category with multi cap funds", async () => {
    const req = createRequest({
      query: { name: "fund c", category: "flexi/multi cap" },
    });
    const res = createResponse();

    await autoSuggestionMFController(req, res);
    const funds = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(funds).toHaveLength(1);
    expect(funds[0].name).toBe("Fund C ");
    expect(funds[0].category).toBe("Flexi/Multi Cap Fund");
    expect(funds[0].nav).toBe(10.5);
    expect(axios.post).toHaveBeenCalled();
  });

  it("should handle errors from the API request", async () => {
    axios.post.mockRejectedValue(new Error("API Error"));
    const req = createRequest({
      query: { name: "fund a", category: "flexi/multi cap" },
    });
    const res = createResponse();

    await autoSuggestionMFController(req, res);
  });
});
