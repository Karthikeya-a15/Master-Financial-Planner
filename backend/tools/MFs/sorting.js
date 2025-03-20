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
        const previousFund = sortedFunds[i - 1];

        if (currentFund[`${parameter}`] === previousFund[`${parameter}`]) {
            // If values are equal, assign the same rank
            ranks[currentFund.name] = ranks[previousFund.name];
        } else {
            // If values are different, assign the next rank
            currentRank = i + 1;
            ranks[currentFund.name] = currentRank;
        }
    }

    return ranks;
}


// Function to calculate weighted scores and final ranking
function calculateWeightedScores(funds,weightage) {
    // Get individual rankings
    //Updated Field Names
    const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
    const rollingReturnsRanks = rankByParameter(funds, 'FiveYearAvgRollingReturns', false);
    const sortinoRatioRanks = rankByParameter(funds, 'SortinoRatio', false);
    const greaterThan15Ranks = rankByParameter(funds, 'GreaterThan15Probability', false);
    
    // Calculate weighted scores
    const weightedScores = funds.map(fund => {
        const weightedScore = 
            weightage.expenseRatio * expenseRatioRanks[fund.name] +
            weightage.rollingReturn * rollingReturnsRanks[fund.name] +
            weightage.greaterThan15 * greaterThan15Ranks[fund.name] +
            weightage.sortinoRatio * sortinoRatioRanks[fund.name];
            
        return {
            ...fund,
            name: fund.name,
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
// const {expenseRatio, rollingReturn, greaterThan15, sortinoRatio} = weightage;
