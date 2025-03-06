import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../layout/Navbar';
import { motion } from 'framer-motion';
import LoadingComponent from './LoadingComponent';

function rankByParameter(funds, parameter, isAscending = true) {
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
    
        if (currentFund[`${parameter}`] === previousFund[`${parameter}`]) {
            ranks[currentFund.name] = ranks[previousFund.name];
        } else {
            currentRank = i + 1;
            ranks[currentFund.name] = currentRank;
        }
    }
    
    return ranks;
}
    
function calculateWeightedScores(funds, weightage) {
    const expenseRatioRanks = rankByParameter(funds, 'expenseRatio', true);
    const rollingReturnsRanks = rankByParameter(funds, 'OneYearAvgRollingReturns', false);
    const aumRanks = rankByParameter(funds, 'AUM', false);
    const exitLoadRanks = rankByParameter(funds, 'exitLoad', true)

    const {expenseRatio, rollingReturns, aumRatio, exitLoadRatio} = weightage;
    // Calculate weighted scores
    const weightedScores = funds.map(fund => {
        const weightedScore = 
            expenseRatio * expenseRatioRanks[fund.name] +
            rollingReturns * rollingReturnsRanks[fund.name] +
            aumRatio * aumRanks[fund.name] + 
            exitLoadRatio * exitLoadRanks[fund.name]
            
        return {
            ...fund,
            weightedScore: Number(weightedScore.toFixed(2))
        };
    });
    
    // Sort by weighted score (lower is better)
    const sortedFunds = weightedScores.sort((a, b) => a.weightedScore - b.weightedScore);
    
    // Assign ranks handling ties
    const rankedFunds = [];
    let currentRank = 1;
    
    // Handle the first fund
    sortedFunds[0].rank = currentRank;
    rankedFunds.push(sortedFunds[0]);
    
    // Handle remaining funds
    for (let i = 1; i < sortedFunds.length; i++) {
        const currentFund = sortedFunds[i];
        currentRank = i + 1;
        currentFund.rank = currentRank;
        rankedFunds.push(currentFund);
    }
    
    return rankedFunds;
}


export default function ArbitrageFunds() {
    const [funds, setFunds] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weightage, setWeightage] = useState({
        expenseRatio: 0.40,
        rollingReturns: 0.30,
        exitLoadRatio : 0.10,
        aumRatio : 0.20
    });

    useEffect(() => {
        fetchFunds();
    }, []);

    const fetchFunds = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/tools/arbitrage');
            setFunds(response.data);
            await new Promise((res,rej)=>setTimeout(res,1500));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching arbitrage funds:', error);
            setError('Failed to load arbitrage funds data');
            setLoading(false);
            toast.error('Failed to load arbitrage funds data');
        }
    };

    const handleWeightageChange = (field, value) => {
        const newValue = parseFloat(value);
        if (isNaN(newValue)) return;
    
        setWeightage(prev => {
            const total = Object.entries(prev)
                .filter(([key]) => key !== field)
                .reduce((sum, [_, val]) => sum + val, 0);
    
            if (newValue + total > 1) return prev;
    
            return {
                ...prev,
                [field]: newValue
            };
        });
    };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSortedFunds = () => {
    return calculateWeightedScores(funds, weightage);
    };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
          <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <LoadingComponent />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button onClick={fetchFunds} className="mt-2 btn btn-danger">
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Arbitrage Funds Analysis</h1>
              <p className="mt-1 text-secondary-600">Find the best arbitrage funds for tax-efficient returns</p>
            </div>
            <Link to="/tools" className="btn btn-secondary">
              Back to Tools
            </Link>
          </div>

          <motion.div 
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Ranking Parameters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="form-label">Expense Ratio Weight</label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={weightage.expenseRatio}
                                    onChange={(e) => handleWeightageChange('expenseRatio', e.target.value)}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    value={weightage.expenseRatio}
                                    onChange={(e) => handleWeightageChange('expenseRatio', e.target.value)}
                                    className="ml-4 w-20 input text-right"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="form-label">Rolling Returns Weight</label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={weightage.rollingReturns}
                                    onChange={(e) => handleWeightageChange('rollingReturns', e.target.value)}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    value={weightage.rollingReturns}
                                    onChange={(e) => handleWeightageChange('rollingReturns', e.target.value)}
                                    className="ml-4 w-20 input text-right"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">AUM Weight</label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={weightage.aumRatio}
                                    onChange={(e) => handleWeightageChange('aumRatio', e.target.value)}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    value={weightage.aumRatio}
                                    onChange={(e) => handleWeightageChange('aumRatio', e.target.value)}
                                    className="ml-4 w-20 input text-right"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Exit Load Weight</label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={weightage.exitLoadRatio}
                                    onChange={(e) => handleWeightageChange('exitLoadRatio', e.target.value)}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    value={weightage.exitLoadRatio}
                                    onChange={(e) => handleWeightageChange('exitLoadRatio', e.target.value)}
                                    className="ml-4 w-20 input text-right"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>


          {/* Fund Table */}
            {funds && (
                <motion.div
                    className="card overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">{"Equity Saver Funds".replace(/([A-Z])/g, ' $1').trim()}</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Fund Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        AUM
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        CAGR 1Y
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Expense Ratio
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        1Y Rolling Returns
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Exit Load
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                                {getSortedFunds().map((fund) => (
                                    <tr key={fund.name} className="hover:bg-secondary-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                                            {fund.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                                            {fund.cagr}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {formatCurrency(fund.AUM)} Cr
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.expenseRatio}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.OneYearAvgRollingReturns}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.exitLoad}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-primary-600">
                                            #{fund.rank}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

          {/* Recommendations */}
          <motion.div
            className="card bg-primary-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-4">Investment Tips</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-secondary-900">Lower Expense Ratio</h3>
                  <p className="mt-1 text-secondary-600">Look for funds with lower expense ratios as they directly impact your returns. A difference of 0.5% can significantly affect long-term wealth creation.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-secondary-900">Exit Load</h3>
                  <p className="mt-1 text-secondary-600">Exit load is the fee charged when you redeem your investment before a specified period. Lower or zero exit load funds offer better liquidity and flexibility for investors.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-secondary-900">Rolling Returns</h3>
                  <p className="mt-1 text-secondary-600">Rolling returns measure a fund's performance over multiple time frames. It helps assess consistency by reducing the impact of short-term volatility and market fluctuations.</p>
                </div>
              </div>
              
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}