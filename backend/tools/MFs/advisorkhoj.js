import  axios from 'axios';
import getACES  from './tickerTape.js';


function getCategory(category){
  const lastIndex = category.indexOf("Fund") == -1? category.length : category.indexOf("Fund");
  category = category.substring(0,lastIndex)
  category = `Equity: ${category}`
  return category;
}

async function getRollingReturns(fullNamesArray, Category = "Equity: Mid Cap") {
  const allResults = [];
  
    try {
      // Join fund names with comma for the API request
      const schemesString = fullNamesArray.join(',');

      const response = await axios.post(
        "https://www.advisorkhoj.com/mutual-funds-research/getRollingReturns",
        new URLSearchParams({
          schemes: schemesString,
          category: getCategory(Category),
          start_date: "01-01-2020",
          period: "5 Year"
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }
      );

      let fullData = response.data;
      //{name,data : [objects]}

      for (let i = 0; i < fullData.length; i++) {
        const currFundName = fullData[i][0].scheme_company
        if (currFundName != undefined) {
          allResults.push({
            name: fullData[i][0].scheme_company,
            data: fullData[i],

          });

        }

      }
      
      return allResults;
      
    } catch (error) {
      console.error('Error in fetchData:', error.message);
    }
}
const fetchMutualFundNames = async (firstNames, Category = "Equity: Mid Cap") => {
  const fullNamesArray = [];

  try {
    const promises = firstNames.map(firstName =>
      axios.post(
        "https://www.advisorkhoj.com/mutual-funds-research/autoSuggestAllMfSchemesShortNames",
        new URLSearchParams({
          query: firstName,
          category: getCategory(Category)
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

// async function getSchemeStartAndEndDate(funds) {
//   const fiveYearCheck = []

//   try {
//     const promises = funds.map(fund =>
//       axios.post(
//         "https://www.advisorkhoj.com/mutual-funds-research/getSchemeStartAndEndDate",
//         new URLSearchParams({
//           scheme_name: fund.name
//         }),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
//           }
//         }
//       )
//     );

//     responses.forEach((response, index) => {
//       const dateArray = response.data;

//       if (Date.parse(dateArray[0]) >= Date.parse("2025-01-01")) {
//         fiveYearCheck.push(funds[index]);
//       }
//     });

//     return fiveYearCheck;
//   } catch (e) {
//     console.error("Error fetching mutual fund names:", e);
//   }

// }

async function getBestFunds(schemeNo, Category) {
  //get aum total, cagr, expense ratio prefilled funds
  const filteredFunds = await getACES(schemeNo, Category);

  const firstNames = []
  //find first names
  for (let i = 0; i < filteredFunds.length; i++) {
    const lastIndex = filteredFunds[i].name.indexOf(' ');
    const currentFundName = filteredFunds[i].name.substring(0, lastIndex);
    firstNames.push(currentFundName);
  }

  //construct full names (advisor khoj full names)
  const fullNamesArray = await fetchMutualFundNames(firstNames,Category);

  //check scheme start & end date
  // const fiveYearCheck = await getSchemeStartAndEndDate(fullNamesArray);

  //legitfunds having 5 yr average rolling returns , > 15% probability
  const legitFunds = await getRollingReturns(fullNamesArray,Category);


  const totalFunds = calculateRollingReturnsAndProbability(filteredFunds, legitFunds);

  // console.log(totalFunds);
  return totalFunds
}


function calculateRollingReturnsAndProbability(acesFunds, advisorkhojfunds) {
  // Create a set of concise names from the `funds` array for quick lookup
  const conciseFundNames = new Set(advisorkhojfunds.map(fund => fund.name.substring(0, fund.name.indexOf(' '))));


  for (let i = 0; i < acesFunds.length; i++) {
    const currentACESfund = acesFunds[i];
    //conciseName for current ACES fund / filtered ex: Aditya
    const concisedName = currentACESfund.name.substring(0, currentACESfund.name.indexOf(' '));


    if (conciseFundNames.has(concisedName)) {

      const matchingFund = advisorkhojfunds.find(fund => fund.name.substring(0, fund.name.indexOf(' ')) === concisedName);


      let greaterThan15Prob = 0;
      let avgRollingReturns = 0;
      for (let j = 0; j < matchingFund.data.length; j++) {
        if (matchingFund.data[j].scheme_rolling_returns >= 15) greaterThan15Prob += 1;
        avgRollingReturns += matchingFund.data[j].scheme_rolling_returns;
      }
      avgRollingReturns = (avgRollingReturns / matchingFund.data.length).toFixed(2);
      greaterThan15Prob = ((greaterThan15Prob * 1.0 / matchingFund.data.length) * 100).toFixed(1);


      currentACESfund.FiveYearAvgRollingReturns = Number(avgRollingReturns);
      currentACESfund.GreaterThan15Probability = Number(greaterThan15Prob);
    } else {
      // If no matching fund is found, mark the ACM fund for deletion
      currentACESfund.markForDeletion = true;
    }
  }

  // Filter out ACM funds that are marked for deletion
  const UpdatedFunds = acesFunds.filter(fund => !fund.markForDeletion);

  // Return the updated `acesFunds` array
  // console.log(UpdatedFunds);
  const nameChangedFunds = UpdatedFunds.map((fund) => {
    return {
      ...fund,
      name : fund.name.substring(0, fund.name.indexOf("Fund"))
    }
  })

  return nameChangedFunds
}

// getBestFunds(5, "Small Cap Fund")

export default getBestFunds;
