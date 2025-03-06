import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
      
      // Fetch user data
      // fetchUserData()
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`/api/v1/user/profile/${email}`)
      // console.log(response.data);
      setCurrentUser(response.data)
      // setCurrentUser({"name" : "hello"});
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
      await fetchUserData(email);
      
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

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setCurrentUser(null)
    setIsAuthenticated(false)
    delete axios.defaults.headers.common['Authorization']
    toast.info('You have been logged out')
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
    forgotPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}