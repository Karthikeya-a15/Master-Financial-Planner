import axios from "axios";

async function getFunds(subsector ) {
    const response = await axios.post("https://api.tickertape.in/mf-screener/query",{
        "match":{"subsector":[`${subsector}`],"option":["Growth"],"aum":{"g":4000,"l":94252}},"sortBy":"aum","sortOrder":-1,"project":["subsector","option","aum","ret3y","expRatio","ytm","stdDevAnn","riskClassification"],"offset":0,"count":20,"mfIds":[]
    });

    const data = response.data.data.result;

    return data;
}

const riskOrder = {
    "low": 1,
    "moderate": 2,
    "moderately low": 3,
    "moderately high": 4,
    "high": 5,
    "very high": 6
  };
  
const sortByRiskClassification = (array) => {
    return array.sort((a, b) => {
        const riskA = (a.values.find(v => v.filter === "riskClassification")?.strVal || "").toLowerCase();
        const riskB = (b.values.find(v => v.filter === "riskClassification")?.strVal || "").toLowerCase();

        return (riskOrder[riskA] || 0) - (riskOrder[riskB] || 0);
    });
};


function customRound(num) {
    const factor = 100; // To keep 2 decimal places
    const thirdDecimal = Math.floor(num * 1000) % 10; // Extract the 3rd decimal place

    if (thirdDecimal > 5) {
        return ((Math.floor(num * factor) + 1) / factor).toFixed(2);
    } else {
        return (Math.floor(num * factor) / factor).toFixed(2);
    }
}

export default async function getTickerTapeFunds(subsector){ //put subsector here
    const totalFunds = await getFunds(subsector);

    const sortedFunds = sortByRiskClassification(totalFunds);

    const finalFunds = sortedFunds.map((fund) => {
        const filters = ["riskClassification", "aum", "ret3y", "expRatio", "ytm", "stdDevAnn"];
        const extractedValues = Object.fromEntries(
            filters.map((filter) => [filter, fund.values.find((v) => v.filter === filter)])
        );
    
        return {
            name : fund.name,
            riskClassification: extractedValues.riskClassification?.strVal || null,
            aum: extractedValues.aum?.doubleVal || 0,
            cagr: Number(customRound(extractedValues.ret3y?.doubleVal)) || 0,
            expenseRatio: extractedValues.expRatio?.doubleVal || 0,
            avgYTM: extractedValues.ytm?.doubleVal || 0,
            volatility: Number(customRound(extractedValues.stdDevAnn?.doubleVal)) || 0,
        };
    });
    

    return finalFunds;

}

// getTickerTapeFunds("Corporate Bond Fund").then((r)=>console.log(r));

