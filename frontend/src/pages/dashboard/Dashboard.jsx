import { useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import FireCalculator from '../../components/dashboard/FireCalculator'
import InfoTools from '../../components/dashboard/InfoTools'
import BlogSection from '../../components/dashboard/BlogSection'

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard | Darw-Invest'
  }, [])

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Welcome to Darw-Invest</h1>
            <p className="mt-1 text-secondary-600">Your personal financial planning dashboard</p>
          </div>
          
          <FireCalculator />
          
          <InfoTools />
          
          <BlogSection />
        </div>
      </main>
    </div>
  )
}