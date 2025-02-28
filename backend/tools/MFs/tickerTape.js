import  getACS   from './rupeeVest.js';
import  axios from 'axios';

async function getFunds(Category="Mid Cap Fund") {
    try {
        const response = await axios.post("https://api.tickertape.in/mf-screener/query", {
            "match": {
                "option": ["Growth"],
                "subsector": [Category],
                "aum": { "g": 1000, "l": 10000 }
            },
            "sortBy": "aum",
            "sortOrder": -1,
            "project": ["subsector", "option", "aum", "ret5y", "expRatio"],
            "offset": 0,
            "count": 30,
            "mfIds": [],
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        return response.data.data.result;
    } catch (error) {
        console.error('Error fetching funds:', error.message);
        throw error;
    }
}
function getFundName(fname, c1="Mid Cap", c2="Midcap"){
    const Cap = fname.indexOf(c1);
    const cap = fname.indexOf(c2);

    let cutOff;
    if(Cap != -1){
        cutOff = Cap;
    }else if(cap != -1){
        cutOff = cap;
    }else{
        cutOff = fname.length;
    }

    return fname.substring(0,cutOff);

}
function getExpenseRatio(filteredFunds, allFunds, category) {
    
    const lastIndex = category.indexOf("Fund") == -1? category.length : category.indexOf("Fund");
    category = category.substring(0,lastIndex)


    const category1 = category;
    const category2 = category.split(" ")[0]+"cap";

    return filteredFunds.map(filteredFund => {
        const fundName = getFundName(filteredFund.name,category1,category2);
        const matchingFund = allFunds.find(fund => getFundName(fund.name,category1,category2) === fundName);

        if (matchingFund) {
            const expRatioFilter = matchingFund.values.find(filter => filter.filter === "expRatio");
            if (expRatioFilter) {
                filteredFund["expenseRatio"] = expRatioFilter.doubleVal;
            }
        }
        return filteredFund;
    });
}

async function getACES(schemeNo, Category) {
    try {
        const tickerTapeFunds = await getFunds(Category);
        const ACSfunds = await getACS(schemeNo);
        const updatedFunds = getExpenseRatio(ACSfunds, tickerTapeFunds, Category);
        // console.log(updatedFunds);
        return updatedFunds;
    } catch (error) {
        console.error('Error in fetchData:', error.message);
    }
}

// Only execute if running directly (not being required/imported)

// getACES();

export default getACES;