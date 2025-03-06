import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'
import { useGoals } from '../../contexts/GoalsContext'

export default function GoalsPage() {
  const {goalsData, setGoalsData} = useGoals(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingGoalIndex, setEditingGoalIndex] = useState(null)
  const [showAddGoalForm, setShowAddGoalForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    goalName: '',
    time: 5,
    amountRequiredToday: 0,
    amountAvailableToday: 0,
    goalInflation: 6,
    stepUp: 5,
    sipRequired: 0
  })

  useEffect(() => {
    document.title = 'Financial Goals | Darw-Invest'
  }, [])

  const handleEditGoal = (index) => {
    setEditingGoalIndex(index)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditingGoalIndex(null)
    setIsEditing(false)
    setShowAddGoalForm(false)
    setNewGoal({
      goalName: '',
      time: 5,
      amountRequiredToday: 0,
      amountAvailableToday: 0,
      goalInflation: 6,
      stepUp: 5,
      sipRequired: 0
    })
  }

  const handleInputChange = (index, field, value) => {
    const updatedGoals = [...goalsData.goals]
    updatedGoals[index] = {
      ...updatedGoals[index],
      [field]: field === 'goalName' ? value : parseFloat(value)
    }
    
    setGoalsData({
      ...goalsData,
      goals: updatedGoals
    })
  }

  const handleNewGoalInputChange = (field, value) => {
    setNewGoal({
      ...newGoal,
      [field]: field === 'goalName' ? value : parseFloat(value)
    })
  }

  const calculateSIP = (goal) => {
    const { amountRequiredToday, amountAvailableToday, time, goalInflation, stepUp } = goal
    
    // Calculate future value with inflation
    const futureValue = amountRequiredToday * Math.pow(1 + goalInflation / 100, time)
    
    // Calculate the gap
    const gap = futureValue - (amountAvailableToday * Math.pow(1 + 10 / 100, time))
    
    // Calculate SIP required (simplified formula)
    const monthlyRate = 10 / 12 / 100
    const months = time * 12
    
    // For step-up SIP
    let sipRequired
    
    if (stepUp > 0) {
      // Simplified step-up SIP calculation
      const effectiveRate = (monthlyRate * 12) - (stepUp / 100)
      sipRequired = (gap * effectiveRate) / (Math.pow(1 + stepUp / 100, time) - 1) / 12
    } else {
      // Regular SIP calculation
      sipRequired = gap / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) / (1 + monthlyRate)
    }
    
    return Math.round(sipRequired)
  }

  const handleAddGoal = () => {
    // Calculate SIP required
    const sipRequired = calculateSIP(newGoal)
    
    const updatedGoal = {
      ...newGoal,
      sipRequired
    }
    
    const updatedGoals = [...goalsData.goals, updatedGoal]
    
    setGoalsData({
      ...goalsData,
      goals: updatedGoals
    })
    
    setShowAddGoalForm(false)
    setNewGoal({
      goalName: '',
      time: 5,
      amountRequiredToday: 0,
      amountAvailableToday: 0,
      goalInflation: 6,
      stepUp: 5,
      sipRequired: 0
    })
    
    toast.success('Goal added successfully')
  }

  const handleUpdateGoal = (index) => {
    const updatedGoals = [...goalsData.goals]
    
    // Recalculate SIP required
    updatedGoals[index].sipRequired = calculateSIP(updatedGoals[index])
    
    setGoalsData({
      ...goalsData,
      goals: updatedGoals
    })
    
    setEditingGoalIndex(null)
    setIsEditing(false)
    
    toast.success('Goal updated successfully')
  }

  const handleDeleteGoal = (index) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = [...goalsData.goals]
      updatedGoals.splice(index, 1)
      
      setGoalsData({
        ...goalsData,
        goals: updatedGoals
      })
      
      toast.success('Goal deleted successfully')
    }
  }

  const handleSaveAllGoals = async () => {
    try {
      setLoading(true)
      const response = await axios.put('/api/v1/planner/financialGoals', {
        goals: goalsData.goals
      })
      
      if (response.data.message) {
        toast.success('Goals saved successfully')
        fetchGoalsData() // Refresh data to get updated SIP allocations
      } else {
        throw new Error('Failed to save goals')
      }
    } catch (error) {
      console.error('Error saving goals:', error)
      toast.error('Failed to save goals')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading && !goalsData) {
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

  if (error && !goalsData) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={fetchGoalsData}
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
              <h1 className="text-2xl font-bold text-secondary-900">Financial Goals</h1>
              <p className="mt-1 text-secondary-600">Track and manage your financial goals</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/financial-planner/net-worth" className="btn btn-secondary">
                Back to Dashboard
              </Link>
              {!showAddGoalForm && !isEditing && (
                <button 
                  onClick={() => setShowAddGoalForm(true)}
                  className="btn btn-primary"
                >
                  Add New Goal
                </button>
              )}
              {(goalsData?.goals?.length > 0 && !showAddGoalForm && !isEditing) && (
                <button 
                  onClick={handleSaveAllGoals}
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save All Goals'}
                </button>
              )}
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
              <h2 className="text-lg font-semibold mb-2">Total Goals</h2>
              <p className="text-3xl font-bold">{goalsData?.goals?.length || 0}</p>
              <div className="mt-4 text-primary-100">
                <div className="flex justify-between">
                  <span>Short-term (0-3 years)</span>
                  <span>{goalsData?.goals?.filter(goal => goal.time <= 3).length || 0}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Medium-term (3-7 years)</span>
                  <span>{goalsData?.goals?.filter(goal => goal.time > 3 && goal.time <= 7).length || 0}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Long-term (7+ years)</span>
                  <span>{goalsData?.goals?.filter(goal => goal.time > 7).length || 0}</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">Monthly SIP Required</h2>
              <p className="text-3xl font-bold text-secondary-900">
                {formatCurrency(goalsData?.goals?.reduce((sum, goal) => sum + goal.sipRequired, 0) || 0)}
              </p>
              <div className="mt-4 text-secondary-600">
                <div className="flex justify-between">
                  <span>Available Monthly Cash</span>
                  <span className="font-medium">{formatCurrency(goalsData?.cashAvailable || 0)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Surplus/Deficit</span>
                  <span className={`font-medium ${(goalsData?.cashAvailable || 0) >= (goalsData?.goals?.reduce((sum, goal) => sum + goal.sipRequired, 0) || 0) ? 'text-success-600' : 'text-danger-600'}`}>
                    {formatCurrency((goalsData?.cashAvailable || 0) - (goalsData?.goals?.reduce((sum, goal) => sum + goal.sipRequired, 0) || 0))}
                  </span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">Current Investible Assets</h2>
              <p className="text-3xl font-bold text-success-600">{formatCurrency(goalsData?.currentInvestibleAssets || 0)}</p>
              <div className="mt-4 text-secondary-600">
                <div className="flex justify-between">
                  <span>Total Required Today</span>
                  <span className="font-medium">{formatCurrency(goalsData?.goals?.reduce((sum, goal) => sum + goal.amountRequiredToday, 0) || 0)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Total Available Today</span>
                  <span className="font-medium">{formatCurrency(goalsData?.goals?.reduce((sum, goal) => sum + goal.amountAvailableToday, 0) || 0)}</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Add Goal Form */}
          {showAddGoalForm && (
            <motion.div 
              className="card border border-primary-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-6">Add New Goal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="form-group">
                    <label htmlFor="goalName" className="form-label">Goal Name</label>
                    <input
                      type="text"
                      id="goalName"
                      className="input"
                      value={newGoal.goalName}
                      onChange={(e) => handleNewGoalInputChange('goalName', e.target.value)}
                      placeholder="e.g., Retirement, Home Purchase"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="time" className="form-label">Time Horizon (years)</label>
                    <input
                      type="number"
                      id="time"
                      className="input"
                      value={newGoal.time}
                      onChange={(e) => handleNewGoalInputChange('time', e.target.value)}
                      min="1"
                      max="50"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="amountRequiredToday" className="form-label">Amount Required Today (₹)</label>
                    <input
                      type="number"
                      id="amountRequiredToday"
                      className="input"
                      value={newGoal.amountRequiredToday}
                      onChange={(e) => handleNewGoalInputChange('amountRequiredToday', e.target.value)}
                      min="0"
                      step="10000"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="form-group">
                    <label htmlFor="amountAvailableToday" className="form-label">Amount Available Today (₹)</label>
                    <input
                      type="number"
                      id="amountAvailableToday"
                      className="input"
                      value={newGoal.amountAvailableToday}
                      onChange={(e) => handleNewGoalInputChange('amountAvailableToday', e.target.value)}
                      min="0"
                      step="10000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="goalInflation" className="form-label">Goal Inflation Rate (%)</label>
                    <input
                      type="number"
                      id="goalInflation"
                      className="input"
                      value={newGoal.goalInflation}
                      onChange={(e) => handleNewGoalInputChange('goalInflation', e.target.value)}
                      min="0"
                      max="20"
                      step="0.5"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stepUp" className="form-label">Annual SIP Step-up (%)</label>
                    <input
                      type="number"
                      id="stepUp"
                      className="input"
                      value={newGoal.stepUp}
                      onChange={(e) => handleNewGoalInputChange('stepUp', e.target.value)}
                      min="0"
                      max="25"
                      step="1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddGoal}
                  className="btn btn-primary"
                  disabled={!newGoal.goalName || newGoal.amountRequiredToday <= 0 || newGoal.time <= 0}
                >
                  Add Goal
                </button>
              </div>
            </motion.div>
          )}
          
          {/* Goals List */}
          {goalsData?.goals?.length > 0 ? (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-6">Your Financial Goals</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Goal</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Time (years)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Required Today</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Available Today</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Monthly SIP</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {goalsData.goals.map((goal, index) => (
                      <tr key={index} className={editingGoalIndex === index ? 'bg-primary-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingGoalIndex === index ? (
                            <input
                              type="text"
                              className="input"
                              value={goal.goalName}
                              onChange={(e) => handleInputChange(index, 'goalName', e.target.value)}
                            />
                          ) : (
                            <div className="text-sm font-medium text-secondary-900">{goal.goalName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {editingGoalIndex === index ? (
                            <input
                              type="number"
                              className="input w-20 text-right"
                              value={goal.time}
                              onChange={(e) => handleInputChange(index, 'time', e.target.value)}
                              min="1"
                              max="50"
                            />
                          ) : (
                            <div className="text-sm text-secondary-900">{goal.time}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {editingGoalIndex === index ? (
                            <input
                              type="number"
                              className="input w-32 text-right"
                              value={goal.amountRequiredToday}
                              onChange={(e) => handleInputChange(index, 'amountRequiredToday', e.target.value)}
                              min="0"
                              step="10000"
                            />
                          ) : (
                            <div className="text-sm text-secondary-900">{formatCurrency(goal.amountRequiredToday)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {editingGoalIndex === index ? (
                            <input
                              type="number"
                              className="input w-32 text-right"
                              value={goal.amountAvailableToday}
                              onChange={(e) => handleInputChange(index, 'amountAvailableToday', e.target.value)}
                              min="0"
                              step="10000"
                            />
                          ) : (
                            <div className="text-sm text-secondary-900">{formatCurrency(goal.amountAvailableToday)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-secondary-900">{formatCurrency(goal.sipRequired)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingGoalIndex === index ? (
                            <div className="flex space-x-2 justify-end">
                              <button 
                                onClick={() => handleUpdateGoal(index)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Save
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="text-secondary-600 hover:text-secondary-900"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-4 justify-end">
                              <button 
                                onClick={() => handleEditGoal(index)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteGoal(index)}
                                className="text-danger-600 hover:text-danger-900"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            !showAddGoalForm && (
              <motion.div 
                className="card text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <svg className="w-16 h-16 text-secondary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No goals yet</h3>
                <p className="text-secondary-600 mb-6">Start by adding your first financial goal</p>
                <button 
                  onClick={() => setShowAddGoalForm(true)}
                  className="btn btn-primary"
                >
                  Add Your First Goal
                </button>
              </motion.div>
            )
          )}
          
          {/* SIP Asset Allocation */}
          {goalsData?.goals?.length > 0 && goalsData?.sipAssetAllocation && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-6">SIP Asset Allocation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Monthly SIP Breakdown</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(goalsData.sipAssetAllocation).map(([key, value]) => {
                      const totalSIP = Object.values(goalsData.sipAssetAllocation).reduce((sum, val) => sum + val, 0)
                      const percentage = totalSIP > 0 ? (value / totalSIP * 100).toFixed(1) : 0
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
          )}
        </div>
      </main>
    </div>
  )
}