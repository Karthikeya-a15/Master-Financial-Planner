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

export default function FdCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [years, setYears] = useState(5)
  const [rateOfInterest, setRateOfInterest] = useState(7)
  const [yearlyResults, setYearlyResults] = useState([])

  useEffect(() => {
    calculateFD()
  }, [principal, years, rateOfInterest])

  const calculateFD = () => {
    const results = []
    for(let year = 1; year <= years; year++) {
      const rate = rateOfInterest / 100
      const futureValueYearly = principal * Math.pow((1 + rate), year)
      const interestYearly = futureValueYearly - principal

      const futureValueHalfYearly = principal * Math.pow((1 + rate / 2), 2 * year)
      const interestHalfYearly = futureValueHalfYearly - principal

      const futureValueQuarterly = principal * Math.pow((1 + rate / 4), 4 * year)
      const interestQuarterly = futureValueQuarterly - principal
      
      const futureValueMonthly = principal * Math.pow((1 + rate / 12), 12 * year)
      const interestMonthly = futureValueMonthly - principal

      results.push({
        year,
        futureValueYearly: Math.round(futureValueYearly),
        interestYearly: Math.round(interestYearly),
        futureValueHalfYearly: Math.round(futureValueHalfYearly),
        interestHalfYearly: Math.round(interestHalfYearly),
        futureValueQuarterly: Math.round(futureValueQuarterly),
        interestQuarterly: Math.round(interestQuarterly),
        futureValueMonthly: Math.round(futureValueMonthly),
        interestMonthly: Math.round(interestMonthly)
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
        label: 'Principal Amount',
        data: yearlyResults.map(() => principal),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Interest (Yearly Compounding)',
        data: yearlyResults.map(r => r.interestYearly),
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
        text: 'Fixed Deposit Growth Over Time'
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
              <h1 className="text-2xl font-bold text-secondary-900">Fixed Deposit Calculator</h1>
              <p className="mt-1 text-secondary-600">Calculate returns on your Fixed Deposits</p>
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
                  <label className="form-label">Principal Amount</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      step="1000"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="ml-4 w-32 input text-right"
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
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Interest Calculation Options</h3>
                
                {yearlyResults.length > 0 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Yearly Compounding</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-600">Maturity Amount</span>
                        <span className="font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].futureValueYearly)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Total Interest</span>
                        <span className="text-success-600 font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].interestYearly)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Half-Yearly Compounding</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-600">Maturity Amount</span>
                        <span className="font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].futureValueHalfYearly)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Total Interest</span>
                        <span className="text-success-600 font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].interestHalfYearly)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Quarterly Compounding</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-600">Maturity Amount</span>
                        <span className="font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].futureValueQuarterly)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Total Interest</span>
                        <span className="text-success-600 font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].interestQuarterly)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-secondary-900 mb-2">Monthly Compounding</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-secondary-600">Maturity Amount</span>
                        <span className="font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].futureValueMonthly)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-secondary-600">Total Interest</span>
                        <span className="text-success-600 font-medium">{formatCurrency(yearlyResults[yearlyResults.length - 1].interestMonthly)}</span>
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Principal</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Interest (Yearly)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Interest (Half-Yearly)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Interest (Quarterly)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Interest (Monthly)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {yearlyResults.map((result) => (
                    <tr key={result.year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">Year {result.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">{formatCurrency(principal)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">{formatCurrency(result.interestYearly)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">{formatCurrency(result.interestHalfYearly)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">{formatCurrency(result.interestQuarterly)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">{formatCurrency(result.interestMonthly)}</td>
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