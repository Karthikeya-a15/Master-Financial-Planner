import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import LiquidFund from "./debt/LiquidFunds";
import FixedDeposit from "./debt/FixedDeposits";
import DebtFunds from "./debt/DebtFunds";
import GovernmentInvestments from "./debt/GovernmentInvestments";
import SipDebt from "./debt/SipDebt";

export default function Debt({ formatCurrency, refreshData , goalsData}) {
    const [debtData, setDebtData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editedData, setEditedData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Liquid Funds");

    useEffect(() => {
        async function fetchDebtData() {
            try {
                const response = await axios.get("/api/v1/networth/debt");
                setDebtData(response.data.debt);
                setEditedData(response.data.debt);
            } catch (error) {
                console.error("Error fetching debt data:", error);
                setError("Failed to load debt data.");
                toast.error("Failed to load debt data.");
            } finally {
                setLoading(false);
            }
        }
        fetchDebtData();
    }, []);


    const handleSave = async (section) => {
        try {
            await axios.put("/api/v1/networth/debt", {
                selection: section,
                [section]: editedData[section],
            });
            setDebtData(editedData);
            refreshData();
            setIsEditing(false);
            toast.success(`${section.replace("liquidFund", "Liquid Funds").replace("fixedDeposit", "Fixed Deposits").replace("debtFunds", "Debt Funds").replace("governmentInvestments", "Government Investments").replace("sipDebt","SIP Debt")} updated successfully!`);
        } catch (error) {
            console.error(`Error updating ${section}:`, error);
            toast.error(`Failed to update ${section}`);
        }
    };


    const renderComponent = () => {
        switch (selectedOption) {
            case 'Liquid Funds':
                return <LiquidFund  formatCurrency = {formatCurrency}
                debtData = {debtData}
                editedData = {editedData}
                setEditedData = {setEditedData}
                handleSave = {handleSave}
                />
            case 'Fixed Deposits':
                return <FixedDeposit  formatCurrency = {formatCurrency}
                debtData = {debtData}
                editedData = {editedData}
                setEditedData = {setEditedData}
                handleSave = {handleSave}
                />
            case 'Debt Funds':
                return <DebtFunds  formatCurrency = {formatCurrency}
                debtData = {debtData}
                editedData = {editedData}
                setEditedData = {setEditedData}
                handleSave = {handleSave}
                />
            case 'Government Investments':
                return <GovernmentInvestments  formatCurrency = {formatCurrency}
                debtData = {debtData}
                editedData = {editedData}
                setEditedData = {setEditedData}
                handleSave = {handleSave}
                />
            case 'SIP Debt':
                return <SipDebt formatCurrency = {formatCurrency}
                debtData = {debtData}
                editedData = {editedData}
                setEditedData = {setEditedData}
                handleSave = {handleSave}
                goalsData = {goalsData}
                />
            default:
                return null;
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-danger-700 p-4 bg-danger-50 border border-danger-200 rounded-lg">{error}</div>;

    return (
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold text-secondary-900 mb-8">Domestic Equity</h2>
                <div className="mb-4">
                    <b >Selection : </b>
                    <select
                        className="p-2 border rounded-md"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <option value="Liquid Funds">Liquid Funds</option>
                        <option value="Fixed Deposits">Fixed Deposits</option>
                        <option value="Debt Funds">Debt Funds</option>
                        <option value="Government Investments">Government Investments</option>
                        <option value="SIP Debt">SIP Debt</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {renderComponent()}
                </div>
            </div>
        </motion.div>
    );
}