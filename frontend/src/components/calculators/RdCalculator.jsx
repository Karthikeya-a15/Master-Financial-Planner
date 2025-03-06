import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function RdCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(10000)
  const [years, setYears] = useState(5)
  const [rateOfInterest, setRateOfInterest] = useState(7)
  const [yearlyResults, setYearlyResults] = useState([])

  useEffect(() => {
    calculateRD()
  }, [monthlyDeposit, years, rateOfInterest])

  const calculateRD = () => {
    const results = []
    for(let year = 1; year <= years; year++) {
      const rate = rateOfInterest / 100
      const totalMonths = year * 12
      let futureValue = 0
      let totalDeposit = 0

      for (let month = 0; month < totalMonths; month++) {
        totalDeposit += monthlyDeposit
        futureValue += monthlyDeposit * Math.pow((1 + rate / 12), totalMonths - month)
      }

      const interest = futureValue - totalDeposit

      results.push({
        year,
        totalDeposit: Math.round(totalDeposit),
        interest: Math.round(interest),
        futureValue: Math.round(futureValue)
      })
    }
    setYearlyResults(results)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const chartData = {
    labels: yearlyResults.map(r => `Year ${r.year}`),
    datasets: [
      {
        label: 'Total Deposit',
        data: yearlyResults.map(r => r.totalDeposit),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Interest Earned',
        data: yearlyResults.map(r => r.interest),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recurring Deposit Growth Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      },
      x: {
        stacked: true
      }
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Recurring Deposit Calculator</h1>
              <p className="mt-1 text-secondary-600">Calculate returns on your Recurring Deposits</p>
            </div>
            <Link to="/calculators" className="btn btn-secondary">
              Back to Calculators
            </Link>
          </div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Monthly Deposit</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlyDeposit}
                      onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={monthlyDeposit}
                      onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                      className="ml-4 w-24 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Time Period (Years)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Interest Rate (%)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="0.1"
                      value={rateOfInterest}
                      onChange={(e) => setRateOfInterest(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={rateOfInterest}
                      onChange={(e) => setRateOfInterest(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Investment Summary</h3>
                
                {yearlyResults.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-secondary-600">Total Deposit</p>
                      <p className="text-xl font-bold text-secondary-900">{formatCurrency(yearlyResults[yearlyResults.length - 1].totalDeposit)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-secondary-600">Total Interest</p>
                      <p className="text-xl font-bold text-success-600">{formatCurrency(yearlyResults[yearlyResults.length - 1].interest)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-secondary-600">Maturity Amount</p>
                      <p className="text-xl font-bold text-primary-600">{formatCurrency(yearlyResults[yearlyResults.length - 1].futureValue)}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-secondary-200">
                      <div className="flex justify-between text-sm text-secondary-600 mb-2">
                        <span>Investment Breakup</span>
                        <span>Percentage</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary-700">Total Deposit</span>
                        <span className="font-medium">{((yearlyResults[yearlyResults.length - 1].totalDeposit / yearlyResults[yearlyResults.length - 1].futureValue) * 100).toFixed(1)}%</span>
                      </div>
                      
                      <div className="w-full bg-secondary-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(yearlyResults[yearlyResults.length - 1].totalDeposit / yearlyResults[yearlyResults.length - 1].futureValue) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary-700">Interest Earned</span>
                        <span className="font-medium">{((yearlyResults[yearlyResults.length - 1].interest / yearlyResults[yearlyResults.length - 1].futureValue) * 100).toFixed(1)}%</span>
                      </div>
                      
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-success-600 h-2 rounded-full" 
                          style={{ width: `${(yearlyResults[yearlyResults.length - 1].interest / yearlyResults[yearlyResults.length - 1].futureValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Bar data={chartData} options={chartOptions} />
          </motion.div>

          {/* Yearly Breakdown Table */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Yearly Breakdown</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Total Deposit</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Interest Earned</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Maturity Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {yearlyResults.map((result) => (
                    <tr key={result.year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">Year {result.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">{formatCurrency(result.totalDeposit)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">{formatCurrency(result.interest)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-primary-600">{formatCurrency(result.futureValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}