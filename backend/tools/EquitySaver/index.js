import getEquitySaverFunds from "./advisorKhoj.js";

export default async function main(){
    const funds = await getEquitySaverFunds();
    
    // const sortedEquitySaverFunds = calculateWeightedScores(funds,weightage);

    return funds;

}

// main().then((res)=>console.log(res))