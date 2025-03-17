import getNetWorth from "./getNetWorth.js";

export default async function getCurrentInvestibleAssets(userId){
    try{
    const {illiquid , liquid, message} = await getNetWorth(userId);

    if(message){
        return  {message};    
    }

    let realEstate = illiquid.otherRealEstate + liquid.reits;
    let domesticEquity = liquid.domesticStockMarket + liquid.domesticEquityMutualFunds + liquid.smallCase + illiquid.ulips;
    let usEquity = liquid.usEquity;
    let debt = illiquid.governmentInvestments + liquid.fixedDeposit + liquid.debtFunds + liquid.liquidFunds;
    let gold = liquid.liquidGold + illiquid.sgb;
    let crypto = liquid.crypto;
        
    const currentInvestibleAssets = realEstate + domesticEquity + usEquity + debt + gold + crypto;
    
    return { illiquid, liquid, currentInvestibleAssets };
    }catch(e){
        return {message : e.message};    
    }
}