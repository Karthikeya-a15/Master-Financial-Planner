import getCurrentInvestibleAssets from "../../../common/currentInvestibleAssets.js";
import getNetWorth from "../../../common/getNetWorth.js";

jest.mock("../../../common/getNetWorth.js");

describe("getCurrentInvestibleAssets", () => {
    it("should calculate current investible assets correctly", async () => {
        const mockNetWorth = {
            illiquid: {
                otherRealEstate: 50000,
                ulips: 2000,
                governmentInvestments: 5000,
                sgb: 10000,
            },
            liquid: {
                reits: 20000,
                domesticStockMarket: 10000,
                domesticEquityMutualFunds: 20000,
                smallCase: 1000,
                usEquity: 10000,
                fixedDeposit: 10000,
                debtFunds: 15000,
                liquidFunds: 2000,
                liquidGold: 5000,
                crypto: 1000,
            },
        };

        getNetWorth.mockResolvedValue(mockNetWorth);

        const result = await getCurrentInvestibleAssets("userId");

        expect(result).toEqual({
            illiquid: mockNetWorth.illiquid,
            liquid: mockNetWorth.liquid,
            currentInvestibleAssets: 161000,
        });
    });

    it("should return an error message if getNetWorth fails", async () => {
        getNetWorth.mockResolvedValue(new Error("Error fetching net worth"));

        const result = await getCurrentInvestibleAssets("userId");

        expect(result).toEqual({ message: "Error fetching net worth" });
    });
});
