import axios from "axios";
import getTickerTapeFunds from "./tickerTape.js";
import * as cheerio from "cheerio";

async function getSectorFunds(subsector){
    let bankingAndPSU = []
    let corporateBonds = []
    let indexFunds = []

    const pageSize = 500;

    let response;

    if(subsector == "Banking & PSU Fund"){
        response = await axios.get(`https://lt.morningstar.com/api/rest.svc/g9vi2nsqjb/security/screener?page=1&pageSize=${pageSize}&sortOrder=name%20asc&outputType=json&version=1&languageId=en&currencyId=INR&universeIds=FOIND%24%24ALL&securityDataPoints=secId%2ClegalName%2CclosePrice%2CclosePriceDate%2Cyield_M12%2CongoingCharge%2CcategoryName%2CMedalist_RatingNumber%2CstarRatingM255%2CreturnD1%2CreturnW1%2CreturnM1%2CreturnM3%2CreturnM6%2CreturnM0%2CreturnM12%2CreturnM36%2CreturnM60%2CreturnM120%2CmaxFrontEndLoad%2CmanagerTenure%2CmaxDeferredLoad%2CexpenseRatio%2CinitialPurchase%2CfundTnav%2CequityStyleBox%2CbondStyleBox%2CaverageMarketCapital%2CaverageCreditQualityCode%2CeffectiveDuration%2CmorningstarRiskM255%2CalphaM36%2CbetaM36%2Cr2M36%2CstandardDeviationM36%2CsharpeM36%2CtrackRecordExtension&filters=distribution%3AIN%3Aacc%7CCategoryId%3AIN%3AINCA000065&term=`);
        bankingAndPSU = response.data.rows;

        return {"Banking & PSU Fund" :bankingAndPSU};
    }

    response = await axios.get(`https://lt.morningstar.com/api/rest.svc/g9vi2nsqjb/security/screener?page=1&pageSize=${pageSize}&sortOrder=name%20asc&outputType=json&version=1&languageId=en&currencyId=INR&universeIds=FOIND%24%24ALL&securityDataPoints=secId%2ClegalName%2CclosePrice%2CclosePriceDate%2Cyield_M12%2CongoingCharge%2CcategoryName%2CMedalist_RatingNumber%2CstarRatingM255%2CreturnD1%2CreturnW1%2CreturnM1%2CreturnM3%2CreturnM6%2CreturnM0%2CreturnM12%2CreturnM36%2CreturnM60%2CreturnM120%2CmaxFrontEndLoad%2CmanagerTenure%2CmaxDeferredLoad%2CexpenseRatio%2CinitialPurchase%2CfundTnav%2CequityStyleBox%2CbondStyleBox%2CaverageMarketCapital%2CaverageCreditQualityCode%2CeffectiveDuration%2CmorningstarRiskM255%2CalphaM36%2CbetaM36%2Cr2M36%2CstandardDeviationM36%2CsharpeM36%2CtrackRecordExtension&filters=distribution%3AIN%3Aacc%7CCategoryId%3AIN%3AINCA000064&term=`)
    corporateBonds = response.data.rows;

    response = await axios.get(`https://lt.morningstar.com/api/rest.svc/g9vi2nsqjb/security/screener?page=1&pageSize=${pageSize}&sortOrder=name%20asc&outputType=json&version=1&languageId=en&currencyId=INR&universeIds=FOIND%24%24ALL&securityDataPoints=secId%2ClegalName%2CclosePrice%2CclosePriceDate%2Cyield_M12%2CongoingCharge%2CcategoryName%2CMedalist_RatingNumber%2CstarRatingM255%2CreturnD1%2CreturnW1%2CreturnM1%2CreturnM3%2CreturnM6%2CreturnM0%2CreturnM12%2CreturnM36%2CreturnM60%2CreturnM120%2CmaxFrontEndLoad%2CmanagerTenure%2CmaxDeferredLoad%2CexpenseRatio%2CinitialPurchase%2CfundTnav%2CequityStyleBox%2CbondStyleBox%2CaverageMarketCapital%2CaverageCreditQualityCode%2CeffectiveDuration%2CmorningstarRiskM255%2CalphaM36%2CbetaM36%2Cr2M36%2CstandardDeviationM36%2CsharpeM36%2CtrackRecordExtension&filters=distribution%3AIN%3Aacc%7CCategoryId%3AIN%3AINCA000078&term=`)
    indexFunds = response.data.rows;

    corporateBonds = corporateBonds.concat(indexFunds);

    return { "Corporate Bond Fund" : corporateBonds};
}

