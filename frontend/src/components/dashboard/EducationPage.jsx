import { useState, useEffect } from 'react';
import { CheckCircleIcon, AcademicCapIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

const returnAssumptions = [
  { assetClass: 'Domestic Equity', expectedReturn: '12%', riskLevel: 'High', recommendedHorizon: '> 5 years' },
  { assetClass: 'US Equity', expectedReturn: '12%', riskLevel: 'High', recommendedHorizon: '> 5 years' },
  { assetClass: 'Debt Investments', expectedReturn: '6%', riskLevel: 'Low', recommendedHorizon: '1-3 years' },
  { assetClass: 'Real Estate', expectedReturn: '10%', riskLevel: 'Medium', recommendedHorizon: '> 7 years' },
  { assetClass: 'Gold', expectedReturn: '6%', riskLevel: 'Medium', recommendedHorizon: '> 3 years' }
];

const allocationStrategies = [
  { 
    horizon: 'Short-term (<3 years)',
    equity: '0%',
    debt: '100%',
    alternatives: '0%',
    rationale: 'Capital preservation is priority'
  },
  {
    horizon: 'Medium-term (3-7 years)',
    equity: '40%',
    debt: '50%',
    alternatives: '10%',
    rationale: 'Balanced approach for growth and stability'
  },
  {
    horizon: 'Long-term (>7 years)',
    equity: '60%',
    debt: '25%',
    alternatives: '15%',
    rationale: 'Focus on long-term growth'
  }
];

const modules = [
  {
    id: 1,
    title: 'Net Worth & Asset Allocation',
    icon: CurrencyDollarIcon,
    description: 'Master the fundamentals of calculating and managing your net worth',
    sections: [
      { id: 'nw-1', title: 'Understanding Net Worth Calculation' },
      { id: 'nw-2', title: 'Categorizing Assets for Investment Planning' },
      { id: 'nw-3', title: 'Filling Out Financial Data Sheets' }
    ],
    content: {
      'nw-1': {
        title: 'Understanding Net Worth Calculation',
        description: 'Your net worth is a snapshot of your financial health at a point in time.',
        points: [
          'Total Assets: Sum of everything you own (cash, investments, property)',
          'Total Liabilities: Sum of everything you owe (loans, mortgages)',
          'Net Worth = Total Assets - Total Liabilities'
        ]
      },
      'nw-2': {
        title: 'Categorizing Assets',
        description: 'Assets are classified into two main categories:',
        points: [
          'Liquid Assets: Easily convertible to cash (stocks, bonds, savings)',
          'Illiquid Assets: Take time to sell (real estate, collectibles)',
          'Investible Assets: Liquid assets available for investment'
        ]
      },
      'nw-3': {
        title: 'Financial Data Sheets',
        description: 'Track your finances across these categories:',
        points: [
          'Cash Flows: Income and expenses',
          'Investments: Stocks, bonds, mutual funds',
          'Property: Real estate holdings',
          'Insurance: Life and health policies'
        ]
      }
    }
  },
  {
    id: 2,
    title: 'Goals & Investment Planning',
    icon: ChartBarIcon,
    description: 'Learn to set and achieve your financial goals through strategic planning',
    sections: [
      { id: 'gp-1', title: 'Defining Financial Goals' },
      { id: 'gp-2', title: 'Allocating SIP Amount' },
      { id: 'gp-3', title: 'Goal Breakdown Visualization' }
    ],
    content: {
      'gp-1': {
        title: 'Defining Financial Goals',
        description: 'Set clear, measurable financial objectives:',
        points: [
          'Short-term goals (< 3 years)',
          'Medium-term goals (3-7 years)',
          'Long-term goals (> 7 years)',
          'Calculate required amount and timeline'
        ]
      },
      'gp-2': {
        title: 'SIP Allocation',
        description: 'Systematic Investment Planning across asset classes:',
        points: [
          'Choose suitable investment vehicles',
          'Set up regular investment schedule',
          'Monitor and adjust contributions'
        ]
      },
      'gp-3': {
        title: 'Goal Visualization',
        description: 'Track progress towards your goals:',
        points: [
          'View asset allocation breakdown',
          'Monitor goal completion percentage',
          'Adjust strategy based on performance'
        ]
      }
    }
  },
  {
    id: 3,
    title: 'Returns & Asset Mix',
    icon: AcademicCapIcon,
    description: 'Optimize your portfolio with advanced return analysis and asset mixing strategies',
    sections: [
      { id: 'rm-1', title: 'Understanding Return Assumptions' },
      { id: 'rm-2', title: 'Default Asset Allocation' },
      { id: 'rm-3', title: 'Customizing Your Strategy' }
    ],
    content: {
      'rm-1': {
        title: 'Return Assumptions',
        description: 'Expected returns by asset class:',
        points: [
          'Domestic Equity: 12%',
          'US Equity: 12%',
          'Debt Investments: 6%',
          'Real Estate: 10%',
          'Gold: 6%'
        ]
      },
      'rm-2': {
        title: 'Default Allocation',
        description: 'Time-based allocation strategies:',
        points: [
          'Short-term: 100% Debt',
          'Medium-term: 40% Equity, 60% Debt',
          'Long-term: 60% Equity, 25% Debt, 15% Alternative'
        ]
      },
      'rm-3': {
        title: 'Custom Strategy',
        description: 'Personalize your investment approach:',
        points: [
          'Adjust allocations based on risk tolerance',
          'Compare different scenarios',
          'Optimize for your goals'
        ]
      }
    }
  }
];

export default function EducationPath() {
  const [selectedModule, setSelectedModule] = useState(1);
  const [selectedSection, setSelectedSection] = useState('nw-1');
  const [completedSections, setCompletedSections] = useState(new Set());
  const [animateContent, setAnimateContent] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const navigate = useNavigate(); 

  const currentModule = modules.find(m => m.id === selectedModule);
  const currentContent = currentModule?.content[selectedSection];

  const calculateProgress = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    const totalSections = module.sections.length;
    const completedCount = module.sections.filter(s => completedSections.has(s.id)).length;
    return (completedCount / totalSections) * 100;
  };

  const markComplete = () => {
    setCompletedSections(prev => new Set([...prev, selectedSection]));
  };

  const isAllCompleted = () => {
    const totalSections = modules.reduce((acc, module) => acc + module.sections.length, 0);
    return completedSections.size === totalSections;
  };

  useEffect(() => {
    setAnimateContent(false);
    const timer = setTimeout(() => setAnimateContent(true), 50);
    return () => clearTimeout(timer);
  }, [selectedSection, selectedModule]);

  const renderTable = (type) => {
    if (type === 'returns') {
      return (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Horizon</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returnAssumptions.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.assetClass}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.expectedReturn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.riskLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.recommendedHorizon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (type === 'allocation') {
      return (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Horizon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alternatives</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rationale</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allocationStrategies.map((strategy, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{strategy.horizon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{strategy.equity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{strategy.debt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{strategy.alternatives}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{strategy.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const CelebrationModal = () => (
    <AnimatePresence>
      {showCelebration && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-6xl mb-4"
              >
                🎓
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Congratulations, Financial Master! 🌟
              </h2>
              <p className="text-gray-600 mb-6">
                You've completed your journey to financial mastery. Time to put your knowledge into action! 💪
              </p>
              <button
                onClick={() =>{ setShowCelebration(false); navigate("/dashboard") } }
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Continue Your Journey 🚀
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CelebrationModal />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Master Financial Planner
          </h1>
          <p className="text-xl text-gray-600">
            Your journey to financial mastery begins here
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Module Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {modules.map(module => (
              <div key={module.id} className="glass-effect rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl">
                <button
                  onClick={() => {
                    setSelectedModule(module.id);
                    setSelectedSection(module.sections[0].id);
                  }}
                  className={classNames(
                    "w-full rounded-lg transition-all duration-300 p-4",
                    selectedModule === module.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "hover:bg-blue-50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <module.icon className="w-6 h-6" />
                    <h3 className="font-semibold">{module.title}</h3>
                  </div>
                  <p className="text-sm opacity-80 text-left mt-2">{module.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${calculateProgress(module.id)}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-right">
                      {Math.round(calculateProgress(module.id))}% Complete
                    </p>
                  </div>
                </button>
                
                {selectedModule === module.id && (
                  <div className="mt-4 space-y-2">
                    {module.sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        className={classNames(
                          "w-full p-3 text-sm rounded-lg flex items-center transition-all duration-300",
                          selectedSection === section.id
                            ? "bg-blue-100 text-blue-700 shadow-inner"
                            : "hover:bg-blue-50"
                        )}
                      >
                        {completedSections.has(section.id) ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2" />
                        )}
                        <span>{section.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={classNames(
                "glass-effect rounded-xl p-8 shadow-lg",
                animateContent ? "animate-fade-in" : "opacity-0"
              )}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentContent?.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {currentContent?.description}
              </p>
              
              <div className="space-y-6">
                {currentContent?.points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-4 rounded-lg bg-white bg-opacity-50 hover:bg-opacity-70 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                      {index + 1}
                    </div>
                    <p className="ml-4 text-gray-700 text-lg">{point}</p>
                  </motion.div>
                ))}
              </div>

              {selectedSection === 'rm-1' && renderTable('returns')}
              {selectedSection === 'rm-2' && renderTable('allocation')}

              <div className="mt-12 flex justify-between">
                <button
                  onClick={() => {
                    const currentModuleSections = currentModule.sections;
                    const currentIndex = currentModuleSections.findIndex(s => s.id === selectedSection);
                    
                    if (currentIndex > 0) {
                      setSelectedSection(currentModuleSections[currentIndex - 1].id);
                    } else if (selectedModule > 1) {
                      const prevModule = modules.find(m => m.id === selectedModule - 1);
                      setSelectedModule(prevModule.id);
                      setSelectedSection(prevModule.sections[prevModule.sections.length - 1].id);
                    }
                  }}
                  className={classNames(
                    "px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300",
                    selectedModule === 1 && selectedSection === 'nw-1'
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
                  )}
                  disabled={selectedModule === 1 && selectedSection === 'nw-1'}
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    markComplete();
                    
                    const currentModuleSections = currentModule.sections;
                    const currentIndex = currentModuleSections.findIndex(s => s.id === selectedSection);
                    
                    if (currentIndex < currentModuleSections.length - 1) {
                      setSelectedSection(currentModuleSections[currentIndex + 1].id);
                    } else if (selectedModule < modules.length) {
                      const nextModule = modules.find(m => m.id === selectedModule + 1);
                      setSelectedModule(nextModule.id);
                      setSelectedSection(nextModule.sections[0].id);
                    } else if (isAllCompleted()) {
                      setShowCelebration(true);
                    }
                  }}
                  className="px-6 py-3 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg transition-all duration-300 hover:translate-y-[-1px]"
                >
                  {selectedModule === modules.length && 
                   selectedSection === modules[modules.length - 1].sections[modules[modules.length - 1].sections.length - 1].id
                    ? "Complete Journey 🎉"
                    : "Next"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}