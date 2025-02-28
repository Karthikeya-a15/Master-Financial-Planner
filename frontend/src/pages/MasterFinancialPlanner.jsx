import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const MasterFinancialPlanner = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === `/financial-planner${path}`;
  };
  
  const navItems = [
    { path: '', label: 'Net Worth Dashboard' },
    { path: '/real-estate', label: 'Real Estate' },
    { path: '/domestic-equity', label: 'Domestic Equity' },
    { path: '/foreign-equity', label: 'Foreign Equity' },
    { path: '/debt', label: 'Debt' },
    { path: '/gold', label: 'Gold' },
    { path: '/crypto', label: 'Cryptocurrency' },
    { path: '/miscellaneous', label: 'Miscellaneous' },
    { path: '/liabilities', label: 'Liabilities' },
    { path: '/cash-flows', label: 'Cash Flows' },
    { path: '/returns-and-assets-mix', label: 'Returns & Assets Mix' },
    { path: '/financial-goals', label: 'Financial Goals' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Master Financial Planner</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your net worth, set financial goals, and plan for your future
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <nav className="flex space-x-4 border-b">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/financial-planner${item.path}`}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap ${
                isActive(item.path)
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MasterFinancialPlanner;