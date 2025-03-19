import getDashBoardController, { getTotalSum, requiredInvestableAssetAllocation }  from "./getDashBoardController.js";
import liabilities from "../../models/Liabilities.js";
import User from "../../models/User.js";
import Goals from "../../models/Goals.js";
import RAM from "../../models/returnsAndAssets.js";
import getCurrentInvestibleAssets from "../../common/currentInvestibleAssets.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/Liabilities.js");
jest.mock("../../models/User.js");
jest.mock("../../models/Goals.js");
jest.mock("../../models/returnsAndAssets.js");
jest.mock("../../common/currentInvestibleAssets.js");
jest.mock("./getDashBoardController", () => {
    const originalModule = jest.requireActual("./getDashBoardController"); // Keep original implementations
    return {
      __esModule: true, // Important for ES modules
      ...originalModule, // Spread the original module to keep other functions
      requiredInvestableAssetAllocation: jest.fn(), // Mock the specific function
      getTotalSum: originalModule.getTotalSum //could have mocked this too
    };
  });


describe("getDashBoardController", () => {
    it("should return dashboard data for a valid user", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { liabilities: "67b82107183c091d4d3990d0" }, ram: "67b82107183c091d4d3990d9", goals: "67b82107183c091d4d3990d7" };
        const mockIlliquid = { home: 100, otherRealEstate: 50, ulips: 20, governmentInvestments: 30, jewellery: 10, sgb: 5 };
        const mockLiquid = { reits: 15, domesticStockMarket: 40, domesticEquityMutualFunds: 25, smallCase: 10, usEquity: 5, fixedDeposit: 20, debtFunds: 15, liquidFunds: 10, liquidGold: 5, crypto: 5 };
        const mockCurrentInvestibleAssets = 200;
        const mockLiabilities = { homeLoan: 50, educationLoan: 10, carLoan: 5, personalLoan: 2, creditCard: 1, other: 0 };
        const mockRequiredAllocation = { debt: 10, domesticEquity: 20, usEquity: 5, gold: 2, crypto: 1, realEstate: 5 };

        User.findById.mockResolvedValue(mockUser);
        getCurrentInvestibleAssets.mockResolvedValue({ illiquid: mockIlliquid, liquid: mockLiquid, currentInvestibleAssets: mockCurrentInvestibleAssets });
        liabilities.findById.mockResolvedValue(mockLiabilities);
        requiredInvestableAssetAllocation.mockResolvedValue(mockRequiredAllocation);
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getDashBoardController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            illiquid: mockIlliquid,
            liquid: mockLiquid,
            Liabilities: mockLiabilities,
            totalAssetSummary: getTotalSum(mockIlliquid, mockLiquid),
            currentInvestibleAssets: mockCurrentInvestibleAssets,
            requiredInvestableAssetAllocation: mockRequiredAllocation,
        });
        expect(User.findById).toHaveBeenCalledWith(mockUserId);
        expect(getCurrentInvestibleAssets).toHaveBeenCalledWith(mockUserId);
        expect(liabilities.findById).toHaveBeenCalledWith(mockUser.netWorth.liabilities);
    });

    it("should handle errors from getCurrentInvestibleAssets", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockErrorMessage = "Error fetching investible assets";

        User.findById.mockResolvedValue({}); // Mock user found
        getCurrentInvestibleAssets.mockResolvedValue({ message: mockErrorMessage });
        const req = createRequest({user: mockUserId});
        const res = createResponse();
        await getDashBoardController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: mockErrorMessage });
    });

    it("should handle internal server errors", async () => {
        const mockError = new Error("Database error");
        User.findById.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3"});
        const res = createResponse();

        await getDashBoardController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Database error" });
    });
});

describe('getTotalSum', () => {
    it('should correctly calculate the total sum of assets', () => {
      const illiquid = { home: 100, otherRealEstate: 50, ulips: 20, governmentInvestments: 30, jewellery: 10, sgb: 5 };
      const liquid = { reits: 15, domesticStockMarket: 40, domesticEquityMutualFunds: 25, smallCase: 10, usEquity: 5, fixedDeposit: 20, debtFunds: 15, liquidFunds: 10, liquidGold: 5, crypto: 5 };
      const expectedTotal = {
        realEstate: 165,   // 100 + 50 + 15
        domesticEquity: 95, // 20 + 40 + 25 + 10
        usEquity: 5,
        debt: 75,          // 30 + 20 + 15 + 10
        gold: 20,          // 10 + 5 + 5
        crypto: 5,
      };
      expect(getTotalSum(illiquid, liquid)).toEqual(expectedTotal);
    });
});

describe('requiredInvestableAssetAllocation', () => {
    it('should correctly calculate required investable asset allocation', async () => {
        const mockUser = { goals: '67b82107183c091d4d3990d7', ram: '67b82107183c091d4d3990d9' };
        const mockGoals = {
            goals: [
            { amountAvailableToday: 100, time: 2 }, // Short-term
            { amountAvailableToday: 200, time: 5 }, // Medium-term
            { amountAvailableToday: 300, time: 10 }, // Long-term
            ],
        };
        const mockRAM = {
            shortTerm: { debt: 50, domesticEquity: 30, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 },
            mediumTerm: { debt: 30, domesticEquity: 40, usEquity: 15, gold: 10, crypto: 5, realEstate: 0 },
            longTerm: { debt: 10, domesticEquity: 50, usEquity: 20, gold: 10, crypto: 5, realEstate: 5 },
        };

        const expectedRiaa = {
            debt: 10,          
            domesticEquity: 20,
            usEquity: 5,       
            gold: 2,            
            crypto: 1,        
            realEstate: 5,   
        };

        Goals.findById.mockResolvedValue(mockGoals);
        RAM.findById.mockResolvedValue(mockRAM);

        // Call the function and check the result
        const result = await requiredInvestableAssetAllocation(mockUser);
        expect(result).toEqual(expectedRiaa);
    });
});