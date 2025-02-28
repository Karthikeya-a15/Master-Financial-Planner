import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary-50">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold text-secondary-900 mt-4">Page Not Found</h2>
        <p className="text-secondary-600 mt-2 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn btn-primary">
            Go to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  )
}