
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

function calculateWeightedScores(funds, weightage){
    const cagrRanks = rankByParameter(funds, 'cagr', false);
    const volatilityRanks = rankByParameter(funds, 'volatility', true);
    const tenureRanks = rankByParameter(funds, 'fundManagerTenure', false);
    const expectedReturnsRanks = rankByParameter(funds, 'expectedReturns', false);

    const {cagrRanksRatio, volatalityRankRatio, tenureRankRatio, sortinoRatio} = weightage;

    const weightedScores = funds.map(fund => {
        const weightedScore = 
            cagrRanksRatio * cagrRanks[fund.name] +
            volatalityRankRatio * volatilityRanks[fund.name] +
            tenureRankRatio * tenureRanks[fund.name] +
            sortinoRatio * expectedReturnsRanks[fund.name];
            
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

// const {cagrRanksRatio, volatalityRankRatio, tenureRankRatio, sortinoRatio, expectedInterestRateChange} = weightage;
// const expectedReturns = Number(customRound(modifiedDuration * -1 * expectedInterestRateChange + fund.avgYTM - fund.expenseRatio));
