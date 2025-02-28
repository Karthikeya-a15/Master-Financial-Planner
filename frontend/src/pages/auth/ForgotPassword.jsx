import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { forgotPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)
    const { success } = await forgotPassword(data.email)
    setIsLoading(false)
    
    if (success) {
      setIsSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary-50">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary-600 font-display">Darw-Invest</h1>
            </Link>
            <h2 className="mt-6 text-2xl font-bold text-secondary-900">Reset Your Password</h2>
            <p className="mt-2 text-secondary-600">
              {isSubmitted 
                ? "Check your email for reset instructions" 
                : "Enter your email and we'll send you instructions to reset your password"}
            </p>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className={`input ${errors.email ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="your@email.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : 'Send Reset Instructions'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <svg className="w-16 h-16 text-success-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-secondary-700 mb-6">
                We've sent password reset instructions to your email address. Please check your inbox.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn btn-secondary"
              >
                Send again
              </button>
            </div>
          )}
          
          <div className="text-center mt-6">
            <p className="text-sm text-secondary-600">
              Remember your password?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}