import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { PieChart } from '@mui/x-charts/PieChart';
import { useAdminAuth } from "./AdminAuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {logout} = useAdminAuth();

  useEffect(() => {
    document.title = 'Dashboard | DarwInvest'
    fetchDashboardData();
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/v1/admin/dashboard");
      setDashboardData(response.data);
    //   console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      setLoading(false);
      toast.error("Failed to load dashboard data");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 btn btn-danger"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const componentUsageData = {
    labels:
      (dashboardData.componentStats.length > 0 &&
        dashboardData?.componentStats.map((stat) => stat._id)) ||
      [],
    datasets: [
      {
        label: "Usage Count",
        data: dashboardData?.componentStats.map((stat) => stat.count) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(34, 197, 94, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(239, 68, 68, 0.5)",
          "rgba(168, 85, 247, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(168, 85, 247)",
        ],
        borderWidth: 1,
      },
    ],
  };


  const investmentData = dashboardData?.investmentDistribution
  .filter((dist) => dist.totalAmount >= 0) 
  .map((dist, index) => ({
    id: index,
    value: dist.totalAmount,
    label: dist._id,
  }));

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-secondary-600">
                Monitor user activity and investment trends
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
              className="btn btn-secondary"
            >
              Sign Out
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-2">Total Users</h2>
              <p className="text-3xl font-bold">{dashboardData?.totalUsers}</p>
            </motion.div>

            {/* Add more stat cards here */}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-6">
                Component Usage
              </h2>
              <Bar data={componentUsageData} />
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-6">
                Investment Distribution
              </h2>
              <PieChart
                series={[
                  {
                    data: investmentData,
                  },
                ]}
                height={300}
              />
            </motion.div>
          </div>

          {/* Add more sections for mid-cap analysis and news management */}
        </div>
      </div>
    </div>
  );
}
