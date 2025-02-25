import axios from "axios";
import getRupeeVestFunds from "./rupeeVest.js";

async function getRollingReturns(fullNamesArray) {
    const allResults = [];
  
  
      try {
        // Join fund names with comma for the API request
        const schemesString = fullNamesArray.join(',');
  
        const response = await axios.post(
          "https://www.advisorkhoj.com/mutual-funds-research/getRollingReturns",
          new URLSearchParams({
            schemes: schemesString,
            category: "Hybrid: Arbitrage",
            start_date: "01-01-2020",
            period: "1 Year"
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
          }
        );
  
        let fullData = response.data;
  
        for (let i = 0; i < fullData.length; i++) {
          const currFundName = fullData[i][0].scheme_company
          if (currFundName != undefined) {
            allResults.push({
              name: fullData[i][0].scheme_company,
              data: fullData[i],
  
            });
  
          }
  
        }
  
      } catch (error) {
        console.error('Error in fetchData:', error.message);
      }

  
    return allResults;
  }

const fetchMutualFundNames = async (firstNames) => {
    const fullNamesArray = [];
  
    try {
      const promises = firstNames.map(firstName =>
        axios.post("https://www.advisorkhoj.com/mutual-funds-research/autoSuggestAllMfSchemesShortNames",
          new URLSearchParams({
            query: firstName,
            category : "Hybrid: Arbitrage"
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
          }
        )
      );
  
      const responses = await Promise.all(promises);
  
      responses.forEach(response => {
        const namesArray = response.data;
  
        if (namesArray.length > 0) {
          const selectedName = namesArray.find(name => name.includes('Dir Gr')) || namesArray[1] || namesArray[0];
  
          if (selectedName) {
            fullNamesArray.push(selectedName);
          }
        }
  
  
      });
  
      return fullNamesArray;
  
    } catch (e) {
      console.error("Error fetching mutual fund names:", e);
    }
  }


function calculateRollingReturns(rupeeVestFunds, advisorkhojfunds) {
    // Create a set of concise names from the `funds` array for quick lookup
    const conciseFundNames = new Set(advisorkhojfunds.map(fund => fund.name.substring(0, fund.name.indexOf(' '))));
  
  
    for (let i = 0; i < rupeeVestFunds.length; i++) {
      const currentFund = rupeeVestFunds[i];
      //conciseName for current ACES fund / filtered ex: Aditya
      const concisedName = currentFund.name.substring(0, currentFund.name.indexOf(' '));
  
  
      if (conciseFundNames.has(concisedName)) {
  
        const matchingFund = advisorkhojfunds.find(fund => fund.name.substring(0, fund.name.indexOf(' ')) === concisedName);
  
        let avgRollingReturns = 0;
        for (let j = 0; j < matchingFund.data.length; j++) {
          avgRollingReturns += matchingFund.data[j].scheme_rolling_returns;
        }
        avgRollingReturns = (avgRollingReturns / matchingFund.data.length).toFixed(2);
  
  
        currentFund.OneYearAvgRollingReturns = Number(avgRollingReturns);
      } else {
        // If no matching fund is found, mark the ACM fund for deletion
        currentFund.markForDeletion = true;
      }
    }
  
    // Filter out ACM funds that are marked for deletion
    const UpdatedFunds = rupeeVestFunds.filter(fund => !fund.markForDeletion);
 
    return UpdatedFunds;
  }
  

export default async function getArbitrageFunds(){
    const filteredFunds = await getRupeeVestFunds();

    //find first names
    const firstNames = []
    for (let i = 0; i < filteredFunds.length; i++) {
        const lastIndex = filteredFunds[i].name.indexOf(' ');
        const currentFundName = filteredFunds[i].name.substring(0, lastIndex);
        firstNames.push(currentFundName);
    }

    //construct full names (advisor khoj full names)
    const fullNamesArray = await fetchMutualFundNames(firstNames);

    //legitfunds having 5 yr average rolling returns , > 15% probability
    const legitFunds = await getRollingReturns(fullNamesArray);

    const totalFunds = calculateRollingReturns(filteredFunds, legitFunds);

    return totalFunds;
}

// getArbitrageFunds()