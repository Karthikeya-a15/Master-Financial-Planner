import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'
import Networth from './assets/Networth'
import CashFlows from './assets/Cashflows'
import RealEstate from './assets/RealEstate'
import ForeignEquity from './assets/ForeignEquity'
import Gold from './assets/Gold'
import Cryptocurrency from './assets/Cryptocurrency'
import Miscellaneous from './assets/Miscellaneous'
import Liabilities from './assets/Liabilities'
import DomesticEquity from './assets/DomesticEquity'
import Debt from './assets/Debt'


export default function NetWorthDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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
  }, [location.pathname, refreshTrigger])

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

  const refreshData = () => {
    setRefreshTrigger(prev => !prev); // Toggle to trigger re-fetch
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  };

  const data = dashboardData || { illiquid: {}, liquid: {}, Liabilities: {} }

  const totalIlliquid = useMemo(() =>
    Object.values(data.illiquid).reduce((sum, value) => sum + value, 0),
    [data]
  );

  const totalLiquid = useMemo(() =>
    Object.values(data.liquid).reduce((sum, value) => sum + value, 0),
    [data]
  );

  const totalAssets = useMemo(() => totalIlliquid + totalLiquid, [totalIlliquid, totalLiquid]);

  const totalLiabilities = useMemo(() =>
    Object.values(data.Liabilities).reduce((sum, value) => sum + value, 0),
    [data]
  );

  const netWorth = useMemo(() => totalAssets - totalLiabilities, [totalAssets, totalLiabilities]);

  const navigation = [
    {
      name: "Net Worth", component: <Networth
        data={data}
        totalIlliquid={totalIlliquid}
        totalLiquid={totalLiquid}
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        formatCurrency={formatCurrency}
      />
    },
    { name: "Cashflows", component: <CashFlows formatCurrency={formatCurrency} refreshData={refreshData}/>},
    { name: "Real Estate", component: <RealEstate formatCurrency = {formatCurrency} refreshData={refreshData}/> },
    {name : "Domestic Equity", component : <DomesticEquity formatCurrency = {formatCurrency} refreshData={refreshData} />},
    { name: "US Equity", component: <ForeignEquity formatCurrency = {formatCurrency} refreshData={refreshData}/> },
    { name: "Debt", component: <Debt formatCurrency = {formatCurrency} refreshData={refreshData}/> },
    { name: "Gold", component: <Gold formatCurrency = {formatCurrency} refreshData={refreshData}/> },
    { name: "Crypto", component: <Cryptocurrency formatCurrency = {formatCurrency} refreshData={refreshData}/> },
    { name: "Miscellaneous" , component : <Miscellaneous formatCurrency = {formatCurrency} refreshData={refreshData}/>},
    {name : "Liabilities" , component : <Liabilities formatCurrency = {formatCurrency} refreshData={refreshData}/>}
  ];

  const [activeItem, setActiveItem] = useState(navigation[0].name); // Default active tab

  const renderComponent = () => {
    const activeNav = navigation.find((item) => item.name === activeItem);
    return activeNav ? activeNav.component : null;
  };

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

          <div className="flex p-4 bg-slate-100">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${activeItem === item.name
                      ? "border-primary-500 text-secondary-900"
                      : "border-transparent text-secondary-500 hover:border-secondary-300 hover:text-secondary-700"
                    }`}
                  aria-current={activeItem === item.name ? "page" : undefined}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Render the active component */}
          <div className="p-4">{renderComponent()}</div>


        </div>
      </main>


    </div>
  )
}