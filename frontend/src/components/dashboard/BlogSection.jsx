import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BlogSection() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "How to start investing with just ₹500 per month",
      author: "Priya Sharma",
      date: "June 1, 2025",
      content: "Many people think investing requires large sums of money, but that's not true. You can start with as little as ₹500 per month through SIPs in mutual funds...",
      likes: 42,
      comments: 15
    },
    {
      id: 2,
      title: "Understanding the power of compound interest",
      author: "Rahul Verma",
      date: "May 28, 2025",
      content: "Albert Einstein once called compound interest the eighth wonder of the world. Here's why it's so powerful and how you can harness it for your financial goals...",
      likes: 38,
      comments: 12
    },
    {
      id: 3,
      title: "Emergency fund: Why you need one and how to build it",
      author: "Ananya Patel",
      date: "May 25, 2025",
      content: "An emergency fund is your financial safety net. It helps you handle unexpected expenses without going into debt. Here's how to build one step by step...",
      likes: 29,
      comments: 8
    }
  ])
  
  const trendingTopics = [
    "Retirement Planning",
    "Tax-saving Investments",
    "Stock Market Basics",
    "Real Estate vs Mutual Funds",
    "Cryptocurrency Investing"
  ]
  
  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-secondary-900">Financial Discussions</h2>
        <button className="btn btn-primary text-sm">Start a Discussion</button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="border-b border-secondary-200 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors">
                  <a href="#">{post.title}</a>
                </h3>
                <div className="flex items-center text-sm text-secondary-500 mt-1">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
                <p className="mt-2 text-secondary-600">{post.content}</p>
                <div className="flex items-center mt-4 space-x-4">
                  <button 
                    className="flex items-center text-secondary-500 hover:text-primary-600 transition-colors"
                    onClick={() => handleLike(post.id)}
                  >
                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                    <span>{post.likes}</span>
                  </button>
                  <a href="#" className="flex items-center text-secondary-500 hover:text-primary-600 transition-colors">
                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span>{post.comments} comments</span>
                  </a>
                  <a href="#" className="flex items-center text-secondary-500 hover:text-primary-600 transition-colors">
                    <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    <span>Share</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="btn btn-secondary">View More Discussions</button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-secondary-50 rounded-lg p-4">
            <h3 className="font-semibold text-secondary-900 mb-4">Trending Topics</h3>
            <ul className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <li key={index}>
                  <a href="#" className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors">
                    <span className="text-xs bg-secondary-200 text-secondary-700 rounded-full w-5 h-5 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    {topic}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="mt-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Join Our Community</h3>
              <p className="text-sm text-secondary-600 mb-4">Connect with like-minded investors and learn from experts.</p>
              <button className="btn btn-primary w-full text-sm">Join Now</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}