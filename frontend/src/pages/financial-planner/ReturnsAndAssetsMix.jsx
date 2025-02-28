import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAssumptions, updateAssumptions } from '../../api/planner';

const ReturnsAndAssetsMix = () => {
  const [assumptionsData, setAssumptionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    expectedReturns: {
      domesticEquity: 12,
      usEquity: 12,
      debt: 6,
      gold: 6,
      crypto: 20,
      realEstate: 10
    },
    shortTerm: {
      domesticEquity: 0,
      usEquity: 0,
      debt: 100,
      gold: 0,
      crypto: 0,
      realEstate: 0
    },
    mediumTerm: {
      domesticEquity: 40,
      usEquity: 0,
      debt: 50,
      gold: 10,
      crypto: 0,
      realEstate: 0
    },
    longTerm: {
      domesticEquity: 60,
      usEquity: 10,
      debt: 15,
      gold: 5,
      crypto: 5,
      realEstate: 5
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssumptions();
        setAssumptionsData(data.returnsAndAssets);
        setFormData(data.returnsAndAssets);
      } catch (err) {
        setError(err.message || 'Failed to fetch assumptions data');
        toast.error(err.message || 'Failed to fetch assumptions data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: parseFloat(value) || 0
      }
    });
  };
  
  const validateAssetAllocation = (allocation) => {
    const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
    return Math.abs(total - 100) < 0.01; // Allow for small floating point errors
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate asset allocations
    if (!validateAssetAllocation(formData.shortTerm)) {
      toast.error('Short-term asset allocation must sum to 100%');
      return;
    }
    
    if (!validateAssetAllocation(formData.mediumTerm)) {
      toast.error('Medium-term asset allocation must sum to 100%');
      return;
    }
    
    if (!validateAssetAllocation(formData.longTerm)) {
      toast.error('Long-term asset allocation must sum to 100%');
      return;
    }
    
    setSaving(true);
    
    try {
      await updateAssumptions(formData);
      setAssumptionsData(formData);
      setIsEditing(false);
      toast.success('Returns and assets mix updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update assumptions data');
      toast.error(err.message || 'Failed to update assumptions data');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-gray-600">Loading assumptions data...</p>
        </div>
      </div>
    );
  }
  
  if (error && !assumptionsData) {
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
  
  const assetClasses = [
    { id: 'domesticEquity', label: 'Domestic Equity' },
    { id: 'usEquity', label: 'US Equity' },
    { id: 'debt', label: 'Debt' },
    { id: 'gold', label: 'Gold' },
    { id: 'crypto', label: 'Cryptocurrency' },
    { id: 'realEstate', label: 'Real Estate' }
  ];
  
  const calculateTotal = (allocation) => {
    return Object.values(allocation).reduce((sum, value) => sum + value, 0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Returns & Assets Mix Assumptions</h2>
          <p className="mt-1 text-sm text-gray-600">
            Set your expected returns and asset allocation for different time horizons
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
                setFormData(assumptionsData);
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
            <div className="space-y-8">
              {/* Expected Returns */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Expected Annual Returns (%)</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set your expected annual returns for each asset class
                </p>
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assetClasses.map((asset) => (
                    <div key={asset.id}>
                      <label htmlFor={`expectedReturns-${asset.id}`} className="block text-sm font-medium text-gray-700">
                        {asset.label}
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          id={`expectedReturns-${asset.id}`}
                          className="block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0"
                          value={formData.expectedReturns[asset.id]}
                          onChange={(e) => handleInputChange('expectedReturns', asset.id, e.target.value)}
                          step="0.1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Short Term Allocation */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Short Term Asset Allocation (0-3 years)</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Allocate your assets for short-term goals (must sum to 100%)
                </p>
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assetClasses.map((asset) => (
                    <div key={asset.id}>
                      <label htmlFor={`shortTerm-${asset.id}`} className="block text-sm font-medium text-gray-700">
                        {asset.label}
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          id={`shortTerm-${asset.id}`}
                          className="block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0"
                          value={formData.shortTerm[asset.id]}
                          onChange={(e) => handleInputChange('shortTerm', asset.id, e.target.value)}
                          step="0.1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-2 text-sm ${Math.abs(calculateTotal(formData.shortTerm) - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  Total: {calculateTotal(formData.shortTerm).toFixed(1)}% {Math.abs(calculateTotal(formData.shortTerm) - 100) < 0.01 ? '✓' : '(must be 100%)'}
                </div>
              </div>
              
              {/* Medium Term Allocation */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Medium Term Asset Allocation (3-7 years)</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Allocate your assets for medium-term goals (must sum to 100%)
                </p>
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assetClasses.map((asset) => (
                    <div key={asset.id}>
                      <label htmlFor={`mediumTerm-${asset.id}`} className="block text-sm font-medium text-gray-700">
                        {asset.label}
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          id={`mediumTerm-${asset.id}`}
                          className="block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0"
                          value={formData.mediumTerm[asset.id]}
                          onChange={(e) => handleInputChange('mediumTerm', asset.id, e.target.value)}
                          step="0.1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-2 text-sm ${Math.abs(calculateTotal(formData.mediumTerm) - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  Total: {calculateTotal(formData.mediumTerm).toFixed(1)}% {Math.abs(calculateTotal(formData.mediumTerm) - 100) < 0.01 ? '✓' : '(must be 100%)'}
                </div>
              </div>
              
              {/* Long Term Allocation */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Long Term Asset Allocation (7+ years)</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Allocate your assets for long-term goals (must sum to 100%)
                </p>
                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assetClasses.map((asset) => (
                    <div key={asset.id}>
                      <label htmlFor={`longTerm-${asset.id}`} className="block text-sm font-medium text-gray-700">
                        {asset.label}
                      </label>
                       <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                          type="number"
                          id={`longTerm-${asset.id}`}
                          className="block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0"
                          value={formData.longTerm[asset.id]}
                          onChange={(e) => handleInputChange('longTerm', asset.id, e.target.value)}
                          step="0.1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-2 text-sm ${Math.abs(calculateTotal(formData.longTerm) - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  Total: {calculateTotal(formData.longTerm).toFixed(1)}% {Math.abs(calculateTotal(formData.longTerm) - 100) < 0.01 ? '✓' : '(must be 100%)'}
                </div>
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
          <div className="space-y-8">
            {/* Expected Returns */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Expected Annual Returns</h3>
              <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Asset Class
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        Expected Return (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assetClasses.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {asset.label}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {assumptionsData.expectedReturns[asset.id]}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Asset Allocations */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Asset Allocations by Time Horizon</h3>
              <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Asset Class
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        Short Term (0-3 years)
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        Medium Term (3-7 years)
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        Long Term (7+ years)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assetClasses.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {asset.label}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {assumptionsData.shortTerm[asset.id]}%
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {assumptionsData.mediumTerm[asset.id]}%
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                          {assumptionsData.longTerm[asset.id]}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        Total
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                        {calculateTotal(assumptionsData.shortTerm)}%
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                        {calculateTotal(assumptionsData.mediumTerm)}%
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                        {calculateTotal(assumptionsData.longTerm)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
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
                      These assumptions are used to calculate your required asset allocation based on your financial goals.
                      Short-term goals typically favor safer assets like debt, while long-term goals can handle more volatility
                      and thus have higher allocations to equity.
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

export default ReturnsAndAssetsMix;