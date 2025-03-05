import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function Miscellaneous({ formatCurrency, refreshData }) {
  const [miscData, setMiscData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchMiscellaneous() {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/networth/miscellaneous");
      setMiscData(response.data.miscellaneous);
      setEditedData(response.data.miscellaneous);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching miscellaneous data:", error);
      setError("Failed to load miscellaneous data. Please try again later.");
      setLoading(false);
      toast.error("Failed to load miscellaneous data");
    }
  }

  useEffect(() => {
    fetchMiscellaneous();
  }, []);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setEditedData(miscData); // Reset to original data
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
      await axios.put("/api/v1/networth/miscellaneous", editedData);
      setMiscData(editedData);
      refreshData();
      setIsEditing(false);
      toast.success("Miscellaneous data updated successfully!");
    } catch (error) {
      console.error("Error updating miscellaneous data:", error);
      toast.error("Failed to update miscellaneous data");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
        <button onClick={fetchMiscellaneous} className="mt-2 btn btn-danger">
          Try Again
        </button>
      </div>
    );
  }

  const totalAmount = Object.values(miscData).reduce((sum, value) => sum + value, 0);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-secondary-900">Miscellaneous Assets</h2>
          {!isEditing && (
            <button onClick={handleEditClick} className="btn btn-primary">
              Edit
            </button>
          )}
        </div>

        {/* Miscellaneous Inputs */}
        <div className="space-y-3">
          {Object.entries(editedData).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span className="text-secondary-800 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
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
