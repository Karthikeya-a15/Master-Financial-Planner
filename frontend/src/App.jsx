import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from './recoil/auth';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import MasterFinancialPlanner from './pages/MasterFinancialPlanner';
import FireCalculator from './pages/FireCalculator';
// import Profile from './pages/Profile';
// import Help from './pages/Help';

// Financial Planner Pages
import NetWorthDashboard from './pages/financial-planner/NetWorthDashboard';
import RealEstate from './pages/financial-planner/RealEstate';
// import DomesticEquity from './pages/financial-planner/DomesticEquity';
// import ForeignEquity from './pages/financial-planner/ForeignEquity';
// import Debt from './pages/financial-planner/Debt';
// import Gold from './pages/financial-planner/Gold';
// import Crypto from './pages/financial-planner/Crypto';
// import Miscellaneous from './pages/financial-planner/Miscellaneous';
// import Liabilities from './pages/financial-planner/Liabilities';
// import CashFlows from './pages/financial-planner/CashFlows';
import ReturnsAndAssetsMix from './pages/financial-planner/ReturnsAndAssetsMix';
import FinancialGoals from './pages/financial-planner/FinancialGoals';

// Layout
import MainLayout from './layouts/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const auth = useRecoilValue(authState);
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="fire-calculator" element={<FireCalculator />} />
        {/* <Route path="profile" element={<Profile />} /> */}
        {/* <Route path="help" element={<Help />} /> */}
        
        {/* Master Financial Planner Routes */}
        <Route path="financial-planner" element={<MasterFinancialPlanner />}>
          <Route index element={<NetWorthDashboard />} />
          <Route path="real-estate" element={<RealEstate />} />
          {/* <Route path="domestic-equity" element={<DomesticEquity />} />
          <Route path="foreign-equity" element={<ForeignEquity />} />
          <Route path="debt" element={<Debt />} />
          <Route path="gold" element={<Gold />} />
          <Route path="crypto" element={<Crypto />} />
          <Route path="miscellaneous" element={<Miscellaneous />} />
          <Route path="liabilities" element={<Liabilities />} />
          <Route path="cash-flows" element={<CashFlows />} /> */}
          <Route path="returns-and-assets-mix" element={<ReturnsAndAssetsMix />} />
          <Route path="financial-goals" element={<FinancialGoals />} />
        </Route>
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;