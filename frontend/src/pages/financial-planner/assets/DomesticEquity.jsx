import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import DirectStocks from './equity/DirectStocks';

const CATEGORY_OPTIONS = ["large cap", "mid cap", "small cap", "flexi/multi cap"];
const COLORS = {
    "large cap": "#0088FE",
    "mid cap": "#00C49F",
    "small cap": "#FFBB28",
    "flexi cap": "#FF8042",
    "multi cap": "#A28DFF",
    default: "#DDDDDD",
};

export default function DomesticEquity({ formatCurrency, refreshData }) {
    const [equityData, setEquityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchEquityData() {
            try {
                const response = await axios.get("/api/v1/networth/domesticEquity");
                setEquityData(response.data.domesticEquity);
                setEditedData(response.data.domesticEquity);
            } catch (error) {
                console.error("Error fetching domestic equity data:", error);
                setError("Failed to load domestic equity data.");
                toast.error("Failed to load domestic equity data.");
            } finally {
                setLoading(false);
            }
        }
        fetchEquityData();
    }, []);

    const handleChange = (section, index, key, value) => {
        setEditedData((prev) => {
            const updatedSection = [...prev[section]];
            updatedSection[index] = { ...updatedSection[index], [key]: value };
            return { ...prev, [section]: updatedSection };
        });
    };


    const handleSave = async (section) => {
        try {
            await axios.put("/api/v1/networth/domesticEquity", {
                selection: section,
                [section]: editedData[section],
            });
            setEquityData(editedData);
            refreshData();
            setIsEditing(false);
            toast.success(`${section.replace("mutualFunds", "Mutual Funds").replace("directStocks", "Direct Stocks").replace("sipEquity", "SIP Equity")} updated successfully!`);
        } catch (error) {
            console.error(`Error updating ${section}:`, error);
            toast.error(`Failed to update ${section}`);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-danger-700 p-4 bg-danger-50 border border-danger-200 rounded-lg">{error}</div>;

    return (
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Domestic Equity</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <DirectStocks
                        formatCurrency={formatCurrency}
                        equityData={equityData}
                        editedData={editedData}
                        setEditedData={setEditedData}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
                        COLORS={COLORS}
                        handleSave={handleSave}
                    />
                    {/* Add other components like MutualFunds and SipEquity here */}
                </div>
            </div>
        </motion.div>
    );
}