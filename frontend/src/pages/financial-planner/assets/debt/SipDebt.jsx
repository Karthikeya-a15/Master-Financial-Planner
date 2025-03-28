import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { PieChart } from '@mui/x-charts';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

const CATEGORY_OPTIONS = ["FD/RD/Arbitrage", "Banking PSUs/Corporate funds", "Government securities/Equity Saver"];
const COLORS = {
    "FD/RD/Arbitrage": "#0088FE",
    "Banking PSUs/Corporate funds": "#00C49F",
    "Government securities/Equity Saver": "#FFBB28",
    default: "#DDDDDD",
};

export default function SipDebt({
    formatCurrency,
    debtData,
    editedData,
    setEditedData,
    handleSave,
    goalsData
}) {
    const section = 'sipDebt';
    const debtTotal = goalsData?.sipAssetAllocation.debt || 0;

    const debtAmounts = goalsData?.sipAmountDistribution || [];
    console.log(debtAmounts)
    const timePeriods = goalsData?.goals.map((goal) => goal.time);
    console.log(timePeriods)

    const requiredContribution = useMemo(() => {
        const contribution = {
            "FD/RD/Arbitrage": 0,
            "Banking PSUs/Corporate funds": 0,
            "Government securities/Equity Saver": 0
        };

        for (let i = 0; i < debtAmounts.length; i++) {
            const time = timePeriods[i];
            if (time < 3) {
                contribution["FD/RD/Arbitrage"] += debtAmounts[i].debt;
            } else if (time < 7) {
                contribution["Banking PSUs/Corporate funds"] += debtAmounts[i].debt;
            } else {
                contribution["Government securities/Equity Saver"] += debtAmounts[i].debt;
            }
        }

        return contribution;
    }, [debtAmounts, timePeriods]);

    const [showAddSipForm, setShowAddSipForm] = useState(false);
    const [newSip, setNewSip] = useState({
        name: '',
        duration: CATEGORY_OPTIONS[0],
        currentValue: 0,
    });
    const [editingSipIndex, setEditingSipIndex] = useState(null);

    // Add a new SIP Debt
    const handleAddSip = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newSip],
        }));
        setShowAddSipForm(false);
        setNewSip({ name: '', duration: CATEGORY_OPTIONS[0], currentValue: 0 });
        toast.success('SIP Debt added successfully');
    }, [newSip, setEditedData]);

    // Delete a SIP Debt
    const handleDeleteSip = useCallback((index) => {
        if (confirm('Are you sure you want to delete this SIP Debt?')) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]];
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success('SIP Debt deleted successfully');
        }
    }, []);

    // Handle changes in the input fields
    const handleChange = (index, field, value) => {
        setEditedData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy to avoid mutation issues
            const parsedValue = field === 'currentValue' ? parseFloat(value) || 0 : value;
            newData[section][index] = {
                ...newData[section][index],
                [field]: parsedValue,
            };
            return newData;
        });
    };

    // Save changes for a specific SIP Debt
    const handleSipSave = (index) => {
        setEditedData((prevData) => {
            const updatedSips = [...prevData[section]];
            updatedSips[index] = { ...editedData[section][index] };
            return {
                ...prevData,
                [section]: updatedSips,
            };
        });
        setEditingSipIndex(null);
        toast.success('SIP Debt updated successfully');
    };

    // Cancel editing or adding a SIP Debt
    const handleCancelEdit = () => {
        setEditingSipIndex(null);
        setShowAddSipForm(false);
        setEditedData(debtData);
        setNewSip({ name: '', duration: CATEGORY_OPTIONS[0], currentValue: 0 });
    };

    // Calculate summary data for the pie chart
    const summaryData = editedData[section].reduce((acc, { duration, currentValue }) => {
        acc[duration] = (acc[duration] || 0) + currentValue;
        return acc;
    }, {});

    const totalValue = Object.values(summaryData).reduce((sum, val) => sum + val, 0);
    const chartData = Object.entries(summaryData).map(([duration, value]) => ({
        duration: duration.replace(/\b(\w)/g, (c) => c.toUpperCase()),
        value,
        contribution: Number(((value / totalValue) * 100).toFixed(1)),
        RequiredContribution: Number(((requiredContribution[duration] / debtTotal) * 100).toFixed(1)),
        color: COLORS[duration] || COLORS.default,
    }));


    const sumOfSips = editedData[section].reduce((acc, { currentValue }) => {
        return acc + currentValue || 0;
    }, 0);

    if (!debtData) return <LoadingSpinner />;

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">SIP Debt</h3>

            {/* Pie Chart */}
            <div className="flex flex-row items-center">
                <PieChart
                    series={[
                        {
                            data: chartData.map(({ duration, contribution, color }) => ({
                                id: duration,
                                value: parseFloat(contribution),
                                label: duration,
                                color: color,
                            })),
                            innerRadius: 60,
                            outerRadius: 120,
                        },
                    ]}
                    slotProps={{
                        legend: {
                            direction: 'column',
                            position: { vertical: 'middle', horizontal: 'right' },
                        },
                        tooltip: {
                            formatter: (params) => `${params.label}: ${params.value}%`,
                        },
                    }}
                    width={800}
                    height={250}
                />
            </div>

            {/* Contribution Table */}
            <div className="flex justify-center">
                <table className="w-1/2 text-sm border-collapse border border-gray-200 mt-2">
                    <thead>
                        <tr className="bg-gray-100 text-secondary-800">
                            <th className="border px-2 py-1 w-3/6">Duration</th>
                            <th className="border px-4 py-1 w-2/6">Value</th>
                            <th className="border px-2 py-1 w-1/6 text-right">Contribution (%)</th>
                            <th className="border px-2 py-1 w-1/6 text-right">Required Contribution (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map(({ duration, value, contribution, RequiredContribution }, index) => (
                            <tr key={index} className="border border-gray-200">
                                <td className="border px-2 py-1">{duration}</td>
                                <td className="border px-4 py-1 text-green-700 w-2/6">{formatCurrency(value)}</td>
                                <td className="border px-2 py-1 text-green-700 text-right w-1/6">{contribution}%</td>
                                <td className="border px-2 py-1 text-green-700 text-right w-1/6">{RequiredContribution}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <hr className="w-full border-t border-gray-300 my-10" />

            {/* Add SIP Debt Form */}
            {showAddSipForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add New SIP Debt</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input"
                                    value={newSip.name}
                                    onChange={(e) => setNewSip({ ...newSip, name: e.target.value })}
                                    placeholder="e.g., Ujivan Bank FD"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration" className="form-label">Duration</label>
                                <select
                                    id="duration"
                                    className="input"
                                    value={newSip.duration}
                                    onChange={(e) => setNewSip({ ...newSip, duration: e.target.value })}
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
                                    value={newSip.currentValue}
                                    onChange={(e) => setNewSip({ ...newSip, currentValue: Number(e.target.value) })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowAddSipForm(false)} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleAddSip}
                                className="btn btn-primary"
                                disabled={!newSip.name || newSip.currentValue <= 0}
                            >
                                Add SIP Debt
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* SIP Debts List */}
            {editedData[section].length > 0 ? (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Your SIP Debts</h2>
                    <div className="overflow-x-auto">
                        <div className='float-right'>
                            {sumOfSips > debtTotal ? <span className='text-red-600'>You Don't have Enough Money</span> : <></>}
                        </div>
                        <br />
                        <div className='float-right'>
                            <b>Max Amount: {formatCurrency(debtTotal)}</b>
                        </div>
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Duration
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
                                {editedData[section].map((sip, index) => (
                                    <tr key={index} className={editingSipIndex === index ? 'bg-primary-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingSipIndex === index ? (
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={sip.name}
                                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{sip.name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingSipIndex === index ? (
                                                <select
                                                    className="input"
                                                    value={sip.duration}
                                                    onChange={(e) => handleChange(index, 'duration', e.target.value)}
                                                >
                                                    {CATEGORY_OPTIONS.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="text-sm text-secondary-900">{sip.duration}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingSipIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={sip.currentValue}
                                                    onChange={(e) => handleChange(index, 'currentValue', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(sip.currentValue)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingSipIndex === index ? (
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={() => handleSipSave(index)}
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
                                                        onClick={() => setEditingSipIndex(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSip(index)}
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
                        <button onClick={() => setShowAddSipForm(true)} className="btn btn-primary mt-4">Add SIP Debt</button>
                        {!showAddSipForm && (
                            <button onClick={() => handleSave(section)} className="btn btn-success m-4">Save</button>
                        )}
                    </div>
                </motion.div>
            ) : (
                !showAddSipForm && (
                    <motion.div
                        className="card text-center py-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <svg
                            className="w-16 h-16 text-secondary-400 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            ></path>
                        </svg>
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No SIP Debts yet</h3>
                        <p className="text-secondary-600 mb-6">Start by adding your first SIP Debt</p>
                        <button onClick={() => setShowAddSipForm(true)} className="btn btn-primary">
                            Add Your First SIP Debt
                        </button>
                    </motion.div>
                )
            )}
        </div>
    );
}