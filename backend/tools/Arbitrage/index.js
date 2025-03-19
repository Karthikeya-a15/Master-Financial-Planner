import getArbitrageFunds from "./advisorKhoj.js";

async function main(){
    const funds = await getArbitrageFunds();

    return funds;
}


export default main;
