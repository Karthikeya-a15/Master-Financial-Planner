import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ScatterChart, Scatter } from "recharts";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const mutualFundsAdmin = () => {
  const [mutualFundsData, setMutualFundsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("totalInvestment");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57'];

  useEffect(() => {
    const fetchMutualFundsData = async () => {
      try {
        const response = await axios.get("/api/v1/admin/mutualfunds");
        setMutualFundsData(response.data.mutualFunds);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchMutualFundsData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6">
      <AdminNavbar />
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  // Calculate total investment and investor count across all funds
  const totalInvestmentSum = mutualFundsData.reduce((sum, fund) => sum + fund.totalInvestment, 0);
  const totalInvestorCount = mutualFundsData.reduce((sum, fund) => sum + fund.investorCount, 0);

  // Calculate average investment per investor for each fund
  const dataWithAverage = mutualFundsData.map(fund => ({
    ...fund,
    averageInvestment: fund.investorCount > 0 ? fund.totalInvestment / fund.investorCount : 0
  }));

  // Prepare data for pie chart
  const pieData = mutualFundsData.map((fund, index) => ({
    name: fund._id,
    value: selectedMetric === "totalInvestment" ? fund.totalInvestment : fund.investorCount,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mutual Funds Analysis</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-md ${selectedMetric === "totalInvestment" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setSelectedMetric("totalInvestment")}
              >
                Total Investment
              </button>
              <button 
                className={`px-4 py-2 rounded-md ${selectedMetric === "investorCount" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setSelectedMetric("investorCount")}
              >
                Investor Count
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Investment</h3>
              <p className="text-3xl font-bold text-blue-600">₹{totalInvestmentSum.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Total Investors</h3>
              <p className="text-3xl font-bold text-green-600">{totalInvestorCount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Investment & Investor Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mutualFundsData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name) => name === "Total Investment" ? `$${value.toLocaleString()}` : value.toLocaleString()} />
                <Legend />
                <Bar yAxisId="left" dataKey="totalInvestment" fill="#4A90E2" name="Total Investment" />
                <Bar yAxisId="right" dataKey="investorCount" fill="#F5A623" name="Investor Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Distribution by {selectedMetric === "totalInvestment" ? "Investment Amount" : "Investor Count"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => selectedMetric === "totalInvestment" ? `$${value.toLocaleString()}` : value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart for Average Investment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Average Investment per Investor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataWithAverage} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="averageInvestment" stroke="#8884d8" activeDot={{ r: 8 }} name="Avg Investment" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Investment vs Investor Correlation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="investorCount" name="Investors" tick={{ fontSize: 12 }} />
                <YAxis type="number" dataKey="totalInvestment" name="Investment" tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [`${value.toLocaleString()}`, name]} />
                <Scatter name="Funds" data={mutualFundsData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Representation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Fund Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Fund Name</th>
                  <th className="border border-gray-300 p-3 text-left">Total Investment</th>
                  <th className="border border-gray-300 p-3 text-left">Investor Count</th>
                  <th className="border border-gray-300 p-3 text-left">Avg. Investment</th>
                </tr>
              </thead>
              <tbody>
                {dataWithAverage.map((fund) => (
                  <tr key={fund._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 font-medium">{fund._id}</td>
                    <td className="border border-gray-300 p-3">₹{fund.totalInvestment.toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">{fund.investorCount.toLocaleString()}</td>
                    <td className="border border-gray-300 p-3">₹{fund.averageInvestment.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default mutualFundsAdmin;
