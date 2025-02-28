const sipAmountDistribution = [

    {
  
      "domesticEquity": 0,
  
      "usEquity": 0,
  
      "debt": 0,
  
      "gold": 0,
  
      "crypto": 0,
  
      "realEstate": 0
  
    },
  
    {
  
      "domesticEquity": 0,
  
      "usEquity": 0,
  
      "debt": 5000,
  
      "gold": 0,
  
      "crypto": 0,
  
      "realEstate": 0
  
    },
  
    {
  
      "domesticEquity": 0,
  
      "usEquity": 0,
  
      "debt": 4000,
  
      "gold": 0,
  
      "crypto": 0,
  
      "realEstate": 0
  
    },
  
    {
  
      "domesticEquity": 6000,
  
      "usEquity": 1000,
  
      "debt": 1500,
  
      "gold": 500,
  
      "crypto": 500,
  
      "realEstate": 500
  
    },
  
    {
  
      "domesticEquity": 2400,
  
      "usEquity": 0,
  
      "debt": 3000,
  
      "gold": 600,
  
      "crypto": 0,
  
      "realEstate": 0
  
    },
  
    {
  
      "domesticEquity": 2000,
  
      "usEquity": 0,
  
      "debt": 2500,
  
      "gold": 500,
  
      "crypto": 0,
  
      "realEstate": 0
  
    }
  
  ]
  
 
function sumOfSip(sipAssetAllocation){
    let sumValues = {
        domesticEquity : 0,
        usEquity : 0,
        debt : 0,
        gold : 0,
        crypto : 0,
        realEstate : 0,
    }

    for(let goal in sipAssetAllocation){
        for(let asset in sipAssetAllocation[goal]){
            sumValues[asset] += sipAssetAllocation[goal][asset];
        }
    }
    return sumValues;
}

console.log(sumOfSip(sipAmountDistribution));