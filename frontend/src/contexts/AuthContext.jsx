import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') 
      ? JSON.parse(localStorage.getItem('currentUser')) 
      : null
  })  
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      fetchUserData();

      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
  }, [currentUser])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/v1/user/me`)
      setCurrentUser(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/user/login', { email, password })
      
      const { token } = response.data
      // console.log(response);
      // Save token to localStorage
      localStorage.setItem('token', token)
      setToken(token)
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setIsAuthenticated(true)
      
      // Fetch user data
      await fetchUserData();
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser) // 🔹 This will trigger `useEffect` and update localStorage
  }

  const signup = async (name, email, password, age) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/v1/user/signup', { 
        name, 
        email, 
        password,
        age: parseInt(age)
      })
      
      toast.success('Account created successfully! Please log in.')
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try{
      localStorage.removeItem('currentUser')
      localStorage.removeItem('token')
      const response = await axios.post('api/v1/user/logout');
      setToken(null)
      setCurrentUser(null)
      setIsAuthenticated(false)
      delete axios.defaults.headers.common['Authorization']
      toast.info('You have been logged out')
    }catch(error){
      console.error("Sign out error");
      console.error('Signup error:', error)
      const errorMessage = error.response?.data?.message || 'Sign out failed. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const forgotPassword = async (email) => {
    try {
      setLoading(true)
      // This would typically call an API endpoint
      // await axios.post('/api/v1/user/forgot-password', { email })
      
      // For now, we'll just simulate a successful response
      setTimeout(() => {
        toast.success('Password reset instructions sent to your email')
      }, 1000)
      
      return { success: true }
    } catch (error) {
      console.error('Forgot password error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send reset instructions. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}