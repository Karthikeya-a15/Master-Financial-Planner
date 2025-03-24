import getNetWorth from "../../../common/getNetWorth.js";
import RealEstate from "../../../models/RealEstate.js";
import User from "../../../models/User.js";
import GoldModel from "../../../models/Gold.js";
import miscellaneous from "../../../models/miscellaneous.js";
import Debt from "../../../models/Debt.js";
import DomesticEquity from "../../../models/DomesticEquity.js";
import ForeignEquity from "../../../models/ForeignEquity.js";
import CryptoCurrency from "../../../models/CryptoCurrency.js";

jest.mock("../../../models/RealEstate.js");
jest.mock("../../../models/User.js");
jest.mock("../../../models/Gold.js");
jest.mock("../../../models/miscellaneous.js");
jest.mock("../../../models/Debt.js");
jest.mock("../../../models/DomesticEquity.js");
jest.mock("../../../models/ForeignEquity.js");
jest.mock("../../../models/CryptoCurrency.js");

describe("getNetWorth", () => {
    it("should return the correct net worth structure", async () => {
        const mockUser = {
            netWorth: {
                realEstate: "realEstateId",
                gold: "goldId",
                miscellaneous: "miscId",
                debt: "debtId",
                domesticEquity: "domesticEquityId",
                foreignEquity: "foreignEquityId",
                cryptocurrency: "cryptoCurrencyId",
            },
        };

        const mockRealEstate = { home: 100000, otherRealEstate: 50000, REITs: 20000 };
        const mockGold = { jewellery: 30000, SGB: 10000, digitalGoldAndETF: 5000 };
        const mockMisc = { otherInsuranceProducts: 2000, smallCase: 1000 };
        const mockDebt = {
            governmentInvestments: [{ currentValue: 5000 }],
            fixedDeposit: [{ currentValue: 10000 }],
            debtFunds: [{ currentValue: 15000 }],
            liquidFund: [{ currentValue: 2000 }],
        };
        const mockDomesticEquity = {
            directStocks: [{ currentValue: 10000 }],
            mutualFunds: [{ currentValue: 20000 }],
        };
        const mockForeignEquity = { sAndp500: 5000, otherETF: 3000, mutualFunds: 2000 };
        const mockCryptoCurrency = { crypto: 1000 };

        User.findOne.mockResolvedValue(mockUser);
        RealEstate.findById.mockResolvedValue(mockRealEstate);
        GoldModel.findById.mockResolvedValue(mockGold);
        miscellaneous.findById.mockResolvedValue(mockMisc);
        Debt.findById.mockResolvedValue(mockDebt);
        DomesticEquity.findById.mockResolvedValue(mockDomesticEquity);
        ForeignEquity.findById.mockResolvedValue(mockForeignEquity);
        CryptoCurrency.findById.mockResolvedValue(mockCryptoCurrency);

        const result = await getNetWorth("userId");

        expect(result).toEqual({
            illiquid: {
                home: 100000,
                otherRealEstate: 50000,
                jewellery: 30000,
                sgb: 10000,
                ulips: 2000,
                governmentInvestments: 5000,
            },
            liquid: {
                fixedDeposit: 10000,
                debtFunds: 15000,
                domesticStockMarket: 10000,
                domesticEquityMutualFunds: 20000,
                usEquity: 10000,
                smallCase: 1000,
                liquidFunds: 2000,
                liquidGold: 5000,
                crypto: 1000,
                reits: 20000,
            },
        });
    });

    it("should return an error message if an error occurs", async () => {
        User.findOne.mockRejectedValue(new Error("Database error"));

        const result = await getNetWorth("userId");

        expect(result).toEqual({ message: "Database error" });
    });
});
