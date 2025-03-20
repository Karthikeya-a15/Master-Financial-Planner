// dashboardController.test.js

import getDashBoardController, { getTotalSum, requiredInvestableAssetAllocation } from '../../get/getDashBoardController.js';
import liabilities from '../../../models/Liabilities.js';
import User from '../../../models/User.js';
import Goals from '../../../models/Goals.js';
import RAM from '../../../models/returnsAndAssets.js';
import getCurrentInvestibleAssets from '../../../common/currentInvestibleAssets.js';

jest.mock('../../../models/Liabilities.js');
jest.mock('../../../models/User.js');
jest.mock('../../../models/Goals.js');
jest.mock('../../../models/returnsAndAssets.js');
jest.mock('../../../common/currentInvestibleAssets.js');

describe('Dashboard Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: 'someUserId'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashBoardController', () => {
    it('should return 500 if getCurrentInvestibleAssets fails', async () => {
      getCurrentInvestibleAssets.mockResolvedValue({ message: 'Error fetching assets' });

      await getDashBoardController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching assets' });
    });

    it('should return dashboard data on success', async () => {
      const mockUser = { netWorth: { liabilities: 'liabilityId' }, goals: 'goalId', ram: 'ramId' };
      const mockLiability = { homeLoan: 1000, educationLoan: 500, carLoan: 300, personalLoan: 200, creditCard: 100, other: 50 };
      const mockAssets = { illiquid: { home: 5000, otherRealEstate: 3000, reits: 2000 }, liquid: { domesticStockMarket: 1000, domesticEquityMutualFunds: 500, smallCase: 300, usEquity: 200, fixedDeposit: 1000, debtFunds: 500, liquidFunds: 300, liquidGold: 200, crypto: 100 } };
      const mockGoals = { goals: [{ amountAvailableToday: 10000, time: 5 }] };
      const mockRAM = { shortTerm: { debt: 50, domesticEquity: 30, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 }, mediumTerm: { debt: 30, domesticEquity: 50, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 }, longTerm: { debt: 10, domesticEquity: 60, usEquity: 20, gold: 5, crypto: 5, realEstate: 0 } };

      User.findById.mockResolvedValue(mockUser);
      liabilities.findById.mockResolvedValue(mockLiability);
      getCurrentInvestibleAssets.mockResolvedValue({ illiquid: mockAssets.illiquid, liquid: mockAssets.liquid, currentInvestibleAssets: 15000 });
      Goals.findById.mockResolvedValue(mockGoals);
      RAM.findById.mockResolvedValue(mockRAM);

      await getDashBoardController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        illiquid: mockAssets.illiquid,
        liquid: mockAssets.liquid,
        Liabilities: mockLiability,
        totalAssetSummary: getTotalSum(mockAssets.illiquid, mockAssets.liquid),
        currentInvestibleAssets: 15000,
        requiredInvestableAssetAllocation: expect.any(Object)
      });
    });
  });

  describe('getTotalSum', () => {
    it('should correctly calculate the total sum of assets', () => {
      const illiquid = {
        home: 5000,
        otherRealEstate: 3000,
        ulips: 1000,
        governmentInvestments: 500,
        jewellery: 300,
        sgb: 200
      };

      const liquid = {
        domesticStockMarket: 1000,
        domesticEquityMutualFunds: 500,
        smallCase: 300,
        usEquity: 200,
        fixedDeposit: 1000,
        debtFunds: 500,
        liquidFunds: 300,
        liquidGold: 200,
        crypto: 100,
        reits : 2000
      };

      const result = getTotalSum(illiquid, liquid);

      expect(result).toEqual({
        realEstate: 10000, // 5000 + 3000 + 2000
        domesticEquity: 2800, // 1000 + 1000 + 500 + 300
        usEquity: 200,
        debt: 2300, // 500 + 1000 + 500 + 300
        gold: 700, // 300 + 200 + 200
        crypto: 100
      });
    });
  });

  describe('requiredInvestableAssetAllocation', () => {
    it('should correctly calculate required investable asset allocation', async () => {
      const mockUser = { goals: 'goalId', ram: 'ramId' };
      const mockGoals = { goals: [{ amountAvailableToday: 10000, time: 5 }] };
      const mockRAM = { shortTerm: { debt: 50, domesticEquity: 30, usEquity: 15, gold: 5, crypto: 0, realEstate: 0 }, mediumTerm: { debt: 30, domesticEquity: 50, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 }, longTerm: { debt: 10, domesticEquity: 60, usEquity: 20, gold: 5, crypto: 5, realEstate: 0 } };

      Goals.findById.mockResolvedValue(mockGoals);
      RAM.findById.mockResolvedValue(mockRAM);

      const result = await requiredInvestableAssetAllocation(mockUser);

      expect(result).toEqual({
        debt: 3000,
        domesticEquity: 5000,
        usEquity: 1000,
        gold: 500,
        crypto: 500,
        realEstate: 0
      });
    });

    it('should return null if an error occurs', async () => {
      const mockUser = { goals: 'goalId', ram: 'ramId' };
      Goals.findById.mockRejectedValue(new Error('Error fetching goals'));

      const result = await requiredInvestableAssetAllocation(mockUser);

      expect(result).toBeNull();
    });
  });
});