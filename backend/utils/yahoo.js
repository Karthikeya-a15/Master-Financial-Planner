import yahooFinance from 'yahoo-finance2';

yahooFinance.suppressNotices(["yahooSurvey"]);

const search = async (searchParam, type) => {
    try {
        const results = await yahooFinance.search(searchParam);
        const quotes = results.quotes;
        console.log(quotes);

        let ele = null;  

        if (type === "MUTUALFUND") {
            for(let i=0;i<quotes.length;i++){
                const quote = quotes[i];
                if(quote.quoteType === type && (quote.exchange === "NSI" || quote.exchange === "BSE")){
                    if(quote.longname?.includes("Dir Gr")){
                        ele = quote.symbol;
                    }
                }
            }
            if(ele === null){
                for(let i=0;i<quotes.length;i++){
                    const quote = quotes[i];
                    if(quote.quoteType === type && (quote.exchange === "NSI" || quote.exchange === "BSE")){
                         if(quote.shortname?.includes("Di")){
                            ele = quote.symbol;
                        }
                    }
                }
            }
            
        } else {
            ele = quotes.find(
                (quote) =>
                    quote.quoteType === type &&
                    (quote.exchange === "NSI" || quote.exchange === "BSE")
            )?.symbol || null;
        }

        return ele;
    } catch (e) {
        console.log("Error fetching search results:", e.message);
        return null; // Ensure function always returns something
    }
};

const fetchPrice = async (searchParam, type) => {
    try {
        const symbol = await search(searchParam, type);
        const result = await yahooFinance.quote(symbol);

        return {
            fullName : result.longName || result.shortName,
            price : result.regularMarketPrice
        }

    } catch (error) {
      console.warn(`Error fetching data for ${symbol}: ${error.message}`);
    }
  };


export default fetchPrice;