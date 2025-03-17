import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../layout/Navbar';
import { motion } from 'framer-motion';
import LoadingComponent from './LoadingComponent';

function rankByParameter(funds, parameter, ascending = true) {
    const sorted = [...funds].sort((a, b) => ascending ? a[parameter] - b[parameter] : b[parameter] - a[parameter]);
    return sorted.reduce((acc, fund, index) => {
        acc[fund.name] = index + 1;
        return acc;
    }, {});
}

function sortIndex(funds, expenseRatio, trackingError) {
    const expenseRatioRanks = rankByParameter(funds, 'expRatio', true);
    const trackingErrorRanks = rankByParameter(funds, 'trackErr', true);

    return funds.map(fund => ({
        ...fund,
        weightedScore: Number(
            (expenseRatio * expenseRatioRanks[fund.name] +
            trackingError * trackingErrorRanks[fund.name]).toFixed(2)
        )
    })).sort((a, b) => a.weightedScore - b.weightedScore)
    .map((fund, index) => ({ ...fund, rank: index + 1 }));
}


export default function IndexFunds() {
  const [funds, setFunds] = useState([]);
  const [sortedFunds, setSortedFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weightage, setWeightage] = useState({
    expenseRatio: 0.6,
    trackingError: 0.4
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  useEffect(() => {
    if (funds.length > 0) {
      setSortedFunds(sortIndex(funds, weightage.expenseRatio, weightage.trackingError));
    }
  }, [funds, weightage]);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/tools/indexfunds');
      setFunds(response.data.funds);
      await new Promise((res,rej)=>setTimeout(res,2000));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching index funds:', error);
      setError('Failed to load index funds data');
      setLoading(false);
      toast.error('Failed to load index funds data');
    }
  };

  const handleWeightageChange = (field, value) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue)) return;

    setWeightage(prev => {
      const other = field === 'expenseRatio' ? 'trackingError' : 'expenseRatio';
      return {
        [field]: newValue,
        [other]: parseFloat((1 - newValue).toFixed(2))
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

    const topNifty50 = sortedFunds.find(fund => fund.name.includes("Nifty 50"));
    const topNiftyNext50 = sortedFunds.find(fund => fund.name.includes("Nifty Next 50"));

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
              <h1 className="text-2xl font-bold text-secondary-900">Index Funds Analysis</h1>
              <p className="mt-1 text-secondary-600">Compare and analyze index funds based on key metrics</p>
            </div>
            <Link to="/tools" className="btn btn-secondary">
              Back to Tools
            </Link>
          </div>

          {/* Weightage Controls */}
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
                <label className="form-label">Tracking Error Weight</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weightage.trackingError}
                    onChange={(e) => handleWeightageChange('trackingError', e.target.value)}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={weightage.trackingError}
                    onChange={(e) => handleWeightageChange('trackingError', e.target.value)}
                    className="ml-4 w-20 input text-right"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {topNifty50 && topNiftyNext50 && (
          <div className="mt-6 p-4 bg-blue-100 border-l-4 border-yellow-500">
            <h2 className="text-lg font-bold">Top Funds</h2>
            <p><strong>Nifty 50:</strong> {topNifty50.name} (Rank #{topNifty50.rank})</p>
            <p><strong>Nifty Next 50:</strong> {topNiftyNext50.name} (Rank #{topNiftyNext50.rank})</p>
          </div>
        )}

          {/* Funds Table */}
          <motion.div
            className="card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
                      Expense Ratio
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Tracking Error
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Rank
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {sortedFunds.map((fund) => (
                    <tr key={fund.name} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        {fund.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                        {formatCurrency(fund.aum)} Cr
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                        {fund.expRatio.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                        {fund.trackErr.toFixed(2)}%
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
                  <h3 className="text-md font-medium text-secondary-900">Tracking Error</h3>
                  <p className="mt-1 text-secondary-600">A lower tracking error indicates better index replication. Consider funds with tracking errors below 0.5% for better index-matching performance.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-secondary-900">Fund Size</h3>
                  <p className="mt-1 text-secondary-600">Consider funds with larger AUM for better liquidity and lower impact cost. However, extremely large funds may face challenges in efficient management.</p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}