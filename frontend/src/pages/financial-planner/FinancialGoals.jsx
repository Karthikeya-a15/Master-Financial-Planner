import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getFinancialGoals, updateFinancialGoals } from '../../api/planner';

const FinancialGoals = () => {
  const [goalsData, setGoalsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    goals: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFinancialGoals();
        setGoalsData(data);
        setFormData({
          goals: data.goals || []
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch financial goals data');
        toast.error(err.message || 'Failed to fetch financial goals data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (index, field, value) => {
    const updatedGoals = [...formData.goals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      [field]: field === 'goalName' ? value : parseFloat(value) || 0
    };
    setFormData({ ...formData, goals: updatedGoals });
  };
  
  const addGoal = () => {
    setFormData({
      ...formData,
      goals: [
        ...formData.goals,
        {
          goalName: '',
          time: 0,
          amountRequiredToday: 0,
          amountAvailableToday: 0,
          goalInflation: 6,
          stepUp: 0,
          sipRequired: 0
        }
      ]
    });
  };
  
  const removeGoal = (index) => {
    const updatedGoals = [...formData.goals];
    updatedGoals.splice(index, 1);
    setFormData({ ...formData, goals: updatedGoals });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateFinancialGoals(formData);
      setGoalsData({ ...goalsData, goals: formData.goals });
      setIsEditing(false);
      toast.success('Financial goals updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update financial goals');
      toast.error(err.message || 'Failed to update financial goals');
    } finally {
      setSaving(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-gray-600">Loading financial goals data...</p>
        </div>
      </div>
    );
  }
  
  if (error && !goalsData) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-lg font-medium text-red-800">Error Loading Data</h2>
        <p className="mt-2 text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
          <p className="mt-1 text-sm text-gray-600">
            Set and track your financial goals
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to="/financial-planner" 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({ goals: goalsData.goals || [] });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow-md">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {formData.goals.length === 0 ? (
                <div className="p-4 text-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">No financial goals yet. Add your first goal below.</p>
                </div>
              ) : (
                formData.goals.map((goal, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Goal #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`goalName-${index}`} className="block text-sm font-medium text-gray-700">
                          Goal Name
                        </label>
                        <input
                          type="text"
                          id={`goalName-${index}`}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          value={goal.goalName}
                          onChange={(e) => handleInputChange(index, 'goalName', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`time-${index}`} className="block text-sm font-medium text-gray-700">
                          Time Horizon (years)
                        </label>
                        <input
                          type="number"
                          id={`time-${index}`}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          value={goal.time}
                          onChange={(e) => handleInputChange(index, 'time', e.target.value)}
                          min="0"
                          step="0.5"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`amountRequiredToday-${index}`} className="block text-sm font-medium text-gray-700">
                          Amount Required Today (₹)
                        </label>
                        <input
                          type="number"
                          id={`amountRequiredToday-${index}`}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          value={goal.amountRequiredToday}
                          onChange={(e) => handleInputChange(index, 'amountRequiredToday', e.target.value)}
                          min="0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`amountAvailableToday-${index}`} className="block text-sm font-medium text-gray-700">
                          Amount Available Today (₹)
                        </label>
                        <input
                          type="number"
                          id={`amountAvailableToday-${index}`}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          value={goal.amountAvailableToday}
                          onChange={(e) => handleInputChange(index, 'amountAvailableToday', e.target.value)}
                          min="0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`goalInflation-${index}`} className="block text-sm font-medium text-gray-700">
                          Goal Inflation Rate (%)
                        </label>
                        <input
                          type="number"
                          id={`goalInflation-${index}`}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          value={goal.goalInflation}
                          onChange={(e) => handleInputChange(index, 'goalInflation', e.target.value)}
                          min="0"
                          step="0.1"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`stepUp-${index}`} className="block text-sm font-medium text-gray-700">
                          Annual Step-Up (%)
                        </label>
                        <input
                          type="number"
                          id={`stepUp-${index}`}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          value={goal.stepUp}
                          onChange={(e) => handleInputChange(index, 'stepUp', e.target.value)}
                          min="0"
                          step="0.1"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`sipRequired-${index}`} className="block text-sm font-medium text-gray-700">
                          SIP Required (₹)
                        </label>
                        <input
                          type="number"
                          id={`sipRequired-${index}`}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          value={goal.sipRequired}
                          onChange={(e) => handleInputChange(index, 'sipRequired', e.target.value)}
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              <div>
                <button
                  type="button"
                  onClick={addGoal}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Goal
                </button>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={saving}
                >
                  {saving ? (
                    <svg className="w-5 h-5 mx-auto text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {goalsData.goals && goalsData.goals.length > 0 ? (
              <>
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Goal Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Time Horizon
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          Amount Required
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          Amount Available
                        </th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                          SIP Required
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {goalsData.goals.map((goal, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {goal.goalName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {goal.time} years
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                            {formatCurrency(goal.amountRequiredToday)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                            {formatCurrency(goal.amountAvailableToday)}
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                            {formatCurrency(goal.sipRequired)}/month
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {goalsData.sipAssetAllocation && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">SIP Asset Allocation</h3>
                    <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Asset Class
                            </th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                              Monthly SIP Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(goalsData.sipAssetAllocation).map(([asset, amount]) => (
                            <tr key={asset}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                {asset.charAt(0).toUpperCase() + asset.slice(1).replace(/([A-Z])/g, ' $1')}
                              </td>
                              <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                                {formatCurrency(amount)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              Total
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                              {formatCurrency(Object.values(goalsData.sipAssetAllocation).reduce((sum, amount) => sum + amount, 0))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No financial goals</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first financial goal.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Goal
                  </button>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Information</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Your SIP asset allocation is automatically calculated based on your goals and the asset allocation
                      assumptions you've set in the Returns & Assets Mix section. Short-term goals will be allocated more
                      towards safer assets, while long-term goals will have more allocation towards growth assets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialGoals;