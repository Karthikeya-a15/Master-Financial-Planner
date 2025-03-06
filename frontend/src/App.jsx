import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import NetWorthDashboard from './pages/financial-planner/NetWorthDashboard'
import AssumptionsPage from './pages/financial-planner/AssumptionsPage'
import GoalsPage from './pages/financial-planner/GoalsPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import NotFound from './pages/NotFound'
import Landing from './pages/LandingPage'
import { GoalsProvider } from "./contexts/GoalsContext";




function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<Landing/>} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/home"} />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/financial-planner">
        <Route path="net-worth" element={
          <ProtectedRoute>
            <GoalsProvider>
              <NetWorthDashboard />
            </GoalsProvider>
          </ProtectedRoute>
        } />
        <Route path="assumptions" element={
          <ProtectedRoute>
            <AssumptionsPage />
          </ProtectedRoute>
        } />
        <Route path="goals" element={
          <ProtectedRoute>
            <GoalsProvider>
              <GoalsPage />
            </GoalsProvider>
          </ProtectedRoute>
        } />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App