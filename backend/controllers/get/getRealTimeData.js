import DomesticEquity from "../../models/DomesticEquity.js";
import User from "../../models/User.js";
import fetchPrice from "../../utils/yahoo.js";

async function fetchWithRetry(stockName, type, retries = 3, delay = 2000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fetchPrice(stockName, type); 
        } catch (error) {
            if (attempt < retries) {
                console.warn(`Retrying ${stockName} (${attempt + 1}/${retries}) after ${delay / 1000} sec`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error(`Failed to fetch ${stockName} after ${retries} retries`, error);
                return null; 
            }
        }
    }
}

async function getData(equity, types) {
    let data = {};

    const stockNames = equity.directStocks.map(stock => `${stock.stockName}`);
    
    const mfNames = equity.mutualFunds.map(fund => `${fund.fundName}`);

    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (type === "EQUITY") {
            // for (let j = 0; j < stockNames.length; j++) {
            //     const res = await fetchWithRetry(stockNames[j], type); // Fetch with retry logic
            //     if (res) {
            //         data[type] = data[type] || [];
            //         data[type].push(res);
            //     }
            // }
            continue;
        }
        else{
            for (let j = 0; j < mfNames.length; j++) {
                const res = await fetchWithRetry(mfNames[j], type); // Fetch with retry logic
                if (res) {
                    data[type] = data[type] || [];
                    data[type].push(res);
                }
            }
        }
    }
    
    return data;
}


export default async function getRealTimeDataController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        const userDomesticEquity = await DomesticEquity.findById(user.netWorth.domesticEquity).select('-_id -__v');
        console.log(userDomesticEquity.mutualFunds)
        const realTimeData = await getData(userDomesticEquity, ["EQUITY", "MUTUALFUND"])

        if(realTimeData)
            return res.json({realTimeData});
        else 
            return res.json({message : "Error while Fetching Domestic Equity "});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}