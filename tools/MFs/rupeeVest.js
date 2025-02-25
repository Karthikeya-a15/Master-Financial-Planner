const axios = require('axios');
async function getFunds(schemeNo){
    const response = await axios.post("https://www.rupeevest.com/functionalities/asset_class_section",{
        "selected_schemes":[schemeNo],"selected_rating":[1,2,3,4,5,"Unrated"],"selected_amc":["all"],"selected_manager":["all"],"selected_index":["all"],"selected_fund_type":[1],"selected_from_date":0,"selected_to_date":0,"condn_type":"asset"
        },{
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded",
            "User-Agent" : "PostmanRuntime/7.43.0"
        }
    })

    return response.data.schemedata;
}

async function getACS(schemeNo){
    const funds = await getFunds(schemeNo);

   const filteredFunds = [];

   for(let i=0; i<funds.length ;i++){
        const currentFund = funds[i];

        if(currentFund.aumtotal >= 1000 && currentFund.aumtotal <= 10000 && currentFund.returns_5year != null){
            filteredFunds.push({
                name : currentFund.s_name1,
                AUM : currentFund.aumtotal,
                FiveYearCAGR : currentFund.returns_5year,
                SortinoRatio : currentFund.sotinox_returns
            })
        }
   }

   return filteredFunds;
}

module.exports = { getACS };