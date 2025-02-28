import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardData } from '../../api/netWorth';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const NetWorthDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        toast.error(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const calculateTotalAssets = (data) => {
    if (!data) return 0;
    
    const { illiquid, liquid } = data;
    let total = 0;
    
    // Sum up illiquid assets
    if (illiquid) {
      total += illiquid.home || 0;
      total += illiquid.otherRealEstate || 0;
      total += illiquid.jewellery || 0;
      total += illiquid.sgb || 0;
      total += illiquid.ulips || 0;
      total += illiquid.governmentInvestments || 0;
    }
    
    // Sum up liquid assets
    if (liquid) {
      total += liquid.fixedDeposit || 0;
      total += liquid.debtFunds || 0;
      total += liquid.domesticStockMarket || 0;
      total += liquid.domesticEquityMutualFunds || 0;
      total += liquid.usEquity || 0;
      total += liquid.smallCase || 0;
      total += liquid.liquidFunds || 0;
      total += liquid.liquidGold || 0;
      total += liquid.crypto || 0;
      total += liquid.reits || 0;
    }
    
    return total;
  };
  
  const calculateTotalLiabilities = (data) => {
    if (!data || !data.Liabilities) return 0;
    
    const { homeLoan, educationLoan, carLoan, personalLoan, creditCard, other } = data.Liabilities;
    return (homeLoan || 0) + (educationLoan || 0) + (carLoan || 0) + (personalLoan || 0) + (creditCard || 0) + (other || 0);
  };
  
  const prepareAssetAllocationData = (data) => {
    if (!data || !data.totalAssetSummary) return null;
    
    const { realEstate, domesticEquity, usEquity, debt, gold, crypto } = data.totalAssetSummary;
    
    return {
      labels: ['Real Estate', 'Domestic Equity', 'US Equity', 'Debt', 'Gold', 'Crypto'],
      datasets: [
        {
          data: [realEstate, domesticEquity, usEquity, debt, gold, crypto],
          backgroundColor: [
            '#4F46E5', // Indigo
            '#10B981', // Emerald
            '#3B82F6', // Blue
            '#F59E0B', // Amber
            '#FBBF24', // Yellow
            '#EC4899', // Pink
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const prepareRequiredAssetAllocationData = (data) => {
    if (!data || !data.requiredInvestableAssetAllocation) return null;
    
    const { realEstate, domesticEquity, usEquity, debt, gold, crypto } = data.requiredInvestableAssetAllocation;
    
    return {
      labels: ['Real Estate', 'Domestic Equity', 'US Equity', 'Debt', 'Gold', 'Crypto'],
      datasets: [
        {
          data: [realEstate, domesticEquity, usEquity, debt, gold, crypto],
          backgroundColor: [
            '#4F46E5', // Indigo
            '#10B981', // Emerald
            '#3B82F6', // Blue
            '#F59E0B', // Amber
            '#FBBF24', // Yellow
            '#EC4899', // Pink
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-lg font-medium text-red-800">Error Loading Dashboard</h2>
        <p className="mt-2 text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  const totalAssets = calculateTotalAssets(dashboardData);
  const totalLiabilities = calculateTotalLiabilities(dashboardData);
  const netWorth = totalAssets - totalLiabilities;
  
  const currentAssetAllocationData = prepareAssetAllocationData(dashboardData);
  const requiredAssetAllocationData = prepareRequiredAssetAllocationData(dashboardData);
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-500">Total Assets</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(totalAssets)}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-500">Total Liabilities</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(totalLiabilities)}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-500">Net Worth</h2>
          <p className={`mt-2 text-3xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netWorth)}
          </p>
        </div>
      </div>
      
      {/* Asset Allocation Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Current Asset Allocation</h2>
          <div className="h-64">
            {currentAssetAllocationData ? (
              <Doughnut data={currentAssetAllocationData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No asset allocation data available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Required Asset Allocation</h2>
          <div className="h-64">
            {requiredAssetAllocationData ? (
              <Doughnut data={requiredAssetAllocationData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No required asset allocation data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Asset Classes */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Asset Classes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Asset Class</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Current Value</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">% of Total</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData && dashboardData.totalAssetSummary && (
                <>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Real Estate</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.totalAssetSummary.realEstate)}</td>
                    <td className="px-4 py-3">
                      {((dashboardData.totalAssetSummary.realEstate / totalAssets) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/real-estate" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Domestic Equity</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.totalAssetSummary.domesticEquity)}</td>
                    <td className="px-4 py-3">
                      {((dashboardData.totalAssetSummary.domesticEquity / totalAssets) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/domestic-equity" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">US Equity</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.totalAssetSummary.usEquity)}</td>
                    <td className="px-4 py-3">
                      {((dashboardData.totalAssetSummary.usEquity / totalAssets) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/foreign-equity" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Debt</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.totalAssetSummary.debt)}</td>
                    <td className="px-4 py-3">
                      {((dashboardData.totalAssetSummary.debt / totalAssets) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/debt" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Gold</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.totalAssetSummary.gold)}</td>
                    <td className="px-4 py-3">
                      {((dashboardData.totalAssetSummary.gold / totalAssets) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/gold" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Cryptocurrency</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.totalAssetSummary.crypto)}</td>
                    <td className="px-4 py-3">
                      {((dashboardData.totalAssetSummary.crypto / totalAssets) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/crypto" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Liabilities */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Liabilities</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Liability Type</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">% of Total</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData && dashboardData.Liabilities && (
                <>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Home Loan</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.Liabilities.homeLoan || 0)}</td>
                    <td className="px-4 py-3">
                      {totalLiabilities ? (((dashboardData.Liabilities.homeLoan || 0) / totalLiabilities) * 100).toFixed(2) : 0}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/liabilities" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Education Loan</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.Liabilities.educationLoan || 0)}</td>
                    <td className="px-4 py-3">
                      {totalLiabilities ? (((dashboardData.Liabilities.educationLoan || 0) / totalLiabilities) * 100).toFixed(2) : 0}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/liabilities" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Car Loan</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.Liabilities.carLoan || 0)}</td>
                    <td className="px-4 py-3">
                      {totalLiabilities ? (((dashboardData.Liabilities.carLoan || 0) / totalLiabilities) * 100).toFixed(2) : 0}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/liabilities" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Personal Loan</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.Liabilities.personalLoan || 0)}</td>
                    <td className="px-4 py-3">
                      {totalLiabilities ? (((dashboardData.Liabilities.personalLoan || 0) / totalLiabilities) * 100).toFixed(2) : 0}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/liabilities" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Credit Card</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.Liabilities.creditCard || 0)}</td>
                    <td className="px-4 py-3">
                      {totalLiabilities ? (((dashboardData.Liabilities.creditCard || 0) / totalLiabilities) * 100).toFixed(2) : 0}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/liabilities" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                  
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Other</td>
                    <td className="px-4 py-3">{formatCurrency(dashboardData.Liabilities.other || 0)}</td>
                    <td className="px-4 py-3">
                      {totalLiabilities ? (((dashboardData.Liabilities.other || 0) / totalLiabilities) * 100).toFixed(2) : 0}%
                    </td>
                    <td className="px-4 py-3">
                      <Link to="/financial-planner/liabilities" className="text-primary-600 hover:text-primary-800">
                        Edit
                      </Link>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Quick Links</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link to="/financial-planner/cash-flows" className="p-4 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
            <h3 className="font-medium text-gray-800">Cash Flows</h3>
            <p className="mt-1 text-sm text-gray-600">Manage your income and expenses</p>
          </Link>
          
          <Link to="/financial-planner/returns-and-assets-mix" className="p-4 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
            <h3 className="font-medium text-gray-800">Returns & Assets Mix</h3>
            <p className="mt-1 text-sm text-gray-600">Set your investment assumptions</p>
          </Link>
          
          <Link to="/financial-planner/financial-goals" className="p-4 transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
            <h3 className="font-medium text-gray-800">Financial Goals</h3>
            <p className="mt-1 text-sm text-gray-600">Track and manage your financial goals</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NetWorthDashboard;