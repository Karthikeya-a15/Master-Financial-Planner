import RealEstate from "../models/RealEstate.js";
import User from "../models/User.js";
import GoldModel from "../models/Gold.js";
import miscellaneous from "../models/miscellaneous.js";
import Debt from  "../models/Debt.js";
import DomesticEquity from "../models/DomesticEquity.js";
import ForeignEquity from "../models/ForeignEquity.js";
import CryptoCurrency from "../models/CryptoCurrency.js";
import Liabilities from "../models/Liabilities.js";

export default async function getNetWorth(userid) {
    try {
        const user = await User.findOne({_id : userid});
        
        const realEstateId = user.netWorth.realEstate;
        const goldId = user.netWorth.gold;
        const miscId = user.netWorth.miscellaneous;
        const debtId = user.netWorth.debt;
        const domesticEquityId = user.netWorth.domesticEquity;
        const ForeignEquityId = user.netWorth.foreignEquity;
        const cryptoCurrencyId = user.netWorth.cryptocurrency;

        const realEstate = await RealEstate.findById(realEstateId);
        const gold = await GoldModel.findById(goldId);
        const misc = await miscellaneous.findById(miscId);
        const debt = await Debt.findById(debtId);
        const domesticEquity = await DomesticEquity.findById(domesticEquityId);
        const foreignEquity = await ForeignEquity.findById(ForeignEquityId);
        const cryptoCurrency = await CryptoCurrency.findById(cryptoCurrencyId);

        const illiquid = {
            home : realEstate.home,
            otherRealEstate : realEstate.otherRealEstate,
            jewellery : gold.jewellery,
            sgb : gold.SGB,
            ulips : misc.otherInsuranceProducts,
            governmentInvestments : debt.governmentInvestments.reduce((sum, item) => (item.currentValue || 0),0)
        }

        const liquid = {
            fixedDeposit : debt.fixedDeposit.reduce((sum, item) => sum + (item.currentValue || 0),0),
            debtFunds : debt.debtFunds.reduce((sum, item) => sum + (item.currentValue || 0),0),
            domesticStockMarket : domesticEquity.directStocks.reduce((sum, item) => sum + (item.currentValue || 0),0),
            domesticEquityMutualFunds : domesticEquity.mutualFunds.reduce((sum, item) => sum + (item.currentValue || 0),0),
            usEquity : foreignEquity.sAndp500 + foreignEquity.otherETF + foreignEquity.mutualFunds,
            smallCase : misc.smallCase,
            liquidFunds : debt.liquidFund.reduce((sum, item) => sum + (item.currentValue || 0),0),
            liquidGold : gold.digitalGold + gold.goldETF,
            crypto : cryptoCurrency.crypto,
            reits : realEstate.REITs
        }
        const obj = {
            illiquid,
            liquid
        }        
        return obj;
    }
    catch(err){
        return {message : err.message};
    }

}