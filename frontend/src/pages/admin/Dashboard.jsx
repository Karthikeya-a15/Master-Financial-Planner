import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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
import { PieChart } from "@mui/x-charts/PieChart";
import { useAdminAuth } from "./AdminAuthContext";
import AdminNavbar from "./AdminNavbar";

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
  const [userEngagementData, setUserEngagementData] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: "",
    description: ""
  });


  useEffect(() => {
    document.title = "Dashboard | DarwInvest";
    fetchDashboardData();
    // fetchUserEnagementData();
  }, []);

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

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setRoomForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/v1/admin/rooms", roomForm);
      
      toast.success("Room created successfully!");
      setRoomForm({ name: "", description: "" });
      setShowRoomForm(false);
      
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error.response?.data?.message || "Failed to create room");
      setRoomCreationStatus("error");
    } finally {
      setLoading(false);
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

  const investmentData = dashboardData?.investmentDistribution
    .filter((dist) => dist.totalAmount >= 0)
    .map((dist, index) => ({
      id: index,
      value: dist.totalAmount,
      label: dist._id,
    }));

  return (
    <div className="min-h-screen bg-secondary-50">
      <AdminNavbar />
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
            <div>
            <button
                onClick={() => setShowRoomForm(!showRoomForm)}
                className="btn btn-primary"
              >
                Create New Room
            </button>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            
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

          {/* Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/admin/analytics/user-engagement")}
              className="btn btn-primary w-full"
            >
              User Engagement
            </button>
            <button
              onClick={() => navigate("/admin/analytics/goals")}
              className="btn btn-primary w-full"
            >
              Goals
            </button>
            <button
              onClick={() => navigate("/admin/mutualfunds")}
              className="btn btn-primary w-full"
            >
              Mutual Funds
            </button>
          </div>
        </div>
      </div>
        
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${showRoomForm ? 'visible' : 'hidden'}`}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-96"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        exit={{ y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Create New Room</h2>
        <form onSubmit={handleRoomSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Room Name
              </label>
              <input
                type="text"
                name="name"
                value={roomForm.name}
                onChange={handleRoomInputChange}
                className="input w-full"
                required
                minLength={3}
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={roomForm.description}
                onChange={handleRoomInputChange}
                className="textarea w-full"
                rows={3}
                required
                minLength={10}
                maxLength={500}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Room"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={()=>{ setShowRoomForm(false); setRoomForm({name : "" , description : ""})}}
              >
                Cancel
              </button>
             
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
    
    </div>
  );
}
