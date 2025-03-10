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

export default function StepUpSipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [years, setYears] = useState(10)
  const [rateOfReturn, setRateOfReturn] = useState(12)
  const [incrementRate, setIncrementRate] = useState(5)
  const [results, setResults] = useState([])

  useEffect(() => {
    calculateStepUpSIP()
  }, [monthlyInvestment, years, rateOfReturn, incrementRate])

  const calculateStepUpSIP = () => {
    const yearlyResults = []
    for (let year = 1; year <= years; year++) {
      const p = monthlyInvestment
      const i = incrementRate / 100
      const r = rateOfReturn / 100
      const t = year;
      let totalInvestment = (12 * monthlyInvestment * (Math.pow((1 + i), year) - 1)) / i

      let e = (1 + r) ** (1 / 12) - 1
      , a = (1 + r) ** (t - 1)
      , l = 1 - ((1 + i) / (1 + r)) ** t
      , s = 1 - (1 + i) * 1 / (1 + r);
      const fv = parseFloat((p * ((1 - (1 + e) ** 13) / (1 - (1 + e)) - 1) * a * l / s).toFixed(2))
      yearlyResults.push({
        year,
        totalInvestment: Math.round(totalInvestment),
        futureValue: Math.round(fv),
        estimatedReturns: Math.round(fv - totalInvestment)
      })
    }
    setResults(yearlyResults)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const chartData = {
    labels: results.map(r => `Year ${r.year}`),
    datasets: [
      {
        label: 'Total Investment',
        data: results.map(r => r.totalInvestment),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Estimated Returns',
        data: results.map(r => r.estimatedReturns),
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
        text: 'Step-up SIP Growth Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
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
              <h1 className="text-2xl font-bold text-secondary-900">Step-up SIP Calculator</h1>
              <p className="mt-1 text-secondary-600">Calculate returns with annual SIP increment</p>
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
                  <label className="form-label">Monthly Investment</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                      className="ml-4 w-24 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Investment Period (Years)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="30"
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
                  <label className="form-label">Expected Return Rate (%)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.5"
                      value={rateOfReturn}
                      onChange={(e) => setRateOfReturn(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={rateOfReturn}
                      onChange={(e) => setRateOfReturn(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Annual Increment Rate (%)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={incrementRate}
                      onChange={(e) => setIncrementRate(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={incrementRate}
                      onChange={(e) => setIncrementRate(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Investment Summary</h3>
                
                {results.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-secondary-600">Final Investment Amount</p>
                      <p className="text-xl font-bold text-secondary-900">
                        {formatCurrency(results[results.length - 1].totalInvestment)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-secondary-600">Total Returns</p>
                      <p className="text-xl font-bold text-success-600">
                        {formatCurrency(results[results.length - 1].estimatedReturns)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-secondary-600">Future Value</p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatCurrency(results[results.length - 1].futureValue)}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-secondary-200">
                      <div className="flex justify-between text-sm text-secondary-600 mb-2">
                        <span>Investment Breakup</span>
                        <span>Percentage</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary-700">Amount Invested</span>
                        <span className="font-medium">
                          {((results[results.length - 1].totalInvestment / results[results.length - 1].futureValue) * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-secondary-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(results[results.length - 1].totalInvestment / results[results.length - 1].futureValue) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary-700">Wealth Gained</span>
                        <span className="font-medium">
                          {((results[results.length - 1].estimatedReturns / results[results.length - 1].futureValue) * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-success-600 h-2 rounded-full" 
                          style={{ width: `${(results[results.length - 1].estimatedReturns / results[results.length - 1].futureValue) * 100}%` }}
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Monthly SIP</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Total Investment</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Estimated Returns</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Future Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {results.map((result) => (
                    <tr key={result.year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">Year {result.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">
                        {formatCurrency(monthlyInvestment * Math.pow(1 + incrementRate/100, result.year - 1))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">{formatCurrency(result.totalInvestment)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">{formatCurrency(result.estimatedReturns)}</td>
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