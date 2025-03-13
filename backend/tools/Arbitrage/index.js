import getArbitrageFunds from "./advisorKhoj.js";

async function main(weightage){
    const funds = await getArbitrageFunds();

    return funds;
}


export default main;
