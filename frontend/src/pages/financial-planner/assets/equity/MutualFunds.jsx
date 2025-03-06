import { useState, useCallback } from "react";
import { PieChart } from "@mui/x-charts";
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

export default function MutualFunds({
    formatCurrency,
    equityData,
    editedData,
    setEditedData,
    CATEGORY_OPTIONS,
    COLORS,
    handleSave,
}) {
    const section = "mutualFunds";
    const [showAddFundForm, setShowAddFundForm] = useState(false);
    const [newFund, setNewFund] = useState({
        fundName: "",
        category: CATEGORY_OPTIONS[0],
        currentValue: 0,
    });
    const [editingFundIndex, setEditingFundIndex] = useState(null);

    if (!equityData) return <LoadingSpinner />;

    const handleAddFund = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newFund],
        }));
        setShowAddFundForm(false);
        setNewFund({ fundName: "", category: CATEGORY_OPTIONS[0], currentValue: 0 });
        toast.success("Fund added successfully");
    }, [newFund]);

    const handleDeleteFund = useCallback((index) => {
        if (confirm("Are you sure you want to delete this fund?")) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]];
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success("Fund deleted successfully");
        }
    }, []);

    const handleChange = (index, field, value) => {
        setEditedData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            
            const parsedValue = field === 'currentValue' ? parseFloat(value) || 0 : value;

            newData[section][index] = { ...newData[section][index], [field]: parsedValue };
            return newData;
        });
    };

    const handleFundSave = (index) => {
        setEditedData((prevData) => {
            const updatedFunds = [...prevData[section]];
            
            updatedFunds[index] = { ...editedData[section][index] };
            
            return {
                ...prevData,
                [section]: updatedFunds,
            };
        });  
        setEditingFundIndex(null);
        toast.success("Fund updated successfully");
    };

    const handleCancelEdit = () => {
        setEditingFundIndex(null);
        setShowAddFundForm(false);
        setEditedData(equityData);
        setNewFund({ fundName: "", category: CATEGORY_OPTIONS[0], currentValue: 0 });
    };

    const summaryData = editedData[section].reduce((acc, { category, currentValue }) => {
        acc[category] = (acc[category] || 0) + currentValue;
        return acc;
    }, {});

    const totalValue = Object.values(summaryData).reduce((sum, val) => sum + val, 0);
    const chartData = Object.entries(summaryData).map(([category, value]) => ({
        category: category.replace(/\b(\w)/g, (c) => c.toUpperCase()),
        value,
        contribution: Number(((value / totalValue) * 100).toFixed(1)),
        color: COLORS[category] || COLORS.default,
    }));

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">Mutual Funds</h3>
            <div className="flex flex-row items-center">
                <PieChart
                    series={[{
                        data: chartData.map(({ category, contribution, color }) => ({
                            id: category,
                            value: parseFloat(contribution),
                            label: category,
                            color,
                        })),
                        innerRadius: 50,
                        outerRadius: 100,
                    }]}
                    slotProps={{
                        legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                        },
                        tooltip: {
                            formatter: (params) => `${params.label}: ${params.value}%`,
                        },
                    }}
                    width={500}
                    height={250}
                />
            </div>



            <div className="flex justify-center">
                <table className="w-3/4 text-sm border-collapse border border-gray-200 mt-2">
                    <thead>
                        <tr className="bg-gray-100 text-secondary-800">
                            <th className="border px-2 py-1">Category</th>
                            <th className="border px-2 py-1">Value</th>
                            <th className="border px-2 py-1">Contribution (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map(({ category, value, contribution }, index) => (
                            <tr key={index} className="border border-gray-200">
                                <td className="border px-2 py-1">{category}</td>
                                <td className="border px-2 py-1 text-green-700">{formatCurrency(value)}</td>
                                <td className="border px-2 py-1 text-green-700">{contribution}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr className="w-full border-t border-gray-300 my-10" />
            
            {showAddFundForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <motion.div 
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add New Mutual Fund</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="fundName" className="form-label">Fund Name</label>
                                <input
                                    type="text"
                                    id="fundName"
                                    className="input"
                                    value={newFund.fundName}
                                    onChange={(e) => setNewFund({ ...newFund, fundName: e.target.value })}
                                    placeholder="e.g., SBI Bluechip, Axis Growth"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    id="category"
                                    className="input"
                                    value={newFund.category}
                                    onChange={(e) => setNewFund({ ...newFund, category: e.target.value })}
                                >
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="currentValue" className="form-label">Current Value</label>
                                <input
                                    type="number"
                                    id="currentValue"
                                    className="input"
                                    value={newFund.currentValue}
                                    onChange={(e) => setNewFund({ ...newFund, currentValue: Number(e.target.value) })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowAddFundForm(false)} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleAddFund}
                                className="btn btn-primary"
                                disabled={!newFund.fundName || newFund.currentValue <= 0}
                            >
                                Add Fund
                            </button>
                        </div>
                        </motion.div>
                    </div>
                )}
            <div key={section} className="space-y-8">

                {/* Mutual Funds List */}
                {editedData[section].length > 0 ? (
                        <motion.div
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Your Mutual Funds</h2>
                        <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                        <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Mutual Fund Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Current Value
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-secondary-200">
                                {editedData[section].map((fund, index) => (
                                    <tr key={index} className={editingFundIndex === index ? 'bg-primary-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingFundIndex === index ? (
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={fund.fundName}
                                                    onChange={(e) => handleChange(index, 'fundName', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{fund.fundName}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingFundIndex === index ? (
                                                <select
                                                    className="input"
                                                    value={fund.category}
                                                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                                                >
                                                    {CATEGORY_OPTIONS.map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="text-sm text-secondary-900">{fund.category}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingFundIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={fund.currentValue}
                                                    onChange={(e) => handleChange(index, 'currentValue', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(fund.currentValue)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingFundIndex === index ? (
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={() => handleFundSave(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="text-secondary-600 hover:text-secondary-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-4 justify-end">
                                                    <button
                                                        onClick={() => setEditingFundIndex(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFund(index)}
                                                        className="text-danger-600 hover:text-danger-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        <button onClick={() => setShowAddFundForm(true)} className="btn btn-primary mt-4">Add Mutual Fund</button>
                        {!showAddFundForm ? 
                        <button onClick={() => handleSave("mutualFunds")} className="btn btn-success m-4">Save</button>
                        :
                            <></>
                        }

                        </div>
                    </motion.div>
                ) : (
                    !showAddFundForm && (
                        <motion.div className="card text-center py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                            <h3 className="text-lg font-medium text-secondary-900 mb-2">No mutual funds yet</h3>
                            <p className="text-secondary-600 mb-6">Start by adding your first mutual fund</p>
                            <button onClick={() => setShowAddFundForm(true)} className="btn btn-primary">Add Your First Fund</button>
                        </motion.div>
                    )
                )}
            </div>
        </div>
    );
}
