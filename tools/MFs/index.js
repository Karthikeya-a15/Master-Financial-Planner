const { getRankOfFunds } = require('./mutualFunds')

const schemeNo = [1,3,50,4,5]
const category = ["Large Cap Fund", "Multi Cap Fund", "Flexi Cap Fund" , "Mid Cap Fund" , "Small Cap Fund"]
async function main(){
    const start = Date.now()
    const results = []
    for(let i=0; i<schemeNo.length; i++){
        results.push(getRankOfFunds(schemeNo[i], category[i]));
    }

    const responses = await Promise.all(results);

    responses.forEach((finalRankingType, index)=>{
            console.log(`\nFinal Rankings of ${category[index]}(s) (Name - Weighted Score - Rank):`);
            finalRankingType.forEach(fund => {
            console.log(`${fund.name} - ${fund.weightedScore} - ${fund.rank}`);
        });
    })

    console.log(`\n ${Date.now() - start}`)
}
main();