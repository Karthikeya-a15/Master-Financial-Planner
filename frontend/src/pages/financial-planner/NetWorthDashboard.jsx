import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function NetWorthDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation();

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

  //User makes changes and comes back to dashboard
  useEffect(() => {
    document.title = 'Net Worth Dashboard | DarwInvest'
    fetchDashboardData()
  }, [location.pathname])
  
  //User makes changes and switchs tabs to see the changes
  useEffect(() => {
    document.title = 'Net Worth Dashboard | DarwInvest'
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData()
      }
    }
  
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
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
              <p className="text-3xl font-bold text-secondary-900 text-green-900">{formatCurrency(totalAssets)}</p>
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

          <AssetsNavBar/>

          
          {/* Asset Allocation */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Asset Allocation</h2>
            
              <div>
                {AssetTable({data, totalAssets, formatCurrency})}
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {CurrentAssetTable({data, formatCurrency})}
              
              {RequiredAssetTable({data, formatCurrency})}
              
            </div>
          </motion.div>

          <hr className="w-full border-t border-gray-300 my-10" />
          
          {/* Asset Details */}
            {AssetDetails({data, formatCurrency, totalIlliquid, totalLiquid, totalLiabilities})}
        </div>
      </main>
    </div>
  )
}

const AssetsNavBar = ()=>{
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  const navigation = [
    { name: 'Net Worth', href: '/financial-planner/net-worth' },
    { name: 'Cashflows', href: '/'},
    { name: 'Real Estate', href: '/' },
    { name: 'Assumptions', href: '/financial-planner/assumptions' },
  ]
  return (
    <>
                <div className="flex p-4 bg-slate-100">
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {navigation.map((item) => (
                           <Link
                           key={item.name}
                           to={item.href}
                           className={classNames(
                             location.pathname === item.href 
                               ? 'border-primary-500 text-secondary-900' 
                               : 'border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700',
                             'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                           )}
                           aria-current={location.pathname === item.href ? 'page' : undefined}
                         >
                           {item.name}
                         </Link>
                        ))}
                      </div>
                    </div>
    </>
  )
}

const AssetTable = ({ data, totalAssets, formatCurrency }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">Total Asset Summary</h3>
      <table className="w-2/3 border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Particular(s)</th>
            <th className="border border-gray-300 px-4 py-2">Current Value</th>
            <th className="border border-gray-300 px-4 py-2">Contribution (%)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.totalAssetSummary).map(([key, value]) => {
            let percentage = ((value / totalAssets) * 100).toFixed(1);
            const decimalPart = Number(percentage.split(".")[1]);
            percentage = decimalPart < 5 ? Math.floor(percentage) : Math.ceil(percentage);
            
            return (
              <tr key={key} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-700">{formatCurrency(value)}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-700">{percentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr className="w-2/3 border-t border-gray-300 my-10" />
    </div>
  );
};

const formatLabel = (key) => key.replace(/([A-Z])/g, " $1").trim().replace(/^./, str => str.toUpperCase());

const COLORS = {
  realEstate: "#2563EB", // primary-600
  domesticEquity: "#16A34A", // success-600
  usEquity: "#F59E0B", // warning-600
  debt: "#64748B", // secondary-600
  gold: "#EAB308", // yellow-500
  crypto: "#7C3AED", // purple-600
  default: "#2563EB"
};

const CurrentAssetTable = ({ data, formatCurrency }) => {
  const chartData = Object.entries(data.totalAssetSummary).map(([key, value]) => {
    let finalValue = value;
    if (key === "realEstate") {
      finalValue -= data.illiquid.home;
    } else if (key === "gold") {
      finalValue -= data.illiquid.jewellery;
    }
    let percentage = ((finalValue / data.currentInvestibleAssets) * 100).toFixed(1);
    const decimalPart = Number(percentage.split(".")[1]);
    percentage = decimalPart < 5 ? Math.floor(percentage) : Math.ceil(percentage);
    return { name: formatLabel(key), value: finalValue, percentage: Number(percentage), color: COLORS[key] || COLORS.default };
  });

  return (
    <div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">Current Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      

      
      <table className="w-full border-collapse border border-gray-300 mt-4 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Particular(s)</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map(({ name, value }) => (
            <tr key={name} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{name}</td>
              <td className="border border-gray-300 px-4 py-2 text-green-700">{formatCurrency(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const RequiredAssetTable = ({ data, formatCurrency }) => {
  const totalRecommended = Object.values(data.requiredInvestableAssetAllocation).reduce((sum, val) => sum + val, 0);
  const chartData = Object.entries(data.requiredInvestableAssetAllocation).map(([key, value]) => {
    let percentage = ((value / totalRecommended) * 100).toFixed(1);
    const decimalPart = Number(percentage.split(".")[1]);
    percentage = decimalPart < 5 ? Math.floor(percentage) : Math.ceil(percentage);
    return { name: formatLabel(key), value, percentage: Number(percentage), color: COLORS[key] || COLORS.default };
  });

  return (
    <div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">Recommended Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <table className="w-full border-collapse border border-gray-300 mt-4 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Particular(s)</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map(({ name, value }) => (
            <tr key={name} className="border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{name}</td>
              <td className="border border-gray-300 px-4 py-2 text-green-700">{formatCurrency(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const AssetDetails = ({data, formatCurrency, totalIlliquid, totalLiquid, totalLiabilities}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
    </>
  )
}