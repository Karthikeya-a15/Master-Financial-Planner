import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import LoadingSpinner from "../../../components/common/LoadingSpinner";


export default function CashFlows({ formatCurrency, refreshData }) {
    const [cashflowData, setCashflowData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);

    const fetchCashFlows = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/v1/networth/cashFlows");
            setCashflowData(response.data.cashFlows);
            setEditedData(response.data.cashFlows);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cash flow data:", error);
            setError("Failed to load cash flow data. Please try again later.");
            setLoading(false);
            toast.error("Failed to load cash flow data");
        }
    };

    useEffect(() => {
        fetchCashFlows();
    }, []);

    const handleEditClick = () => setIsEditing(true);
    const handleCancelClick = () => {
        setEditedData(cashflowData); // Reset to original data
        setIsEditing(false);
    };

    const handleChange = (section, key, value) => {
        setEditedData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        try {
            await axios.put("/api/v1/networth/cashFlows", editedData);
            setCashflowData(editedData);
            refreshData();
            setIsEditing(false);
            toast.success("Cash flow data updated successfully!");
        } catch (error) {
            console.error("Error updating cash flow data:", error);
            toast.error("Failed to update cash flow data");
        }
    };

    if (loading) {
        return <LoadingSpinner/>
    }

    if (error) {
        return (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                <p>{error}</p>
                <button onClick={fetchCashFlows} className="mt-2 btn btn-danger">
                    Try Again
                </button>
            </div>
        );
    }

    // Compute total inflows and outflows
    const inflowsTotal = Object.values(editedData.inflows).reduce((sum, value) => sum + value, 0);
    const outflowsTotal = Object.values(editedData.outflows).reduce((sum, value) => sum + value, 0);
    const investmentSurplus = inflowsTotal - outflowsTotal;

    return (
        <>
            <motion.div
               className="card"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="p-6 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-secondary-900">Cash Flows</h2>
                        {!isEditing && (
                            <button onClick={handleEditClick} className="btn btn-primary">
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Inflows Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-700 mb-2">Inflows</h3>
                            <div className="space-y-3">
                                {Object.entries(editedData.inflows).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                                        <span className="text-secondary-800 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => handleChange("inflows", key, Number(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                                            />
                                        ) : (
                                            <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Outflows Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-secondary-700 mb-2">Outflows</h3>
                            <div className="space-y-3">
                                {Object.entries(editedData.outflows).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                                        <span className="text-secondary-800 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={value}
                                                onChange={(e) => handleChange("outflows", key, Number(e.target.value))}
                                                className="border border-gray-300 rounded px-2 py-1 w-24 text-right"
                                            />
                                        ) : (
                                            <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Investment Surplus Display */}
                    <div className="mt-6 flex justify-between items-center border-t pt-4">
                        <h3 className="text-lg font-semibold text-secondary-700">Investment Surplus</h3>
                        <span
                            className={`text-2xl font-bold ${investmentSurplus < 0 ? "text-red-700" : "text-green-700"
                                }`}
                        >
                            {formatCurrency(investmentSurplus)}
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
        </>
    );
}
