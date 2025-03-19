import getFinancialGoalsController from "../../get/getFinancialGoalsController.js";
import Goals from "../../../models/Goals.js";
import User from "../../../models/User.js";
import RAM from "../../../models/returnsAndAssets.js";
import CashFlows from "../../../models/CashFlows.js";
import getCurrentInvestibleAssets from "../../../common/currentInvestibleAssets.js";
import { createRequest, createResponse } from "node-mocks-http";

jest.mock("../../../models/Goals.js");
jest.mock("../../../models/User.js");
jest.mock("../../../models/returnsAndAssets.js");
jest.mock("../../../models/CashFlows.js");
jest.mock("../../../common/currentInvestibleAssets.js");

describe("getFinancialGoalsController", () => {
  it("should return financial goals and related data for a valid user", async () => {
    const mockUserId = "67b82107183c091d4d3990c3";
    const mockUser = {
      _id: mockUserId,
      goals: "67b82107183c091d4d3990d7",
      ram: "67b82107183c091d4d3990d9",
      netWorth: { cashFlows: "67b82107183c091d4d3990c4" },
    };
    const mockGoals = {
      goals: [],
      sipAmountDistribution: [],
      sipAssetAllocation: [],
    };
    const mockReturnsAndAssets = {
      expectedReturns: {},
      shortTerm: {},
      mediumTerm: {},
      longTerm: {},
    };
    const mockCashFlows = {
      inflows: { salary: 5000 },
      outflows: { expenses: 2000 },
    };
    const mockCurrentInvestibleAssets = 1000;

    User.findOne.mockResolvedValue(mockUser);
    Goals.findOne.mockResolvedValue(mockGoals);
    RAM.findOne.mockResolvedValue(mockReturnsAndAssets);
    CashFlows.findOne.mockResolvedValue(mockCashFlows);
    getCurrentInvestibleAssets.mockResolvedValue({
      currentInvestibleAssets: mockCurrentInvestibleAssets,
    });

    const req = createRequest({ user: mockUserId });
    const res = createResponse();
    await getFinancialGoalsController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      goals: mockGoals.goals,
      returnsAndAssets: mockReturnsAndAssets,
      cashAvailable: 3000, // 5000 - 2000
      currentInvestibleAssets: mockCurrentInvestibleAssets,
      sipAmountDistribution: mockGoals.sipAmountDistribution,
      sipAssetAllocation: mockGoals.sipAssetAllocation,
    });
    expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(Goals.findOne).toHaveBeenCalledWith({ _id: mockUser.goals });
    expect(RAM.findOne).toHaveBeenCalledWith({ _id: mockUser.ram });
    expect(CashFlows.findOne).toHaveBeenCalledWith({
      _id: mockUser.netWorth.cashFlows,
    });
    expect(getCurrentInvestibleAssets).toHaveBeenCalledWith(mockUserId);
  });

  it("should handle internal server errors", async () => {
    const mockError = new Error("Database error");
    User.findOne.mockRejectedValue(mockError);
    const req = createRequest({ user: "67b82107183c091d4d3990c3" });
    const res = createResponse();
    await getFinancialGoalsController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal error",
      err: "Database error",
    });
  });
});
