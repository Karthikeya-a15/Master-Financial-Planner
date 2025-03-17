import axios from "axios";

async function getFunds(){
    const response = await axios.post("https://www.rupeevest.com/functionalities/asset_class_section",{
            "selected_schemes": [38],
            "selected_rating": [1, 2, 3, 4, 5, "Unrated"],
            "selected_amc": ["all"],
            "selected_manager": ["all"],
            "selected_index": ["all"],
            "selected_fund_type": [1],
            "selected_from_date": 0,
            "selected_to_date": 0,
            "condn_type": "asset"
          
    },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded",
            "User-Agent" : "PostmanRuntime/7.43.0"
        }
    })

    return response.data.schemedata;
}

async function getExpenseRatio(){
    const response = await axios.post("https://api.tickertape.in/mf-screener/query",{
        "match":{"subsector":["Arbitrage Fund"],"option":["Growth"]},"sortBy":"aum","sortOrder":-1,"project":["subsector","option","aum","expRatio"],"offset":0,"count":50,"mfIds":[]
    },{
        headers : {
            "Content-Type" : "application/json",
            "User-Agent" : "PostmanRuntime/7.43.0"
        }
    })

    return response.data.data.result;
}

export default async function getRupeeVestFunds(){
    const funds = await getFunds();

    let filteredFunds = [];

    for(let i=0; i<funds.length ;i++){
            const currentFund = funds[i];
            const year = new Date(currentFund.inception_date).getUTCFullYear();
            if(currentFund.aumtotal >= 500 && currentFund.aumtotal <= 10000 && year < 2020){
                filteredFunds.push({
                    name : currentFund.s_name1,
                    AUM : currentFund.aumtotal,
                    cagr : currentFund.returns_1year,
                    inception_date : currentFund.inception_date,
                    exitLoad : currentFund.exitload
                })
            }
    }

   filteredFunds = filteredFunds.sort((a,b)=>{
        return b.cagr - a.cagr;
   })

   const tickerTapeFunds = await getExpenseRatio();

   const finalFunds = filteredFunds.map((fund)=>{

    const directFund = tickerTapeFunds.find((t) => {
        const index = fund.name.indexOf("Arbitrage");
        if (index !== -1) {
            return t.name.includes(fund.name.substring(0, index));
        }
        return false; 
    });
    
        const expenseRatio = directFund.values.find((v) => v.filter === "expRatio").doubleVal;
        return {
            ...fund,
            name : directFund.name,
            expenseRatio
        }

    });

    // console.log(finalFunds);

   return finalFunds;
}
