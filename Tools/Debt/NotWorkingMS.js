import axios from "axios";
import getTickerTapeFunds from "./tickerTape.js";
import { parseString } from "xml2js";
import { promisify } from "util";
import * as cheerio from "cheerio";
import DDG from "duck-duck-scrape";

const parseStringPromise = promisify(parseString);

// async function getAutoSuggestedFundName(fundName){
//     const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google API key
//     const searchEngineId = 'YOUR_SEARCH_ENGINE_ID'; // Replace with your Custom Search Engine ID
//     const query = `${fundName} site:morningstar.in`; // Search for the fund name on Morningstar's site

//     const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`;

//     try {
//         const response = await axios.get(url);
//         const results = response.data.items;

//         if (results && results.length > 0) {
//             // Filter results to find the overview page
//             const matchingResult = results.find(result => 
//                 result.link.match(/morningstar\.in\/mutualfunds\/.+\/overview\.aspx/)
//             );

//             if (matchingResult) {
//                 console.log("Extracted URL:", matchingResult.link);
//                 return matchingResult.link;
//             } else {
//                 console.log("No matching URL found.");
//                 return null;
//             }
//         } else {
//             console.log("No results found.");
//             return null;
//         }
//     } catch (error) {
//         console.error("Request failed:", error.message);
//         return null;
//     }
// }

async function getAccessToken(fundURL) {
    try{
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

async function getTenure(id, accessToken){
    try{
        const response = await axios.get(`https://api-global.morningstar.com/sal-service/v1/fund/people/${id.toUpperCase()}/data?locale=en&languageId=en&clientId=RSIN_SAL&benchmarkId=mstarorcat&component=sal-mip-people-summary&version=4.55.0&access_token=${accessToken}`);

        const data = response.data;

        const tenure = data.longestManagerTenure;

        if(!tenure) return 0;

        return tenure;
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

function getFundID(url){
    const match = url.match(/\/([a-z0-9]+)\/[^/]+\/overview\.aspx$/i);
    return match ? match[1] : null;
}


 async function main(expectedInterestRateChange, subsector) {
    const funds = await getTickerTapeFunds(subsector);
    console.log(funds);

    const firstFund = funds[0];
    const firstFundName = firstFund.name;

    const firstFundURL = await getAutoSuggestedFundName(firstFundName);
    console.log(firstFundURL);

    
    const token = await getAccessToken(firstFundURL) || "qQrBatf1qqLK0JoEAqcZWYEqjAWF";
    // console.log(token);
    
    if (!token) {
        throw new Error("Token is undefined");
    }
    
    const fundID = getFundID(firstFundURL);

    console.log(fundID + " " + token);
    // Fetch details for the 0th fund
    const firstFundManagerTenure = await getTenure(fundID, token);
    const firstFundModifiedDuration = await getModifiedDuration(fundID, token);

    const finalFunds = [
        {
            ...firstFund,
            fundManagerTenure: firstFundManagerTenure,
            fundModifiedDuration: firstFundModifiedDuration,
            expectedReturns : Number((firstFundModifiedDuration * expectedInterestRateChange * -1 + firstFund.avgYTM - firstFund.expenseRatio).toFixed(2))
        }
    ];

    // Process the remaining funds using the obtained token
    for (let i = 1; i < funds.length; i++) {
        const fund = funds[i];
        const fundName = fund.name;
        
        const url = await getAutoSuggestedFundName(fundName);

        const fundID = getFundID(url);

        const fundManagerTenure = await getTenure(fundID, token);
        const fundModifiedDuration = await getModifiedDuration(fundID, token);

        finalFunds.push({
            ...fund,
            fundManagerTenure,
            fundModifiedDuration,
            expectedReturns : Number((fundModifiedDuration * expectedInterestRateChange * -1 + fund.avgYTM - fund.expenseRatio).toFixed(2))
        });

        
    }

    // console.log(finalFunds);
    // console.log("\n" + Date.now() - start);
    return finalFunds;
}

main(-1 ,"Corporate Bond Fund").then((res)=>{
    console.log(res)
});




// const finalFunds = await getMorningStar(subsector, [{
    //     name: 'Bandhan Banking & PSU Debt Fund',
    //     riskClassification: 'Moderate',
    //     aum: 13421.6413,
    //     cagr: 6.41,
    //     expenseRatio: 0.33,
    //     avgYTM: 7.34,
    //     volatility: 0.64
    //   },
    //   {
    //     name: 'Aditya Birla SL Banking & PSU Debt',
    //     riskClassification: 'Moderate',
    //     aum: 9477.6907,
    //     cagr: 6.61,
    //     expenseRatio: 0.39,
    //     avgYTM: 7.43,
    //     volatility: 0.72
    //   }]);


    // const finalFunds = await getMorningStar(subsector, [
    //     {
    //         name: 'Axis Corp Bond Fund',
    //         riskClassification: 'Moderate',
    //         aum: 6132.899501,
    //         cagr: 7.01,
    //         expenseRatio: 0.32,
    //         avgYTM: 7.39,
    //         volatility: 0.8,
    //       },
    //       {
    //         name: 'Edelweiss Nifty PSU Bond Plus SDL Apr 2026 50:50 Index Fund',
    //         riskClassification: 'Moderately Low',
    //         aum: 7847.9673,
    //         cagr: 5.84,
    //         expenseRatio: 0.2,
    //         avgYTM: 7.33,
    //         volatility: 0.46
    //       }
    // ]);