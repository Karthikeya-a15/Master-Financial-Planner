import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function Cryptocurrency({ formatCurrency, refreshData }) {
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchCrypto() {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/networth/cryptoCurrency");
      setCryptoData(response.data.cryptoCurrency);
      setEditedData(response.data.cryptoCurrency);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setError("Failed to load cryptocurrency data. Please try again later.");
      setLoading(false);
      toast.error("Failed to load cryptocurrency data");
    }
  }

  useEffect(() => {
    fetchCrypto();
  }, []);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setEditedData(cryptoData); // Reset to original data
    setIsEditing(false);
  };

  const handleChange = (key, value) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/v1/networth/cryptoCurrency", editedData);
      setCryptoData(editedData);
      refreshData();
      setIsEditing(false);
      toast.success("Cryptocurrency data updated successfully!");
    } catch (error) {
      console.error("Error updating cryptocurrency data:", error);
      toast.error("Failed to update cryptocurrency data");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
        <button onClick={fetchCrypto} className="mt-2 btn btn-danger">
          Try Again
        </button>
      </div>
    );
  }

  const totalAmount = Object.values(cryptoData).reduce((sum, value) => sum + value, 0);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-secondary-900">Crypto Currency</h2>
          {!isEditing && (
            <button onClick={handleEditClick} className="btn btn-primary">
              Edit
            </button>
          )}
        </div>

        {/* Crypto Input */}
        <div className="space-y-3">
          {Object.entries(editedData).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span className="text-secondary-800 capitalize">Crypto </span>
              {isEditing ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(key, Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                />
              ) : (
                <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-between items-center border-t pt-4">
          <h3 className="text-lg font-semibold text-secondary-700">Total</h3>
          <span className="text-2xl font-bold text-green-700">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={handleCancelClick} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
