import getArbitrageFunds from "./advisorKhoj.js";

function rankByParameter(funds, parameter, isAscending = true) {
    const sortedFunds = [...funds].sort((a, b) => {
        return isAscending 
            ? a[parameter] - b[parameter]
            : b[parameter] - a[parameter];
    });

    const ranks = {};
    let currentRank = 1;

    // Assign rank to the first fund
    ranks[sortedFunds[0].name] = currentRank;

    for (let i = 1; i < sortedFunds.length; i++) {
            const currentFund = sortedFunds[i];
            currentRank = i + 1;
            ranks[currentFund.name] = currentRank;
        }
    

    return ranks;
}

// Function to calculate weighted scores and final ranking
function calculateWeightedScores(funds) {
    const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
    const rollingReturnsRanks = rankByParameter(funds, 'OneYearAvgRollingReturns', false);
    const aumRanks = rankByParameter(funds, 'AUM', false);
    const exitLoadRanks = rankByParameter(funds, 'exitLoad', true)

    
    // Calculate weighted scores
    const weightedScores = funds.map(fund => {
        const weightedScore = 
            0.25 * expenseRatioRanks[fund.name] +
            0.40 * rollingReturnsRanks[fund.name] +
            0.25 * aumRanks[fund.name] + 
            0.10 * exitLoadRanks[fund.name]
            
        return {
            ...fund,
            weightedScore: Number(weightedScore.toFixed(2))
        };
    });
    
    // Sort by weighted score (lower is better)
    const sortedFunds = weightedScores.sort((a, b) => a.weightedScore - b.weightedScore);
    
    // Assign ranks handling ties
    const rankedFunds = [];
    let currentRank = 1;
    
    // Handle the first fund
    sortedFunds[0].rank = currentRank;
    rankedFunds.push(sortedFunds[0]);
    
    // Handle remaining funds
    for (let i = 1; i < sortedFunds.length; i++) {
        const currentFund = sortedFunds[i];
        currentRank = i + 1;
        currentFund.rank = currentRank;
        rankedFunds.push(currentFund);
    }
    
    return rankedFunds;
}



async function main(){
    const funds = await getArbitrageFunds();
    
    const sortedArbitrageFunds = calculateWeightedScores(funds);

    return sortedArbitrageFunds;

}

main().then((res)=>console.log(res))