async function getAccessToken(id, name) {
    try{
    const fundURL = `https://www.morningstar.in/mutualfunds/${id.toLowerCase()}/${name.replaceAll("&","n").toLowerCase().replaceAll(" ","-")}/overview.aspx`

    const response = await axios.get(fundURL);

    const html = response.data;
        
    const $ = cheerio.load(html);
        
    const accessToken = $('meta[name="accessToken"]').attr('content'); 

    return accessToken;
    }catch(err){
        console.log(err.message);
        return "";
    }
}


async function getModifiedDuration(id, accessToken){
    try{
        const response = await axios.get(`https://api-global.morningstar.com/sal-service/v1/fund/process/fixedIncomeStyle/${id.toUpperCase()}/data?languageId=en&locale=en&clientId=RSIN_SAL&benchmarkId=mstarorcat&component=sal-mip-fixed-income-style&version=4.55.0&access_token=${accessToken}`);

        const data = response.data;

        const modifiedDuration = data.fund.modifiedDuration

        if(!modifiedDuration) return 0;

        return modifiedDuration;
    }catch(err){
        console.log(err.message);
        return "";
    }
}


function getCorrectName(name){
    let finalName = name;

    if(name.indexOf("SL") != -1){
        finalName = finalName.replaceAll("SL", "Sun Life");
    }

    if(name.indexOf("Pru") != -1){
        finalName = finalName.replaceAll("Pru", "Prudential");
    }

    if(name.indexOf("Index") != -1){
        finalName = finalName.substring(0, name.indexOf("Index"));
    }

    const symbolAnd = finalName.indexOf('&');
    const and = finalName.indexOf('and');
    const corp = finalName.indexOf("Corp");

    if(symbolAnd != -1){
        finalName = finalName.substring(0, symbolAnd);
    }
    else if(and != -1){
        finalName = finalName.substring(0, and);
    }
    else if(corp != -1){
        if(finalName.indexOf("Corporate") == -1)
            finalName = finalName.replace("Corp", "Corporate")
    }

    if(finalName.indexOf("Bond") != -1)
        finalName = finalName.substring(0, finalName.indexOf("Bond"));

    return finalName;
}

function print(array){
    array.forEach(element => {
        console.log(element.legalName+"\n");
    });
}

function customRound(num) {
    const factor = 100; // To keep 2 decimal places
    const thirdDecimal = Math.floor(num * 1000) % 10; // Extract the 3rd decimal place

    if (thirdDecimal > 5) {
        return ((Math.floor(num * factor) + 1) / factor).toFixed(2);
    } else {
        return (Math.floor(num * factor) / factor).toFixed(2);
    }
}

async function getMorningStar(expectedInterestRateChange, subsector, tickerTapeFunds) {
    try {
        const msFunds = await getSectorFunds(subsector);

        const firstFund = msFunds[subsector][0];
        const accessToken = await getAccessToken(firstFund.secId, firstFund.legalName);

        // print(msFunds[subsector])
        const finalFunds = await Promise.all(tickerTapeFunds.map(async (fund) => {
            const name = getCorrectName(fund.name);
            const expRatio = fund.expenseRatio;
            const cagr = fund.cagr;
            const actualFund = msFunds[subsector].find(f => 
                f.legalName.toLowerCase().includes(name.toLowerCase()) &&
                // Math.abs(f.returnM36 - cagr) <= 0.1 &&
                f.expenseRatio === expRatio &&
                (!f.legalName.includes("Regular") && f.legalName.includes("Direct"))
            );
            
            if (!actualFund) {
                console.log(fund);
                throw new Error(`Fund not found for ${name}`);
            }

            const managerTenure = Number(actualFund.managerTenure.toFixed(2));
            const modifiedDuration = await getModifiedDuration(actualFund.secId, accessToken) || 0;
            const expectedReturns = Number(customRound(modifiedDuration * -1 * expectedInterestRateChange + fund.avgYTM - fund.expenseRatio));

            return {
                ...fund,
                managerTenure,
                modifiedDuration,
                expectedReturns
            };
        }));

        return finalFunds;
    } catch (error) {
        console.error(`Error in getMorningStar: ${error.message}`);
        throw error; // Re-throw the error if needed
    }
}




export default async function main(expectedInterestRateChange, subsector) {
    const tickerTapeFunds = await getTickerTapeFunds(subsector);

    const finalFunds = await getMorningStar(expectedInterestRateChange, subsector, tickerTapeFunds);

    // console.log(finalFunds);
    return finalFunds;
}

// main("Banking & PSU Fund")
// main(-1,"Corporate Bond Fund")