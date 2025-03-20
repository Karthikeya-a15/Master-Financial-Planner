import getIndexFunds from "./tickerTape.js"



async function getFinalIndexFunds(){
    const funds = await getIndexFunds();
    
    // Calculate and display the final rankings
    // const finalRankings = calculateWeightedScores(funds, expenseRatio, trackingError);
    // console.log('\nFinal Rankings (Name - Weighted Score - Rank):');
    // finalRankings.forEach(fund => {
    //     console.log(`${fund.name} - ${fund.weightedScore} - ${fund.rank}`);
    // });
    // console.log(`\nBest Index Funds To Invest : \n`);
    
    // const nifty50 = finalRankings.find((fund) => fund.name.indexOf('Nifty 50') != -1)
    // const niftyNext50 = finalRankings.find((fund) => fund.name.indexOf('Nifty Next 50') != -1)

    
    // return {finalRankings, nifty50, niftyNext50};

    return funds;
    
}

// getFinalIndexFunds().then((data) => {console.log(data)})
export default getFinalIndexFunds;