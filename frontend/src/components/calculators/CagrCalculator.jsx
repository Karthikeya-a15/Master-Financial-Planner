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

export default function CagrCalculator() {
  const [initialValue, setInitialValue] = useState(100000)
  const [finalValue, setFinalValue] = useState(200000)
  const [years, setYears] = useState(5)
  const [cagr, setCagr] = useState(0)
  const [yearlyResults, setYearlyResults] = useState([])

  useEffect(() => {
    calculateCAGR()
  }, [initialValue, finalValue, years])

  const calculateCAGR = () => {
    const cagrValue = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100
    setCagr(Number(cagrValue.toFixed(2)))

    // Calculate yearly breakdown
    const results = []
    let currentValue = initialValue

    for (let year = 1; year <= years; year++) {
      currentValue = initialValue * Math.pow(1 + cagrValue / 100, year)
      const interest = currentValue - initialValue
      
      results.push({
        year,
        principal: initialValue,
        interest: Math.round(interest),
        totalValue: Math.round(currentValue)
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
        data: yearlyResults.map(r => r.principal),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Interest',
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
        text: 'Investment Growth Over Time'
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
              <h1 className="text-2xl font-bold text-secondary-900">CAGR Calculator</h1>
              <p className="mt-1 text-secondary-600">Calculate Compound Annual Growth Rate</p>
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
                  <label className="form-label">Initial Value</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      step="1000"
                      value={initialValue}
                      onChange={(e) => setInitialValue(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={initialValue}
                      onChange={(e) => setInitialValue(Number(e.target.value))}
                      className="ml-4 w-32 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Final Value</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      step="1000"
                      value={finalValue}
                      onChange={(e) => setFinalValue(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={finalValue}
                      onChange={(e) => setFinalValue(Number(e.target.value))}
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
              </div>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">CAGR Analysis</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-secondary-600">Initial Investment</p>
                    <p className="text-xl font-bold text-secondary-900">{formatCurrency(initialValue)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-600">Final Value</p>
                    <p className="text-xl font-bold text-secondary-900">{formatCurrency(finalValue)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-600">Time Period</p>
                    <p className="text-xl font-bold text-secondary-900">{years} years</p>
                  </div>
                  
                  <div className="pt-4 border-t border-secondary-200">
                    <p className="text-sm text-secondary-600">Compound Annual Growth Rate (CAGR)</p>
                    <p className="text-3xl font-bold text-primary-600">{cagr}%</p>
                    <p className="text-sm text-secondary-500 mt-2">
                      This means your investment grew at an average rate of {cagr}% per year
                    </p>
                  </div>
                </div>
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Principal Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Total Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {yearlyResults.map((result) => (
                    <tr key={result.year}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">Year {result.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-secondary-900">{formatCurrency(result.principal)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-success-600">{formatCurrency(result.interest)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-primary-600">{formatCurrency(result.totalValue)}</td>
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