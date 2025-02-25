import getFundRanks from "./sortByParams.js";

async function DebtFunds(expectedInterestRateChange) {
    const start = Date.now();
    const subsectors = ["Banking & PSU Fund","Corporate Bond Fund"];

    // Create an array of promises
    const rankingPromises = subsectors.map(subsector => getFundRanks(expectedInterestRateChange, subsector));

    // Wait for all promises to resolve
    const finalRankings = await Promise.all(rankingPromises);

    console.log("Final Ranking of Banking & PSU Debt Funds")
    console.log(finalRankings[0]);
    
    console.log("Final Ranking of Corporate Debt Funds")
    console.log(finalRankings[1]);// Now contains resolved values
    console.log(Date.now() - start);
}

DebtFunds(-1);