import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const FireCalculator = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      monthlyExpenses: 50000,
      age: 30,
      retirementAge: 45,
      inflation: 6,
      coastAge: 35
    }
  });
  
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const annualExpenses = data.monthlyExpenses * 12;
      const yearsToRetirement = data.retirementAge - data.age;
      const yearlyExpensesRetirement = annualExpenses * Math.pow((1 + data.inflation / 100), yearsToRetirement);
      
      const leanFireNumber = yearlyExpensesRetirement * 15;
      const fireNumber = yearlyExpensesRetirement * 25;
      const fatFireNumber = yearlyExpensesRetirement * 50;
      
      const expectedRateOfReturn = 10;
      const coastFireNumber = fireNumber / (Math.pow((1 + expectedRateOfReturn / 100), data.retirementAge - data.coastAge));
      
      setResults({
        yearlyExpensesRetirement: Math.round(yearlyExpensesRetirement),
        leanFireNumber: Math.round(leanFireNumber),
        fireNumber: Math.round(fireNumber),
        fatFireNumber: Math.round(fatFireNumber),
        coastFireNumber: Math.round(coastFireNumber)
      });
      
      setIsLoading(false);
    }, 1000);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">FIRE Calculator</h1>
        <p className="mt-2 text-gray-600">Calculate how much you need to achieve Financial Independence and Retire Early</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Calculator Form */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Input Your Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="monthlyExpenses" className="block text-sm font-medium text-gray-700">
                Monthly Expenses (₹)
              </label>
              <input
                type="number"
                id="monthlyExpenses"
                className={`input ${errors.monthlyExpenses ? 'border-red-500' : ''}`}
                {...register('monthlyExpenses', { 
                  required: 'This field is required',
                  min: { value: 1000, message: 'Minimum value is ₹1,000' }
                })}
              />
              {errors.monthlyExpenses && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyExpenses.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Current Age
              </label>
              <input
                type="number"
                id="age"
                className={`input ${errors.age ? 'border-red-500' : ''}`}
                {...register('age', { 
                  required: 'This field is required',
                  min: { value: 18, message: 'Minimum age is 18' },
                  max: { value: 80, message: 'Maximum age is 80' }
                })}
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700">
                Target Retirement Age
              </label>
              <input
                type="number"
                id="retirementAge"
                className={`input ${errors.retirementAge ? 'border-red-500' : ''}`}
                {...register('retirementAge', { 
                  required: 'This field is required',
                  min: { value: 30, message: 'Minimum retirement age is 30' },
                  max: { value: 90, message: 'Maximum retirement age is 90' },
                  validate: value => parseInt(value) > parseInt(document.getElementById('age').value) || 'Retirement age must be greater than current age'
                })}
              />
              {errors.retirementAge && (
                <p className="mt-1 text-sm text-red-600">{errors.retirementAge.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="inflation" className="block text-sm font-medium text-gray-700">
                Expected Inflation Rate (%)
              </label>
              <input
                type="number"
                id="inflation"
                step="0.1"
                className={`input ${errors.inflation ? 'border-red-500' : ''}`}
                {...register('inflation', { 
                  required: 'This field is required',
                  min: { value: 0, message: 'Minimum value is 0%' },
                  max: { value: 20, message: 'Maximum value is 20%' }
                })}
              />
              {errors.inflation && (
                <p className="mt-1 text-sm text-red-600">{errors.inflation.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="coastAge" className="block text-sm font-medium text-gray-700">
                Coast FIRE Age
                <span className="ml-1 text-xs text-gray-500">(Age at which you can stop saving and let investments grow)</span>
              </label>
              <input
                type="number"
                id="coastAge"
                className={`input ${errors.coastAge ? 'border-red-500' : ''}`}
                {...register('coastAge', { 
                  required: 'This field is required',
                  validate: {
                    greaterThanCurrentAge: value => parseInt(value) >= parseInt(document.getElementById('age').value) || 'Coast age must be greater than or equal to current age',
                    lessThanRetirementAge: value => parseInt(value) <= parseInt(document.getElementById('retirementAge').value) || 'Coast age must be less than or equal to retirement age'
                  }
                })}
              />
              {errors.coastAge && (
                <p className="mt-1 text-sm text-red-600">{errors.coastAge.message}</p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="w-5 h-5 mx-auto text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Calculate FIRE Numbers'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Results Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Your FIRE Numbers</h2>
          
          {results ? (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Yearly expenses at retirement:</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.yearlyExpensesRetirement)}</p>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-medium text-gray-800">FIRE Targets</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Lean FIRE</p>
                        <p className="text-xs text-yellow-600">Minimal, frugal lifestyle</p>
                      </div>
                      <p className="text-xl font-bold text-yellow-800">{formatCurrency(results.leanFireNumber)}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Standard FIRE</p>
                        <p className="text-xs text-green-600">Comfortable lifestyle</p>
                      </div>
                      <p className="text-xl font-bold text-green-800">{formatCurrency(results.fireNumber)}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Fat FIRE</p>
                        <p className="text-xs text-blue-600">Luxurious lifestyle</p>
                      </div>
                      <p className="text-xl font-bold text-blue-800">{formatCurrency(results.fatFireNumber)}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">Coast FIRE</p>
                        <p className="text-xs text-purple-600">Amount needed by your Coast Age</p>
                      </div>
                      <p className="text-xl font-bold text-purple-800">{formatCurrency(results.coastFireNumber)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="mb-2 text-sm font-medium text-gray-700">What do these numbers mean?</h3>
                <ul className="pl-5 text-xs text-gray-600 list-disc space-y-1">
                  <li><strong>Lean FIRE:</strong> The minimum amount needed to retire with a frugal lifestyle.</li>
                  <li><strong>Standard FIRE:</strong> The recommended amount for a comfortable retirement.</li>
                  <li><strong>Fat FIRE:</strong> The amount needed for a luxurious retirement lifestyle.</li>
                  <li><strong>Coast FIRE:</strong> If you have this amount by your Coast Age, you can stop saving and let investments grow until retirement.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-gray-600">Fill in the form and click "Calculate FIRE Numbers" to see your results</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="p-6 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">About FIRE</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            <strong>FIRE (Financial Independence, Retire Early)</strong> is a movement focused on extreme savings and investment that allows proponents to retire far earlier than traditional budgets and retirement plans would allow.
          </p>
          <p>
            The core principle is to save and invest a large percentage of your income (often 50-70%) to accelerate your path to financial independence.
          </p>
          <p>
            <strong>The 4% Rule:</strong> The standard FIRE number is based on the "4% rule," which suggests that you can safely withdraw 4% of your portfolio value each year in retirement with minimal risk of running out of money.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FireCalculator;