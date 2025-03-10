import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminAuthContext = createContext();

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthProvider({ children }) {
  const [currentAdmin, setcurrentAdmin] = useState(null);
  const [isAdminAuthenticated, setisAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
      setisAdminAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const fetchUserData = async (email) => {
    try {
      setcurrentAdmin(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("Failed to fetch user data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/v1/admin/login', { email, password });

      const { token } = response.data;
      localStorage.setItem('adminToken', token);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setisAdminAuthenticated(true);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setcurrentAdmin(null);
    setisAdminAuthenticated(false);
    setLoading(false);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('You have been logged out');
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setTimeout(() => {
        toast.success('Password reset instructions sent to your email');
      }, 1000);
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset instructions. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentAdmin,
    isAdminAuthenticated,
    loading,
    login,
    logout,
    forgotPassword
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
