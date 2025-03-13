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

function calculateWeightedScores(funds, weightage) {
    const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
    const rollingReturnsRanks = rankByParameter(funds, 'FiveYearAvgRollingReturns', false);
    const probabilityRanks = rankByParameter(funds, 'GreaterThan12Probability', false);
    const sortinoRanks = rankByParameter(funds, 'sortinoRatio', true)

    const {expenseRatio, rollingReturns, probabilityRatio, sortinoRatio} = weightage;
    // Calculate weighted scores
    const weightedScores = funds.map(fund => {
        const weightedScore = 
            expenseRatio * expenseRatioRanks[fund.name] +
            rollingReturns * rollingReturnsRanks[fund.name] +
            probabilityRatio * probabilityRanks[fund.name] + 
            sortinoRatio * sortinoRanks[fund.name]
            // 0.30 0.25 0.05 0.40
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

const {expenseRatio, rollingReturns, probabilityRatio, sortinoRatio} = weightage;
