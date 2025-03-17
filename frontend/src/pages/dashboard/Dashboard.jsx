import { useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import InfoTools from '../../components/dashboard/InfoTools'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { FaFire } from 'react-icons/fa'

export default function Dashboard() {
  const { currentUser } = useAuth()

  useEffect(() => {
    document.title = 'Dashboard | DarwInvest'
  }, [])

  const formatFireNumber = (number) => {
    if (!number) return 'N/A'

    if (number >= 10000000) {
      return `₹ ${(number / 10000000).toFixed(2)} Cr`
    } else if (number >= 100000) {
      return `₹ ${(number / 100000).toFixed(2)} L` 
    }
    return `₹ ${number.toLocaleString('en-IN')}`
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Welcome to Darw-Invest</h1>
            <p className="mt-1 text-secondary-600">Your personal financial planning dashboard</p>
          </div>

          {/* FIRE Number Display Section */}

          {(
            <Link to="/calculators/fire" className="block transform transition-all duration-300 hover:scale-105 hover:brightness-110">
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8 rounded-xl shadow-lg flex justify-between items-center text-white border border-white/30 backdrop-blur-md bg-opacity-90 cursor-pointer">
                <div className="text-2xl md:text-3xl font-semibold tracking-wide">🔥 FIRE NUMBER:</div>
                <div className="flex items-center gap-4 text-3xl md:text-4xl font-extrabold">
                  <FaFire className="text-yellow-400 text-5xl animate-pulse" />
                  {formatFireNumber(currentUser?.fire || 0)}
                </div>
              </div>
            </Link>
          )}


          <InfoTools />
        </div>
      </main>
    </div>
  )
}
