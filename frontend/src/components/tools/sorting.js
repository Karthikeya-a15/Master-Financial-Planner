// Utility function for ranking by parameter
export function rankByParameter(funds, parameter, isAscending = true) {
    const sortedFunds = [...funds].sort((a, b) => {
      return isAscending 
        ? a[parameter] - b[parameter]
        : b[parameter] - a[parameter];
    });
  
    const ranks = {};
    let currentRank = 1;
  
    ranks[sortedFunds[0].name] = currentRank;
  
    for (let i = 1; i < sortedFunds.length; i++) {
      const currentFund = sortedFunds[i];
      const previousFund = sortedFunds[i - 1];
  
      if (currentFund[parameter] === previousFund[parameter]) {
        ranks[currentFund.name] = ranks[previousFund.name];
      } else {
        currentRank = i + 1;
        ranks[currentFund.name] = currentRank;
      }
    }
  
    return ranks;
}

// Mutual Funds sorting
export function sortMutualFunds(funds, weightage) {
  const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
  const rollingReturnsRanks = rankByParameter(funds, 'FiveYearAvgRollingReturns', false);
  const sortinoRatioRanks = rankByParameter(funds, 'SortinoRatio', false);
  const greaterThan15Ranks = rankByParameter(funds, 'GreaterThan15Probability', false);
  
  const weightedScores = funds.map(fund => {
    const weightedScore = 
      weightage.expenseRatio * expenseRatioRanks[fund.name] +
      weightage.rollingReturn * rollingReturnsRanks[fund.name] +
      weightage.greaterThan15 * greaterThan15Ranks[fund.name] +
      weightage.sortinoRatio * sortinoRatioRanks[fund.name];
        
    return {
      ...fund,
      weightedScore: Number(weightedScore.toFixed(2))
    };
  });
  
  return weightedScores.sort((a, b) => a.weightedScore - b.weightedScore)
    .map((fund, index) => ({
      ...fund,
      rank: index + 1
    }));
}

// Debt Funds sorting
export function sortDebtFunds(funds, weightage) {
  const cagrRanks = rankByParameter(funds, 'cagr', false);
  const volatilityRanks = rankByParameter(funds, 'volatility', true);
  const tenureRanks = rankByParameter(funds, 'managerTenure', false);
  const expectedReturnsRanks = rankByParameter(funds, 'expectedReturns', false);

  const weightedScores = funds.map(fund => {
    const weightedScore = 
      weightage.cagrRanksRatio * cagrRanks[fund.name] +
      weightage.volatalityRankRatio * volatilityRanks[fund.name] +
      weightage.tenureRankRatio * tenureRanks[fund.name] +
      weightage.sortinoRatio * expectedReturnsRanks[fund.name];
        
    return {
      ...fund,
      weightedScore: Number(weightedScore.toFixed(2))
    };
  });

  return weightedScores.sort((a, b) => a.weightedScore - b.weightedScore)
    .map((fund, index) => ({
      ...fund,
      rank: index + 1
    }));
}

// Arbitrage Funds sorting
export function sortArbitrageFunds(funds, weightage) {
  const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
  const rollingReturnsRanks = rankByParameter(funds, 'OneYearAvgRollingReturns', false);
  const aumRanks = rankByParameter(funds, 'AUM', false);
  const exitLoadRanks = rankByParameter(funds, 'exitLoad', true);

  const weightedScores = funds.map(fund => {
    const weightedScore = 
      weightage.expenseRatio * expenseRatioRanks[fund.name] +
      weightage.rollingReturns * rollingReturnsRanks[fund.name] +
      weightage.aumRatio * aumRanks[fund.name] + 
      weightage.exitLoadRatio * exitLoadRanks[fund.name];
        
    return {
      ...fund,
      weightedScore: Number(weightedScore.toFixed(2))
    };
  });

  return weightedScores.sort((a, b) => a.weightedScore - b.weightedScore)
    .map((fund, index) => ({
      ...fund,
      rank: index + 1
    }));
}

// Equity Saver Funds sorting
export function sortEquitySaverFunds(funds, weightage) {
  const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
  const rollingReturnsRanks = rankByParameter(funds, 'FiveYearAvgRollingReturns', false);
  const probabilityRanks = rankByParameter(funds, 'GreaterThan12Probability', false);
  const sortinoRanks = rankByParameter(funds, 'sortinoRatio', false);

  const weightedScores = funds.map(fund => {
    const weightedScore = 
      weightage.expenseRatio * expenseRatioRanks[fund.name] +
      weightage.rollingReturns * rollingReturnsRanks[fund.name] +
      weightage.probabilityRatio * probabilityRanks[fund.name] + 
      weightage.sortinoRatio * sortinoRanks[fund.name];
        
    return {
      ...fund,
      weightedScore: Number(weightedScore.toFixed(2))
    };
  });

  return weightedScores.sort((a, b) => a.weightedScore - b.weightedScore)
    .map((fund, index) => ({
      ...fund,
      rank: index + 1
    }));
}