import main from "./morningStar.js";

function rankByParameter(funds, parameter, isAscending = true) {
    const sortedFunds = [...funds].sort((a, b) => {
        return isAscending 
            ? a[parameter] - b[parameter]
            : b[parameter] - a[parameter];
    });

    const ranks = {};
    let currentRank = 1;

    ranks[sortedFunds[0].name] = currentRank;

    for (let i = 1; i < sortedFunds.length; i++) {
        const currentFund = sortedFunds[i];
        currentRank = i + 1;
        ranks[currentFund.name] = currentRank;
        
    }

    return ranks;
}

function calculateWeightedScores(funds){
    const cagrRanks = rankByParameter(funds, 'cagr', false);
    const volatilityRanks = rankByParameter(funds, 'volatility', true);
    const tenureRanks = rankByParameter(funds, 'fundManagerTenure', false);
    const expectedReturnsRanks = rankByParameter(funds, 'expectedReturns', false);

    const weightedScores = funds.map(fund => {
        const weightedScore = 
            0.10 * cagrRanks[fund.name] +
            0.40 * volatilityRanks[fund.name] +
            0.10 * tenureRanks[fund.name] +
            0.40 * expectedReturnsRanks[fund.name];
            
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

export default async function getFundRanks(expectedIntrestRateChange, subsector){
    const debtFunds = await main(expectedIntrestRateChange, subsector);
    const finalRankings = calculateWeightedScores(debtFunds);

    return finalRankings;
}

// getFundRanks(-1);