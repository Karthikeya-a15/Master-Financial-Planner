import axios from 'axios';

async function getFunds(){
    const response = await axios.post("https://api.tickertape.in/mf-screener/query",{
            "match":{"subsector":["Index Fund"],"option":["Growth"],"aum":{"g":500,"l":95387}},"sortBy":"aum","sortOrder":-1,"project":["subsector","option","aum","expRatio","trackErr"],"offset":0,"count": 60,"mfIds":[]
        },{
            headers : {
                "Content-Type" : "application/json"
            }
        });

    return response.data.data.result;
}


async function  getIndexFunds(){
    const funds = await getFunds();

    const filteredFunds = funds.map((currentFund) => {
        const constructFund = {}

        constructFund.name = currentFund.name;

        for(let i=0;i<currentFund.values.length;i++){
            const filterObj = currentFund.values[i];

            if(filterObj.filter === "aum" || filterObj.filter === "expRatio" || filterObj.filter === "trackErr"){
                let newFilter = filterObj.filter;
                constructFund[`${newFilter}`] = filterObj.doubleVal;
            }
        }
        if(constructFund.aum >= 500)
            return constructFund;

        return undefined;
    })

    return filteredFunds;

}

export default getIndexFunds;