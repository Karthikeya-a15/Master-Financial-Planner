import  getBestFunds  from "./advisorkhoj.js";

async function getRankOfFunds(schemeNo, Category){
    const funds = await getBestFunds(schemeNo, Category);
    
    // Calculate and display the final rankings
    // const finalRankings = calculateWeightedScores(funds,weightage);
    // console.log('\nFinal Rankings (Name - Weighted Score - Rank):');
    // finalRankings.forEach(fund => {
    //     console.log(fund);
    // });

    return funds;
}
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

export default getRankOfFunds;