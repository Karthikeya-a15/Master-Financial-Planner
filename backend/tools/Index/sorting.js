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


function calculateWeightedScores(funds, expenseRatio, trackingError) {

    const expenseRatioRanks = rankByParameter(funds, 'expRatio', true);
    const trackingErrorRanks = rankByParameter(funds, 'trackErr', true);
   
    
    // Calculate weighted scores
    const weightedScores = funds.map(fund => {
        const weightedScore = 
            expenseRatio * expenseRatioRanks[fund.name] +
            trackingError * trackingErrorRanks[fund.name]
        return {
            ...fund,
            name: fund.name,
            weightedScore: Number(weightedScore.toFixed(2))
        };
    });
    
    // Sort by weighted score (lower is better)
    const sortedFunds = weightedScores.sort((a, b) => a.weightedScore - b.weightedScore);
    
    const rankedFunds = sortedFunds.map((fund,index)=>{
        return {
            ...fund,
            rank : index+1
        }
        
    })
    
    return rankedFunds;
}

// const { expenseRatio, trackingError} = weightage;