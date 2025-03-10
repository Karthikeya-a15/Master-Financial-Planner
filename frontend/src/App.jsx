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
import CalculatorsDashboard from './components/calculators/calculatorsDashboard'
import FireCalculator from "./components/calculators/FireCalculator"
import SipCalculator from "./components/calculators/SipCalculator"
import FdCalculator from "./components/calculators/FdCalculator"
import RdCalculator from "./components/calculators/RdCalculator"
import CagrCalculator from "./components/calculators/CagrCalculator"
import LumpsumCalculator from "./components/calculators/LumpSumpCalculator"
import StepUpSipCalculator from "./components/calculators/StepUpSipCalculator"
import Profile from './pages/profile/Profile'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/Dashboard'
import MutualFunds from './pages/admin/MutualFunds'
import { useAdminAuth } from './pages/admin/AdminAuthContext'
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute'
import UserEngagement from './pages/admin/UserEngagement'
import GoalChart from './pages/admin/GoalsAnalytics'

function App() {
  const { isAuthenticated } = useAuth()
  const {isAdminAuthenticated} = useAdminAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/home" element={<Landing/>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={!isAdminAuthenticated? <AdminLogin /> : <Navigate to="/admin/dashboard"/> } />
      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedAdminRoute>
          <AdminDashboard/ >
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/mutualfunds" element={
        <ProtectedAdminRoute>
          <MutualFunds/>
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/analytics/user-engagement" element={
        <ProtectedAdminRoute>
          <UserEngagement/>
        </ProtectedAdminRoute>
      }/>
      <Route path="/admin/analytics/goals" element= {
        <ProtectedAdminRoute>
          <GoalChart/>
        </ProtectedAdminRoute>
      }/>
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/home"} />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/financial-planner">
        <Route path="net-worth" element={
          <ProtectedRoute>
            <NetWorthDashboard />
          </ProtectedRoute>
        } />
        <Route path="assumptions" element={
          <ProtectedRoute>
            <AssumptionsPage />
          </ProtectedRoute>
        } />
        <Route path="goals" element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="calculators">
        <Route path="" element={
          <ProtectedRoute>
            <CalculatorsDashboard/>
          </ProtectedRoute>
        }/>
        <Route path="fire" element={
          <ProtectedRoute>
            <FireCalculator/>
          </ProtectedRoute>
        }/>
        <Route path="sip" element={
          <ProtectedRoute>
            <SipCalculator/>
          </ProtectedRoute>
        }/>
        <Route path="fd" element={
          <ProtectedRoute>
            <FdCalculator/>
          </ProtectedRoute>
        }/>
        <Route path="rd" element={
          <ProtectedRoute>
            <RdCalculator/>
          </ProtectedRoute>
        }/>
        <Route path="cagr" element={
          <ProtectedRoute>
            <CagrCalculator/>
          </ProtectedRoute>
        }/>
        <Route path="lumpsum" element={
          <ProtectedRoute>
            <LumpsumCalculator/>
          </ProtectedRoute>
        }/>
        <Route path="step-sip" element={
          <ProtectedRoute>
            <StepUpSipCalculator/>
          </ProtectedRoute>
        }/>
      </Route>
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App