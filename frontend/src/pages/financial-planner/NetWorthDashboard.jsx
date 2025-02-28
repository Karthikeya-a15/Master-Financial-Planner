import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'

export default function NetWorthDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Net Worth Dashboard | Darw-Invest'
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/networth/dashboard')
      setDashboardData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again later.')
      setLoading(false)
      toast.error('Failed to load dashboard data')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Mock data for development
  const mockData = {
    illiquid: {
      home: 5000000,
      otherRealEstate: 2000000,
      jewellery: 1000000,
      sgb: 500000,
      ulips: 300000,
      governmentInvestments: 200000
    },
    liquid: {
      fixedDeposit: 1000000,
      debtFunds: 500000,
      domesticStockMarket: 1500000,
      domesticEquityMutualFunds: 1000000,
      usEquity: 800000,
      smallCase: 200000,
      liquidFunds: 300000,
      liquidGold: 400000,
      crypto: 100000,
      reits: 300000
    },
    Liabilities: {
      homeLoan: 2000000,
      educationLoan: 500000,
      carLoan: 300000,
      personalLoan: 0,
      creditCard: 50000,
      other: 0
    },
    totalAssetSummary: {
      realEstate: 7300000,
      domesticEquity: 3000000,
      usEquity: 800000,
      debt: 2000000,
      gold: 1900000,
      crypto: 100000
    },
    currentInvestibleAssets: 15100000,
    requiredInvestableAssetAllocation: {
      debt: 1200000,
      domesticEquity: 2500000,
      usEquity: 600000,
      gold: 400000,
      crypto: 200000,
      realEstate: 300000
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 btn btn-danger"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Use mock data for development
  const data = dashboardData || mockData

  // Calculate total assets and net worth
  const totalIlliquid = Object.values(data.illiquid).reduce((sum, value) => sum + value, 0)
  const totalLiquid = Object.values(data.liquid).reduce((sum, value) => sum + value, 0)
  const totalAssets = totalIlliquid + totalLiquid
  const totalLiabilities = Object.values(data.Liabilities).reduce((sum, value) => sum + value, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Net Worth Dashboard</h1>
              <p className="mt-1 text-secondary-600">Track and manage your complete financial picture</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/financial-planner/goals" className="btn btn-secondary">
                View Goals
              </Link>
              <Link to="/financial-planner/assumptions" className="btn btn-primary">
                View Assumptions
              </Link>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-2">Net Worth</h2>
              <p className="text-3xl font-bold">{formatCurrency(netWorth)}</p>
              <div className="mt-4 text-primary-100">
                <div className="flex justify-between">
                  <span>Total Assets</span>
                  <span>{formatCurrency(totalAssets)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Total Liabilities</span>
                  <span>- {formatCurrency(totalLiabilities)}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">Assets</h2>
              <p className="text-3xl font-bold text-secondary-900">{formatCurrency(totalAssets)}</p>
              <div className="mt-4 text-secondary-600">
                <div className="flex justify-between">
                  <span>Liquid Assets</span>
                  <span className="font-medium">{formatCurrency(totalLiquid)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Illiquid Assets</span>
                  <span className="font-medium">{formatCurrency(totalIlliquid)}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">Liabilities</h2>
              <p className="text-3xl font-bold text-danger-600">{formatCurrency(totalLiabilities)}</p>
              <div className="mt-4 text-secondary-600">
                <div className="flex justify-between">
                  <span>Home Loan</span>
                  <span className="font-medium">{formatCurrency(data.Liabilities.homeLoan)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Other Loans</span>
                  <span className="font-medium">{formatCurrency(totalLiabilities - data.Liabilities.homeLoan)}</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Asset Allocation */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Asset Allocation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current Allocation</h3>
                <div className="space-y-4">
                  {Object.entries(data.totalAssetSummary).map(([key, value]) => {
                    const percentage = (value / totalAssets * 100).toFixed(1)
                    let color
                    
                    switch(key) {
                      case 'realEstate':
                        color = 'bg-primary-600'
                        break
                      case 'domesticEquity':
                        color = 'bg-success-600'
                        break
                      case 'usEquity':
                        color = 'bg-warning-600'
                        break
                      case 'debt':
                        color = 'bg-secondary-600'
                        break
                      case 'gold':
                        color = 'bg-yellow-500'
                        break
                      case 'crypto':
                        color = 'bg-purple-600'
                        break
                      default:
                        color = 'bg-primary-600'
                    }
                    
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-secondary-900 font-medium">{formatCurrency(value)} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recommended Allocation</h3>
                <div className="space-y-4">
                  {Object.entries(data.requiredInvestableAssetAllocation).map(([key, value]) => {
                    const totalRecommended = Object.values(data.requiredInvestableAssetAllocation).reduce((sum, val) => sum + val, 0)
                    const percentage = (value / totalRecommended * 100).toFixed(1)
                    let color
                    
                    switch(key) {
                      case 'realEstate':
                        color = 'bg-primary-600'
                        break
                      case 'domesticEquity':
                        color = 'bg-success-600'
                        break
                      case 'usEquity':
                        color = 'bg-warning-600'
                        break
                      case 'debt':
                        color = 'bg-secondary-600'
                        break
                      case 'gold':
                        color = 'bg-yellow-500'
                        break
                      case 'crypto':
                        color = 'bg-purple-600'
                        break
                      default:
                        color = 'bg-primary-600'
                    }
                    
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-secondary-900 font-medium">{formatCurrency(value)} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Asset Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Liquid Assets */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-secondary-900">Liquid Assets</h2>
                <span className="text-lg font-semibold text-secondary-900">{formatCurrency(totalLiquid)}</span>
              </div>
              
              <div className="space-y-3">
                {Object.entries(data.liquid).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-secondary-100 last:border-0">
                    <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Link to="#" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Edit Liquid Assets →
                </Link>
              </div>
            </motion.div>
            
            {/* Illiquid Assets */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-secondary-900">Illiquid Assets</h2>
                <span className="text-lg font-semibold text-secondary-900">{formatCurrency(totalIlliquid)}</span>
              </div>
              
              <div className="space-y-3">
                {Object.entries(data.illiquid).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-secondary-100 last:border-0">
                    <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Link to="#" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Edit Illiquid Assets →
                </Link>
              </div>
            </motion.div>
            
            {/* Liabilities */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-secondary-900">Liabilities</h2>
                <span className="text-lg font-semibold text-danger-600">{formatCurrency(totalLiabilities)}</span>
              </div>
              
              <div className="space-y-3">
                {Object.entries(data.Liabilities).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-secondary-100 last:border-0">
                    <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Link to="#" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Edit Liabilities →
                </Link>
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="#" className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-secondary-900">Add Asset</h3>
                      <p className="text-sm text-secondary-500">Record a new investment</p>
                    </div>
                  </div>
                </Link>
                
                <Link to="#" className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-secondary-900">Update Values</h3>
                      <p className="text-sm text-secondary-500">Refresh asset prices</p>
                    </div>
                  </div>
                </Link>
                
                <Link to="#" className="p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center text-success-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-secondary-900">Download Report</h3>
                      <p className="text-sm text-secondary-500">Export as PDF</p>
                    </div>
                  </div>
                </Link>
                
                <Link to="/financial-planner/goals" className="p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-secondary-900">View Goals</h3>
                      <p className="text-sm text-secondary-500">Track your progress</p>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}