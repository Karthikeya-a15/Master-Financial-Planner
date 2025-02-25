const { getBestFunds } = require("./advisorkhoj");

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
function calculateWeightedScores(funds) {
    // Get individual rankings
    //Updated Field Names
    const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
    const rollingReturnsRanks = rankByParameter(funds, 'FiveYearAvgRollingReturns', false);
    const sortinoRatioRanks = rankByParameter(funds, 'SortinoRatio', false);
    const greaterThan15Ranks = rankByParameter(funds, 'GreaterThan15Probability', false);
    
    // Calculate weighted scores
    const weightedScores = funds.map(fund => {
        const weightedScore = 
            0.15 * expenseRatioRanks[fund.name] +
            0.25 * rollingReturnsRanks[fund.name] +
            0.25 * greaterThan15Ranks[fund.name] +
            0.35 * sortinoRatioRanks[fund.name];
            
        return {
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

async function getRankOfFunds(schemeNo, Category){
    const start = Date.now();
    const funds = await getBestFunds(schemeNo, Category);
    
    // Calculate and display the final rankings
    const finalRankings = calculateWeightedScores(funds);
    // console.log('\nFinal Rankings (Name - Weighted Score - Rank):');
    // finalRankings.forEach(fund => {
    //     console.log(`${fund.name} - ${fund.weightedScore} - ${fund.rank}`);
    // });

    return finalRankings;
    
    // Display individual parameter rankings for verification
    // console.log('\nIndividual Parameter Rankings:');
    // console.log('\nExpense Ratio Rankings (lower is better):');
    // console.log(rankByParameter(funds, 'expenseRatio', true));
    
    // console.log('\nRolling Returns Rankings (higher is better):');
    // console.log(rankByParameter(funds, 'FiveYearAvgRollingReturns', false));
    
    // console.log('\nSortino Ratio Rankings (higher is better):');
    // console.log(rankByParameter(funds, 'SortinoRatio', false));
    
    // console.log('\nGreater Than 15% Probability Rankings (higher is better):');
    // console.log(rankByParameter(funds, 'GreaterThan15Probability', false));

    // console.log(Date.now() - start);
}

module.exports = { getRankOfFunds };