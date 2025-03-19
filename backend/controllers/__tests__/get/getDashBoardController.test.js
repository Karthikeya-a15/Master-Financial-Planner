import getDashBoardController, {
  getTotalSum,
  requiredInvestableAssetAllocation,
} from "../../get/getDashBoardController.js";
import liabilities from "../../../models/Liabilities.js";
import User from "../../../models/User.js";
import Goals from "../../../models/Goals.js";
import RAM from "../../../models/returnsAndAssets.js";
import getCurrentInvestibleAssets from "../../../common/currentInvestibleAssets.js";
jest.mock("../../../models/Liabilities.js");
jest.mock("../../../models/User.js");
jest.mock("../../../models/Goals.js");
jest.mock("../../../models/returnsAndAssets.js");
jest.mock("../../../common/currentInvestibleAssets.js");

describe("getDashBoardController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3" };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows chaining
    };

    jest.clearAllMocks();
  });

  test("should return dashboard data for a valid user", async () => {
    const mockUser = {
      _id: req.user,
      netWorth: { liabilities: "67b82107183c091d4d3990c6" },
      goals: "67b82107183c091d4d3990c9",
      ram: "67b82107183c091d4d3990d0",
    };

    const mockLiabilities = {
      homeLoan: 50000,
      educationLoan: 20000,
      carLoan: 15000,
      personalLoan: 10000,
      creditCard: 5000,
      other: 8000,
    };

    const mockInvestibleAssets = {
      illiquid: {
        home: 100000,
        otherRealEstate: 50000,
        ulips: 20000,
        governmentInvestments: 30000,
        jewellery: 10000,
        sgb: 5000,
      },
      liquid: {
        domesticStockMarket: 50000,
        domesticEquityMutualFunds: 30000,
        smallCase: 10000,
        usEquity: 20000,
        fixedDeposit: 30000,
        debtFunds: 25000,
        liquidFunds: 15000,
        liquidGold: 10000,
        crypto: 5000,
        reits: 8000,
      },
      currentInvestibleAssets: 200000,
      message: null,
    };

    User.findById.mockResolvedValue(mockUser);
    getCurrentInvestibleAssets.mockResolvedValue(mockInvestibleAssets);
    liabilities.findById.mockResolvedValue(mockLiabilities);
    const mockRequiredInvestableAssets = {
      debt: 50000,
      domesticEquity: 60000,
      usEquity: 20000,
      gold: 15000,
      crypto: 5000,
      realEstate: 30000,
    };
    jest.spyOn(global, "requiredInvestableAssetAllocation").mockResolvedValue(
      mockRequiredInvestableAssets
    );

    await getDashBoardController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(getCurrentInvestibleAssets).toHaveBeenCalledWith(req.user);
    expect(liabilities.findById).toHaveBeenCalledWith(
      mockUser.netWorth.liabilities
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      illiquid: mockInvestibleAssets.illiquid,
      liquid: mockInvestibleAssets.liquid,
      Liabilities: mockLiabilities,
      totalAssetSummary: getTotalSum(
        mockInvestibleAssets.illiquid,
        mockInvestibleAssets.liquid
      ),
      currentInvestibleAssets: mockInvestibleAssets.currentInvestibleAssets,
      requiredInvestableAssetAllocation: mockRequiredInvestableAssets,
    });
  });

  test("should return 500 if getCurrentInvestibleAssets returns an error", async () => {
    getCurrentInvestibleAssets.mockResolvedValue({
      message: "Error fetching investible assets",
    });

    await getDashBoardController(req, res);

    expect(getCurrentInvestibleAssets).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching investible assets",
    });
  });

  test("should handle internal server errors", async () => {
    User.findById.mockRejectedValue(new Error("Database error"));

    await getDashBoardController(req, res);

    expect(User.findById).toHaveBeenCalledWith(req.user);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database error",
    });
  });
});

describe("getTotalSum", () => {
  test("should correctly calculate total asset summary", () => {
    const illiquid = {
      home: 100000,
      otherRealEstate: 50000,
      ulips: 20000,
      governmentInvestments: 30000,
      jewellery: 10000,
      sgb: 5000,
    };

    const liquid = {
      domesticStockMarket: 50000,
      domesticEquityMutualFunds: 30000,
      smallCase: 10000,
      usEquity: 20000,
      fixedDeposit: 30000,
      debtFunds: 25000,
      liquidFunds: 15000,
      liquidGold: 10000,
      crypto: 5000,
      reits: 8000,
    };

    const expectedSummary = {
      realEstate: 158000,
      domesticEquity: 110000,
      usEquity: 20000,
      debt: 100000,
      gold: 25000,
      crypto: 5000,
    };

    expect(getTotalSum(illiquid, liquid)).toEqual(expectedSummary);
  });
});

describe("requiredInvestableAssetAllocation", () => {
  test("should calculate required asset allocation based on goals", async () => {
    const mockUser = { goals: "67b82107183c091d4d3990c9", ram: "67b82107183c091d4d3990d0" };

    const mockGoals = {
      goals: [
        { amountAvailableToday: 50000, time: 2 },
        { amountAvailableToday: 100000, time: 5 },
        { amountAvailableToday: 150000, time: 10 },
      ],
    };

    const mockRAM = {
      shortTerm: { debt: 70, domesticEquity: 20, usEquity: 5, gold: 5, crypto: 0, realEstate: 0 },
      mediumTerm: { debt: 50, domesticEquity: 40, usEquity: 5, gold: 5, crypto: 0, realEstate: 0 },
      longTerm: { debt: 20, domesticEquity: 60, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 },
    };

    Goals.findById.mockResolvedValue(mockGoals);
    RAM.findById.mockResolvedValue(mockRAM);

    const expectedAllocation = {
      debt: 85500,
      domesticEquity: 99000,
      usEquity: 15000,
      gold: 12500,
      crypto: 7500,
      realEstate: 0,
    };

    const result = await requiredInvestableAssetAllocation(mockUser);

    expect(Goals.findById).toHaveBeenCalledWith(mockUser.goals);
    expect(RAM.findById).toHaveBeenCalledWith(mockUser.ram);
    expect(result).toEqual(expectedAllocation);
  });

  test("should return null if an error occurs", async () => {
    Goals.findById.mockRejectedValue(new Error("Database error"));

    const result = await requiredInvestableAssetAllocation({});

    expect(result).toBeNull();
  });
});