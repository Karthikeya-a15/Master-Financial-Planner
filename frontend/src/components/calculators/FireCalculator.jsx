import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';


export default function FireCalculator() {
  const {updateUser} = useAuth();
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000)
  const [age, setAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(45)
  const [inflation, setInflation] = useState(6)
  const [coastAge, setCoastAge] = useState(35)
  const [fire, setFire] = useState(0);
  
  const [results, setResults] = useState({
    yearlyExpensesRetirement: 0,
    leanFireNumber: 0,
    fireNumber: 0,
    fatFireNumber: 0,
    coastFireNumber: 0
  })

  useEffect(() => {
    fetchUserData();
  },[])

  useEffect(() => {
    calculateFire()
  }, [monthlyExpenses, age, retirementAge, inflation, coastAge])

  const calculateFire = () => {
    const annualExpenses = monthlyExpenses * 12
    const yearsToRetirement = retirementAge - age
    const yearlyExpensesRetirement = annualExpenses * Math.pow((1 + inflation / 100), yearsToRetirement)

    const leanFireNumber = yearlyExpensesRetirement * 15
    const fireNumber = yearlyExpensesRetirement * 25
    const fatFireNumber = yearlyExpensesRetirement * 50

    const expectedRateOfReturn = 10
    const coastFireNumber = fireNumber / (Math.pow((1 + expectedRateOfReturn / 100), retirementAge - coastAge))

    setResults({
      yearlyExpensesRetirement: Math.round(yearlyExpensesRetirement),
      leanFireNumber: Math.round(leanFireNumber),
      fireNumber: Math.round(fireNumber),
      fatFireNumber: Math.round(fatFireNumber),
      coastFireNumber: Math.round(coastFireNumber)
    })
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/v1/user/me`);
      setFire(response.data.fire);
      updateUser(response.data)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/v1/user/save-fire-number', 
        { fireNumber: results.fireNumber }, 
        { headers: { 'Content-Type': 'application/json' } } // Ensure JSON content type
      )
  
      if (response.status === 200) {
        fetchUserData();
        toast.success('FIRE Number saved successfully!', { position: 'top-right', autoClose: 2000 })
      } else {
        toast.error('Failed to save FIRE Number', { position: 'top-right', autoClose: 2000 })
      }
    } catch (error) {
      toast.error('Error saving FIRE Number', { position: 'top-right', autoClose: 2000 })
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">FIRE Calculator</h1>
              <p className="mt-1 text-secondary-600">Calculate your Financial Independence numbers</p>
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
          <div className="mb-4 font-bold text-2xl">
            Saved FIRE NUMBER : <span className='text-blue-500'>{formatCurrency(fire)}</span>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="form-label">Monthly Expenses</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="5000"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className="ml-4 w-24 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Current Age</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="18"
                      max="70"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Retirement Age</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min={age + 1}
                      max="80"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Inflation Rate (%)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.5"
                      value={inflation}
                      onChange={(e) => setInflation(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={inflation}
                      onChange={(e) => setInflation(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Coast FIRE Age</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min={age}
                      max={retirementAge - 1}
                      value={coastAge}
                      onChange={(e) => setCoastAge(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={coastAge}
                      onChange={(e) => setCoastAge(Number(e.target.value))}
                      className="ml-4 w-16 input text-right"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Your FIRE Numbers</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary-600">Yearly Expenses at Retirement</p>
                    <p className="text-xl font-bold text-secondary-900">{formatCurrency(results.yearlyExpensesRetirement)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-600">Lean FIRE Number (15x)</p>
                    <p className="text-xl font-bold text-success-600">{formatCurrency(results.leanFireNumber)}</p>
                    <p className="text-xs text-secondary-500">Minimal, frugal retirement</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-600">FIRE Number (25x)</p>
                    <p className="text-xl font-bold text-primary-600">{formatCurrency(results.fireNumber)}</p>
                    <p className="text-xs text-secondary-500">Standard financial independence</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-600">Fat FIRE Number (50x)</p>
                    <p className="text-xl font-bold text-warning-600">{formatCurrency(results.fatFireNumber)}</p>
                    <p className="text-xs text-secondary-500">Luxurious retirement</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-secondary-600">Coast FIRE Number</p>
                    <p className="text-xl font-bold text-secondary-900">{formatCurrency(results.coastFireNumber)}</p>
                    <p className="text-xs text-secondary-500">Amount needed by age {coastAge} to coast to retirement</p>
                  </div>
                </div>
              </div>
            </div>
             <div className="flex justify-center">
            <button 
              onClick={handleSave} 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-700 transition"
            >
              Save FIRE Number
            </button>
          </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}