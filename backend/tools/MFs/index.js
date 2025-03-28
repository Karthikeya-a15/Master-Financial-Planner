import  getRankOfFunds from './mutualFunds.js';

const schemeNo = [1,3,50,4,5]
const category = ["Large Cap Fund", "Multi Cap Fund", "Flexi Cap Fund" , "Mid Cap Fund" , "Small Cap Fund"]
// const schemeNo = [1]
// const category = ["Large Cap Fund"]
async function main(){
    const results = []
    for(let i=0; i<schemeNo.length; i++){
        results.push(getRankOfFunds(schemeNo[i], category[i]));
    }

    const responses = await Promise.allSettled(results);
    let funds = {};
    responses.forEach((response, index) => {
        if(response.status === 'fulfilled'){
            funds[category[index].replaceAll(" ","")] = response.value;
            // console.log(response);
        }else{
            console.log(`Failed to fetch ${category[index]} data`);
        }
    });
    return funds;
    // responses.forEach((finalRankingType, index)=>{
    //         console.log(`\nFinal Rankings of ${category[index]}(s) (Name - Weighted Score - Rank):`);
    //         finalRankingType.forEach(fund => {
    //         console.log(`${fund.name} - ${fund.weightedScore} - ${fund.rank}`);
    //     });
    // })
    
    // console.log(`\n ${Date.now() - start}`)
}

export default main;
