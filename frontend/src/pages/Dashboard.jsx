import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalculatorIcon, 
  AcademicCapIcon, 
  BanknotesIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [news, setNews] = useState([
    { id: 1, title: 'Market reaches all-time high as tech stocks surge', source: 'Financial Times' },
    { id: 2, title: 'Central bank holds interest rates steady amid inflation concerns', source: 'Bloomberg' },
    { id: 3, title: 'New tax laws could impact retirement savings strategies', source: 'CNBC' },
    { id: 4, title: 'Global markets respond to economic data releases', source: 'Reuters' },
    { id: 5, title: 'Cryptocurrency market shows signs of recovery after recent dip', source: 'CoinDesk' }
  ]);
  
  const [tips, setTips] = useState([
    "Consider index funds for long-term growth with lower fees.",
    "Diversify your portfolio to reduce risk and increase potential returns.",
    "Start investing early to take advantage of compound interest.",
    "Regularly review and rebalance your portfolio to maintain your desired asset allocation.",
    "Don't try to time the market; consistent investing often outperforms market timing."
  ]);
  
  const [currentTip, setCurrentTip] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [tips.length]);
  
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'How to start investing with just ₹1,000',
      author: 'Priya Sharma',
      date: '2 days ago',
      excerpt: 'Many people think investing requires a lot of money to start, but thats not true...',
      upvotes: 42,
      comments: 15
    },
    {
      id: 2,
      title: 'Understanding mutual funds: A beginners guide',
      author: 'Rahul Verma',
      date: '5 days ago',
      excerpt: 'Mutual funds are one of the most popular investment vehicles for both beginners and experienced investors...',
      upvotes: 38,
      comments: 23
    },
    {
      id: 3,
      title: 'The power of compound interest explained',
      author: 'Amit Patel',
      date: '1 week ago',
      excerpt: 'Albert Einstein once called compound interest the eighth wonder of the world...',
      upvotes: 65,
      comments: 31
    }
  ]);
  
  const handleUpvote = (id) => {
    setBlogPosts(blogPosts.map(post => 
      post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
  };
  
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-3xl font-bold sm:text-4xl">Welcome to Darw-Invest</h1>
          <p className="mt-4 text-lg">Your comprehensive financial planning platform for investment growth and retirement planning.</p>
          <div className="mt-6">
            <Link to="/financial-planner" className="inline-flex items-center px-6 py-3 text-base font-medium text-primary-700 bg-white border border-transparent rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white">
              <ChartPieIcon className="w-5 h-5 mr-2" />
              Get Started with Financial Planner
            </Link>
          </div>
        </div>
      </div>
      
      {/* FIRE Calculator Card */}
      <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Calculate Your FIRE Number</h2>
            <p className="mt-1 text-gray-600">Find out when you can achieve Financial Independence and Retire Early.</p>
          </div>
          <Link to="/fire-calculator" className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Calculate Now
          </Link>
        </div>
      </div>
      
      {/* Information & Tools Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Div */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Tools & Resources</h2>
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
            <Link to="/financial-planner" className="flex flex-col items-center p-4 text-center transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
              <CalculatorIcon className="w-10 h-10 text-primary-600" />
              <span className="mt-2 font-medium text-gray-800">Calculators</span>
              <span className="mt-1 text-sm text-gray-600">Financial planning tools</span>
            </Link>
            
            <div className="flex flex-col items-center p-4 text-center transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
              <BanknotesIcon className="w-10 h-10 text-primary-600" />
              <span className="mt-2 font-medium text-gray-800">Discounts</span>
              <span className="mt-1 text-sm text-gray-600">Special investment offers</span>
            </div>
            
            <div className="flex flex-col items-center p-4 text-center transition-colors bg-gray-50 rounded-lg hover:bg-gray-100">
              <AcademicCapIcon className="w-10 h-10 text-primary-600" />
              <span className="mt-2 font-medium text-gray-800">Education</span>
              <span className="mt-1 text-sm text-gray-600">Learn about investing</span>
            </div>
          </div>
        </div>
        
        {/* Right Div */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Daily Financial Tip</h2>
            <div className="p-4 mt-3 italic bg-gray-50 rounded-lg">
              <p className="text-gray-700">{tips[currentTip]}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Financial News</h2>
            <div className="mt-3 overflow-x-auto">
              <div className="flex space-x-4 animate-[scroll_20s_linear_infinite]">
                {news.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-64 p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">Source: {item.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog Section */}
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Community Discussions</h2>
        <div className="mt-4 space-y-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
              <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
              <div className="flex items-center mt-3 space-x-4">
                <button 
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center text-sm text-gray-500 hover:text-primary-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {post.upvotes}
                </button>
                <span className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {post.comments} comments
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-primary-600 hover:text-primary-700">
            View More Discussions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;