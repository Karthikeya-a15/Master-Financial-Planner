import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const mutualFunds = () => {
  const [mutualFundsData, setmutualFundsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchmutualFundsData = async () => {
      try {
        const response = await axios.get("/api/v1/admin/mutualfunds", {
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem("adminToken")}`
            }
        });
        // console.log(response.data.mutualFunds);
        setmutualFundsData(response.data.mutualFunds);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchmutualFundsData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <AdminNavbar/>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-secondary-900 mb-6">Mutual Funds Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mutualFundsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="_id" tick={{ fontSize: 12 }} angle={-10} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalInvestment" fill="#4A90E2" name="Total Investment" />
            <Bar dataKey="investorCount" fill="#F5A623" name="Investor Count" />
          </BarChart>
        </ResponsiveContainer>

        {/* Table Representation */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-secondary-300">
            <thead>
              <tr className="bg-secondary-100">
                <th className="border border-secondary-300 p-2 text-left">Fund Name</th>
                <th className="border border-secondary-300 p-2 text-left">Total Investment</th>
                <th className="border border-secondary-300 p-2 text-left">Investor Count</th>
              </tr>
            </thead>
            <tbody>
              {mutualFundsData.map((fund) => (
                <tr key={fund._id} className="border border-secondary-300">
                  <td className="border border-secondary-300 p-2">{fund._id}</td>
                  <td className="border border-secondary-300 p-2">${fund.totalInvestment.toLocaleString()}</td>
                  <td className="border border-secondary-300 p-2">{fund.investorCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default mutualFunds;
