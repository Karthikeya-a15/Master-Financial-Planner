import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { format } from "date-fns";


export default function InfoTools() {
  const [activeTab, setActiveTab] = useState('tips')
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3

  const financialTips = [
    {
      title: "Start Early, Start Small",
      content: "The power of compounding works best over time. Even small investments can grow significantly over decades."
    },
    {
      title: "Emergency Fund First",
      content: "Build a 6-month emergency fund before making other investments. It provides financial security during unexpected events."
    },
    {
      title: "Diversify Your Investments",
      content: "Don't put all your eggs in one basket. Spread investments across different asset classes to reduce risk."
    },
    {
      title: "Automate Your Savings",
      content: "Set up automatic transfers to your investment accounts. What you don't see, you won't spend."
    },
    {
      title: "Minimize Investment Fees",
      content: "High fees can significantly reduce your returns over time. Look for low-cost index funds and ETFs."
    }
  ]

  const fetchNews = async (page) => {
    try {

        const response = await axios.get(`/api/v1/realtime/news?page=${page}&limit=${limit}`);

        const data = response.data;

        setNews(data.news);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
};

const fetchAllNews = async()=>{
  try {
    const response = await axios.get(`/api/v1/realtime/allNews`);
  
  } catch (error) {
    console.error("Error fetching news:", error);
  }

}
  useEffect(()=>{
    fetchAllNews();
  },[])

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'tips') {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % financialTips.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeTab, financialTips.length])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Icons */}
      <motion.div
        className="card flex flex-col space-y-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Quick Tools</h2>

        <Link to="./../calculators" className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-secondary-900">Calculators</h3>
            <p className="text-sm text-secondary-500">SIP, Lumpsum, FD, RD</p>
          </div>
        </Link>

        <Link to="../tools" className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center text-success-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-secondary-900">Tools</h3>
            <p className="text-sm text-secondary-500">Special Tools for you</p>
          </div>
        </Link>

        <Link to="../education" className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center text-warning-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-secondary-900">Education</h3>
            <p className="text-sm text-secondary-500">Learn about investing</p>
          </div>
        </Link>

      </motion.div>

      {/* Right Column - Auto-scrolling content */}
      <motion.div
        className="card col-span-1 md:col-span-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex border-b border-secondary-200">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'tips' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
            onClick={() => setActiveTab('tips')}
          >
            Financial Tips
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'news' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-500 hover:text-secondary-700'}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
        </div>

        <div className="p-4 min-h-[250px]">
          {activeTab === 'tips' && (
            <motion.div
              key={currentTipIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{financialTips[currentTipIndex].title}</h3>
                <p className="text-secondary-600">{financialTips[currentTipIndex].content}</p>
              </div>

              <div className="flex justify-center mt-6">
                {financialTips.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 mx-1 rounded-full ${index === currentTipIndex ? 'bg-primary-600' : 'bg-secondary-300'}`}
                    onClick={() => setCurrentTipIndex(index)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-4">
              {/* Title */}
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Latest Financial News
              </h3>

              {/* News List */}
              <ul className="space-y-4">
                {news.map((article, index) => (
                  <li key={index} className="p-4 border rounded-lg shadow-md">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {article.title}
                    </a>
                    
                    <p className="text-sm text-gray-500">
                    {format(new Date(article.pubDate), "EEE, dd MMM yyyy, hh:mm a")} - {article.source}
                  </p>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls */}
              <div className="mt-5 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="text-lg font-semibold">{currentPage} / {totalPages}</span>
                <button
                  className="px-4 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </motion.div >
    </div >
  )
}