import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../../components/layout/Navbar'
import { motion } from 'framer-motion'

export default function Profile() {
  const { currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Profile | Darw-Invest'
    
    // Pre-fill form with current user data
    // console.log(currentUser);
    if (true) {
      setValue('name', "Micahel")
      setValue('email', "michael.lee@example.com")
      setValue('age', 35)
    }
  }, [currentUser, setValue])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      // This would typically call an API endpoint
      // await axios.put('/api/v1/user/profile', data)
      
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        toast.success('Profile updated successfully')
        setIsEditing(false)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
      setLoading(false)
    }
  }

  const handleChangePassword = () => {
    navigate('/forgot-password')
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Profile Settings</h1>
              <p className="mt-1 text-secondary-600">Manage your account information</p>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-medium">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900">{currentUser?.name}</h2>
                  <p className="text-secondary-600">{currentUser?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-secondary-200">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className={`input ${errors.name ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    disabled={!isEditing}
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className={`input ${errors.email ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    disabled={!isEditing}
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
                
                <div className="form-group">
                  <label htmlFor="age" className="form-label">Age</label>
                  <input
                    type="number"
                    id="age"
                    className={`input ${errors.age ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                    disabled={!isEditing}
                    {...register('age', { 
                      required: 'Age is required',
                      min: {
                        value: 18,
                        message: 'You must be at least 18 years old'
                      },
                      max: {
                        value: 120,
                        message: 'Please enter a valid age'
                      }
                    })}
                  />
                  {errors.age && <p className="form-error">{errors.age.message}</p>}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-secondary-200">
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">Password</h3>
                  <p className="text-secondary-600">Update your password to keep your account secure</p>
                </div>
                <button 
                  onClick={handleChangePassword}
                  className="btn btn-secondary"
                >
                  Change Password
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">Two-Factor Authentication</h3>
                  <p className="text-secondary-600">Add an extra layer of security to your account</p>
                </div>
                <button className="btn btn-secondary" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card bg-danger-50 border border-danger-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-danger-900 mb-4">Danger Zone</h2>
            <p className="text-danger-600 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            
            <button className="btn bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500">
              Delete Account
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}