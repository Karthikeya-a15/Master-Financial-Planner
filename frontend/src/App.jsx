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
import { GoalsProvider } from "./contexts/GoalsContext"
import ToolsDashboard from './components/tools/ToolsDashboard'
import IndexFunds from './components/tools/IndexFunds'
import MutualFunds from './components/tools/MutualFunds'
import DebtFunds from './components/tools/DebtFunds'
import ArbitrageFunds from './components/tools/ArbitrageFunds'
import EquitySaver from './components/tools/EquitySaver'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/Dashboard'
import MutualFundsAdmin from './pages/admin/MutualFunds'
import { useAdminAuth } from './pages/admin/AdminAuthContext'
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute'
import UserEngagement from './pages/admin/UserEngagement'
import GoalChart from './pages/admin/GoalsAnalytics'
import Rooms from './components/chat-app/Rooms'
import EducationPath from './components/dashboard/EducationPage'
import ResetPassword from './pages/auth/ResetPassword'

function App() {
  const { isAuthenticated } = useAuth()
  const {isAdminAuthenticated} = useAdminAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password">
        <Route path="" element={<ForgotPassword/>}/>
      </Route>
      <Route path="/forgot-password/:token" element={<ResetPassword/>}/>
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
          <MutualFundsAdmin/>
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

      
      {/* User Protected Routes */}
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
            <GoalsProvider>
              <NetWorthDashboard />
            </GoalsProvider>
          </ProtectedRoute>
        } />
        <Route path="assumptions" element={
          <ProtectedRoute>
            <GoalsProvider>
              <AssumptionsPage />
            </GoalsProvider>
          </ProtectedRoute>
        } />
        <Route path="goals" element={
          <ProtectedRoute>
              <GoalsPage />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="tools">
        <Route path="" element={
          <ProtectedRoute>
            <ToolsDashboard />
          </ProtectedRoute>
        } />
        <Route path="indexfunds" element={
          <ProtectedRoute>
            <IndexFunds />
          </ProtectedRoute>
        } />
        <Route path="mutualfunds" element={
          <ProtectedRoute>
            <MutualFunds />
          </ProtectedRoute>
        } />
        <Route path="debtfunds" element={
          <ProtectedRoute>
            <DebtFunds />
          </ProtectedRoute>
        } />
        
        <Route path="arbitrage" element={
          <ProtectedRoute>
            <ArbitrageFunds />
          </ProtectedRoute>
        } /> 
        <Route path="equitysaver" element={
          <ProtectedRoute>
            <EquitySaver />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="education">
        <Route path="" element = { <EducationPath/> }/>
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


      <Route path="chat">
        <Route path="rooms"  element = {<ProtectedRoute>
            <Rooms></Rooms>
          </ProtectedRoute> } 
          />
      </Route>
         

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App