import main from "./morningStar.js";
async function DebtFunds() {
    const subsectors = ["Banking & PSU Fund","Corporate Bond Fund"];

    // Create an array of promises
    const rankingPromises = subsectors.map(subsector => main(subsector));

    // Wait for all promises to resolve
    const finalRankings = await Promise.all(rankingPromises);

    // console.log("Final Ranking of Banking & PSU Debt Funds")
    // console.log(finalRankings[0].slice(0,10));

    // console.log("Final Ranking of Corporate Debt Funds")
    // console.log(finalRankings[1].slice(0,10));
    // console.log(Date.now() - start);

    return {"BankingAndPSU": finalRankings[0].slice(0,10),
        "CorporateBonds" : finalRankings[1].slice(0,10)
    };
}

export default DebtFunds;