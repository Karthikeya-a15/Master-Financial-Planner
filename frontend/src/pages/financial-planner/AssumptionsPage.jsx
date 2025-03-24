import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'
import { useGoals } from '../../contexts/GoalsContext'


export default function AssumptionsPage() {
  const { goalsData } = useGoals();
  const [assumptions, setAssumptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  
  const shortTermReturns = useRef(0);
  const mediumTermReturns = useRef(0);
  const longTermReturns = useRef(0);

  useEffect(() => {
    document.title = 'Returns & Asset Mix Assumptions | Darw-Invest'
    fetchAssumptions()
  }, [])

  const fetchAssumptions = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/v1/planner/assumptions')
      
      if (response.data.returnsAndAssets) {
        setAssumptions(response.data.returnsAndAssets)
        setFormData(response.data.returnsAndAssets)
      } else {
        throw new Error('Invalid response format')
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching assumptions:', error)
      setError('Failed to load assumptions data. Please try again later.')
      setLoading(false)
      toast.error('Failed to load assumptions data')
    }
  }

  const handleInputChange = (category, field, value) => {
    const numValue = parseFloat(value)
    
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: isNaN(numValue) ? 0 : numValue
      }
    }))
  }

  const validateAllocation = (category) => {
    const total = Object.values(formData[category]).reduce((sum, value) => sum + value, 0)
    return Math.abs(total - 100) < 0.01 // Allow for small floating point errors
  }
  const calculateEffectiveReturns = (category) =>{
    // console.log(formData);
    const expectedReturns = Object.values(formData["expectedReturns"]);
    const categoryReturns = Object.values(formData[category]);
      //calculate
    let ans= 0;
    for(let i = 0; i < expectedReturns.length; i++){
      ans += expectedReturns[i] * categoryReturns[i];
    }
    ans/=100;
    return ans;
  }

  const handleSave = async () => {
    // Validate allocations sum to 100%
    const shortTermValid = validateAllocation('shortTerm')
    const mediumTermValid = validateAllocation('mediumTerm')
    const longTermValid = validateAllocation('longTerm')
    
    if (!shortTermValid || !mediumTermValid || !longTermValid) {
      toast.error('Each time horizon allocation must sum to 100%')
      return
    }
    
    try {
      setLoading(true)
      // console.log(formData);
      // console.log(shortTermReturns.current.innerText.slice(0, -1));
      // formData.effectiveReturns.shortTermReturns = shortTermReturns.current.innerText.slice(0, -1)
      const change =  parseFloat(shortTermReturns.current.innerText.slice(0,-1))
      console.log(change)
      setFormData((prev) => {
        return {
          ...prev,
          effectiveReturns : {
            shortTermReturns : change,
            mediumTermReturns : parseFloat(mediumTermReturns.current.innerText.slice(0,-1)) * 0.4 + 0.6 * change,
            longTermReturns : parseFloat(longTermReturns.current.innerText.slice(0,-1))
          }
        }
      })
      // console.log(formData);
      const response = await axios.put('/api/v1/planner/assumptions', formData)
      const res = await axios.put("/api/v1/planner/financialGoals",{
        goals : goalsData.goals
      })
      
      if (response.data.message) {
        toast.success('Assumptions updated successfully')
        setAssumptions(formData)
        setIsEditing(false)
      } else {
        throw new Error('Failed to update assumptions')
      }
    } catch (error) {
      console.error('Error updating assumptions:', error)
      toast.error('Failed to update assumptions')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(assumptions)
    setIsEditing(false)
  }

  if (loading && !assumptions) {
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

  if (error && !assumptions) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={fetchAssumptions}
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
              <h1 className="text-2xl font-bold text-secondary-900">Returns & Asset Mix Assumptions</h1>
              <p className="mt-1 text-secondary-600">Configure your expected returns and asset allocation strategies</p>
            </div>
            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="btn btn-secondary">
                    Back to Dashboard
                  </Link>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Assumptions
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Expected Returns */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Expected Annual Returns</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Asset Class</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Expected Return (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {formData && Object.entries(formData.expectedReturns).map(([key, value]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            className="input w-24 text-right"
                            value={value}
                            onChange={(e) => handleInputChange('expectedReturns', key, e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        ) : (
                          `${value}%`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Asset Allocation Strategies */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Asset Allocation Strategies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Short Term */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Short Term (0-3 years)</h3>
                
                {formData && Object.entries(formData.shortTerm).map(([key, value]) => {
                  const percentage = value
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
                    <div key={key} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {isEditing ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="input w-16 text-right"
                              value={value}
                              onChange={(e) => handleInputChange('shortTerm', key, e.target.value)}
                              min="0"
                              max="100"
                              step="1"
                            />
                            <span className="ml-1">%</span>
                          </div>
                        ) : (
                          <span className="text-secondary-900 font-medium">{percentage}%</span>
                        )}
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Effective Returns</h2>
                  <p ref={shortTermReturns} className="text-lg font-bold text-green-700" >{calculateEffectiveReturns("shortTerm")}%</p>
                </div>
                
                {isEditing && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span className={validateAllocation('shortTerm') ? 'text-success-600' : 'text-danger-600'}>
                        {Object.values(formData.shortTerm).reduce((sum, value) => sum + value, 0)}%
                      </span>
                    </div>
                    {!validateAllocation('shortTerm') && (
                      <p className="text-danger-600 mt-1">Total must equal 100%</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Medium Term */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Medium Term (3-7 years)</h3>
                
                {formData && Object.entries(formData.mediumTerm).map(([key, value]) => {
                  const percentage = value
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
                    <div key={key} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {isEditing ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="input w-16 text-right"
                              value={value}
                              onChange={(e) => handleInputChange('mediumTerm', key, e.target.value)}
                              min="0"
                              max="100"
                              step="1"
                            />
                            <span className="ml-1">%</span>
                          </div>
                        ) : (
                          <span className="text-secondary-900 font-medium">{percentage}%</span>
                        )}
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
                
                <div className="flex justify-end">
                  {/* <h2 className="text-lg font-semibold">Effective Returns</h2>*/}
                  <p ref={mediumTermReturns} className="text-lg font-bold text-green-700">{calculateEffectiveReturns("mediumTerm")* 0.4 + 0.6 * calculateEffectiveReturns("shortTerm")}%</p>
                </div>

                {isEditing && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span className={validateAllocation('mediumTerm') ? 'text-success-600' : 'text-danger-600'}>
                        {Object.values(formData.mediumTerm).reduce((sum, value) => sum + value, 0)}%
                      </span>
                    </div>
                    {!validateAllocation('mediumTerm') && (
                      <p className="text-danger-600 mt-1">Total must equal 100%</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Long Term */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Long Term (7+ years)</h3>
                
                {formData && Object.entries(formData.longTerm).map(([key, value]) => {
                  const percentage = value
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
                    <div key={key} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {isEditing ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              className="input w-16 text-right"
                              value={value}
                              onChange={(e) => handleInputChange('longTerm', key, e.target.value)}
                              min="0"
                              max="100"
                              step="1"
                            />
                            <span className="ml-1">%</span>
                          </div>
                        ) : (
                          <span className="text-secondary-900 font-medium">{percentage}%</span>
                        )}
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
                <div className="flex justify-end">
                  {/* <h2 className="text-lg font-semibold">Effective Returns</h2> */}
                  <p ref={longTermReturns} className="text-lg font-bold text-green-700">{calculateEffectiveReturns("longTerm")}%</p>
                </div>
                
                {isEditing && (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span className={validateAllocation('longTerm') ? 'text-success-600' : 'text-danger-600'}>
                        {Object.values(formData.longTerm).reduce((sum, value) => sum + value, 0)}%
                      </span>
                    </div>
                    {!validateAllocation('longTerm') && (
                      <p className="text-danger-600 mt-1">Total must equal 100%</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Recommendations */}
          <motion.div 
            className="card bg-primary-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-4">Recommendations</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-secondary-900">Short-Term Goals (0-3 years)</h3>
                  <p className="mt-1 text-secondary-600">Focus on capital preservation. Debt instruments like fixed deposits, liquid funds, and short-term government securities are ideal.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-secondary-900">Medium-Term Goals (3-7 years)</h3>
                  <p className="mt-1 text-secondary-600">Balance between growth and stability. Consider a mix of equity and debt with some allocation to gold for diversification.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium text-secondary-900">Long-Term Goals (7+ years)</h3>
                  <p className="mt-1 text-secondary-600">Focus on growth. Higher allocation to equity (both domestic and international) with some alternative investments like real estate and crypto for potential higher returns.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}