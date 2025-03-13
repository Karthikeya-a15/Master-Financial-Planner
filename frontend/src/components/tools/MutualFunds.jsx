import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../layout/Navbar';
import { motion } from 'framer-motion';
import LoadingComponent from './LoadingComponent';

// Function to rank funds by a specific parameter
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

// Function to calculate weighted scores and final ranking
function calculateWeightedScores(funds, weightage) {
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
        name: fund.name,
        weightedScore: Number(weightedScore.toFixed(2))
    };
});

const sortedFunds = weightedScores.sort((a, b) => a.weightedScore - b.weightedScore);
const rankedFunds = [];
let currentRank = 1;

sortedFunds[0].rank = currentRank;
rankedFunds.push(sortedFunds[0]);

for (let i = 1; i < sortedFunds.length; i++) {
    const currentFund = sortedFunds[i];
    currentRank = i + 1;
    currentFund.rank = currentRank;
    rankedFunds.push(currentFund);
}

return rankedFunds;
}

export default function MutualFunds() {
const [funds, setFunds] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedCategory, setSelectedCategory] = useState('');
const [weightage, setWeightage] = useState({
    expenseRatio: 0.25,
    rollingReturn: 0.15,
    greaterThan15: 0.35,
    sortinoRatio: 0.25
});

useEffect(() => {
    fetchFunds();
}, []);

const fetchFunds = async () => {
    try {
        setLoading(true);
        const response = await axios.get('/api/v1/tools/mutualfunds');
        setFunds(response.data.funds);
        await new Promise((res,rej)=>setTimeout(res,1500));
        setLoading(false);
    } catch (error) {
        console.error('Error fetching mutual funds:', error);
        setError('Failed to load mutual funds data');
        setLoading(false);
        toast.error('Failed to load mutual funds data');
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

const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const getSortedFunds = () => {
    if (!selectedCategory || !funds[selectedCategory]) return [];
    return calculateWeightedScores(funds[selectedCategory], weightage);
};

if (loading) {
    return (
        <div className="bg-secondary-50">
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
                    <h1 className="text-2xl font-bold text-secondary-900">Mutual Funds Analysis</h1>
                    <p className="mt-1 text-secondary-600">Compare and analyze mutual funds across categories</p>
                </div>
                <Link to="/tools" className="btn btn-secondary">
                    Back to Tools
                </Link>
            </div>

                {/* Category Dropdown */}
                <motion.div 
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Select Mutual Fund Category</h2>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="w-full p-2 border border-secondary-200 rounded-lg"
                    >
                        <option value="">Select a category</option>
                        {Object.keys(funds).map(category => (
                            <option key={category} value={category}>
                                {category.replace(/([A-Z])/g, ' $1').trim()}
                            </option>
                        ))}
                    </select>
                </motion.div>

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
                            <label className="form-label">Rolling Returns Weight</label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={weightage.rollingReturn}
                                    onChange={(e) => handleWeightageChange('rollingReturn', e.target.value)}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    value={weightage.rollingReturn}
                                    onChange={(e) => handleWeightageChange('rollingReturn', e.target.value)}
                                    className="ml-4 w-20 input text-right"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Greater Than 15% Returns Weight</label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={weightage.greaterThan15}
                                    onChange={(e) => handleWeightageChange('greaterThan15', e.target.value)}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    value={weightage.greaterThan15}
                                    onChange={(e) => handleWeightageChange('greaterThan15', e.target.value)}
                                    className="ml-4 w-20 input text-right"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Sortino Ratio Weight</label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={weightage.sortinoRatio}
                                    onChange={(e) => handleWeightageChange('sortinoRatio', e.target.value)}
                                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="number"
                                    value={weightage.sortinoRatio}
                                    onChange={(e) => handleWeightageChange('sortinoRatio', e.target.value)}
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
            {selectedCategory && (
                <motion.div
                    className="card overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">{selectedCategory.replace(/([A-Z])/g, ' $1').trim()}</h2>
                    
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
                                        CAGR 5Y
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Expense Ratio
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        5Y Rolling Returns
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Greater than 15% Probability
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Sortino Ratio
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {formatCurrency(fund.AUM)} Cr
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.FiveYearCAGR}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.expenseRatio}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.FiveYearAvgRollingReturns}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.GreaterThan15Probability}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                                            {fund.SortinoRatio}
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
        </div>
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
                <h3 className="text-md font-medium text-secondary-900">Rolling Returns</h3>
                <p className="mt-1 text-secondary-600">Focus on rolling returns rather than point-to-point returns as they provide a better picture of fund performance across market cycles.</p>
            </div>
            </div>
            
            <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <h3 className="text-md font-medium text-secondary-900">Consistency</h3>
                <p className="mt-1 text-secondary-600">Look for funds with higher probability of delivering above 15% returns, as it indicates consistency in performance.</p>
            </div>
            </div>
            
            <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
                <h3 className="text-md font-medium text-secondary-900">Risk-Adjusted Returns</h3>
                <p className="mt-1 text-secondary-600">Consider the Sortino ratio as it measures risk-adjusted returns, focusing on harmful volatility that can impact your investment goals.</p>
            </div>
            </div>
        </div>
        </motion.div>
    </main>
    </div>
)
}