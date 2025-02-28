import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../recoil/auth';
import { logout } from '../api/auth';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  BellIcon, 
  EnvelopeIcon, 
  MagnifyingGlassIcon,
  HomeIcon,
  CalculatorIcon,
  ChartPieIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
      error: null
    });
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 bg-primary-700">
            <Link to="/" className="text-xl font-bold text-white">Darw-Invest</Link>
            <button onClick={() => setSidebarOpen(false)} className="text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              <Link 
                to="/" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              
              <Link 
                to="/fire-calculator" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/fire-calculator') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <CalculatorIcon className="w-5 h-5 mr-3" />
                FIRE Calculator
              </Link>
              
              <Link 
                to="/financial-planner" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/financial-planner') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <ChartPieIcon className="w-5 h-5 mr-3" />
                Financial Planner
              </Link>
              
              <Link 
                to="/profile" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/profile') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                Profile
              </Link>
              
              <Link 
                to="/help" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/help') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <QuestionMarkCircleIcon className="w-5 h-5 mr-3" />
                Help & Support
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white shadow">
          <div className="flex items-center h-16 px-6 bg-primary-700">
            <Link to="/" className="text-xl font-bold text-white">Darw-Invest</Link>
          </div>
          
          <div className="flex flex-col flex-1 px-4 py-4 overflow-y-auto">
            <nav className="flex-1 space-y-1">
              <Link 
                to="/" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              
              <Link 
                to="/fire-calculator" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/fire-calculator') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <CalculatorIcon className="w-5 h-5 mr-3" />
                FIRE Calculator
              </Link>
              
              <Link 
                to="/financial-planner" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/financial-planner') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <ChartPieIcon className="w-5 h-5 mr-3" />
                Financial Planner
              </Link>
              
              <Link 
                to="/profile" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/profile') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <UserCircleIcon className="w-5 h-5 mr-3" />
                Profile
              </Link>
              
              <Link 
                to="/help" 
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive('/help') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <QuestionMarkCircleIcon className="w-5 h-5 mr-3" />
                Help & Support
              </Link>
            </nav>
            
            <div className="pt-4 mt-auto border-t border-gray-200">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex justify-between flex-1 px-4">
            <div className="flex flex-1">
              <div className="flex items-center w-full max-w-lg px-2 ml-6 lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="search"
                    className="block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center ml-4 md:ml-6">
              <button className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <EnvelopeIcon className="w-6 h-6" />
              </button>
              
              <button className="p-1 ml-3 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <BellIcon className="w-6 h-6" />
              </button>
              
              <div className="relative ml-3">
                <div>
                  <button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;