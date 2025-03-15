import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PieChart } from '@mui/x-charts';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import { useGoals } from '../../../../contexts/GoalsContext';

export default function SipEquity({
    formatCurrency,
    equityData,
    editedData,
    setEditedData,
    CATEGORY_OPTIONS,
    COLORS,
    handleSave,
    goalsData
}) {
    const section = 'sipEquity';
    const [domesticEquity, setDomesticEquity] = useState(goalsData?.sipAssetAllocation.domesticEquity || 0);

    const [showAddSipForm, setShowAddSipForm] = useState(false);
    const [newSip, setNewSip] = useState({
        sipName: '',
        category: CATEGORY_OPTIONS[0],
        sip: 0,
    });
    const [editingSipIndex, setEditingSipIndex] = useState(null);

    // Add a new SIP
    const handleAddSip = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newSip],
        }));
        setShowAddSipForm(false);
        setNewSip({ sipName: '', category: CATEGORY_OPTIONS[0], sip: 0 });
        toast.success('SIP added successfully');
    }, [newSip]);

    // Delete a SIP
    const handleDeleteSip = useCallback((index) => {
        if (confirm('Are you sure you want to delete this SIP?')) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]];
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success('SIP deleted successfully');
        }
    }, []);

    // Handle changes in the input fields
    const handleChange = (index, field, value) => {
        setEditedData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy to avoid mutation issues
            const parsedValue = field === 'sip' ? parseFloat(value) || 0 : value;
            newData[section][index] = {
                ...newData[section][index],
                [field]: parsedValue,
            };
            return newData;
        });
    };

    // Save changes for a specific SIP
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
        toast.success('SIP updated successfully');
    };

    // Cancel editing or adding a SIP
    const handleCancelEdit = () => {
        setEditingSipIndex(null);
        setShowAddSipForm(false);
        setEditedData(equityData);
        setNewSip({ sipName: '', category: CATEGORY_OPTIONS[0], sip: 0 });
    };

    // Calculate summary data for the pie chart
    const summaryData = editedData[section].reduce((acc, { category, sip }) => {
        acc[category] = (acc[category] || 0) + sip;
        return acc;
    }, {});

    const totalValue = Object.values(summaryData).reduce((sum, val) => sum + val, 0);
    const chartData = Object.entries(summaryData).map(([category, value]) => ({
        category: category.replace(/\b(\w)/g, (c) => c.toUpperCase()),
        value,
        contribution: Number(((value / totalValue) * 100).toFixed(1)),
        color: COLORS[category] || COLORS.default,
    }));

    const sumOfSips = editedData[section].reduce((acc, {sip}) => {
        return acc + sip || 0;
    }, 0)

    if (!equityData) return <LoadingSpinner />;

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">SIP Equity</h3>

            {/* Pie Chart */}
            <div className="flex flex-row items-center">
                <PieChart
                    series={[
                        {
                            data: chartData.map(({ category, contribution, color }) => ({
                                id: category,
                                value: parseFloat(contribution),
                                label: category,
                                color: color,
                            })),
                            innerRadius: 50,
                            outerRadius: 100,
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
                    width={500}
                    height={250}
                />
            </div>

            {/* Contribution Table */}
            <div className="flex justify-center">
                <table className="w-1/2 text-sm border-collapse border border-gray-200 mt-2">
                    <thead>
                        <tr className="bg-gray-100 text-secondary-800">
                            <th className="border px-2 py-1 w-3/6">Category</th>
                            <th className="border px-2 py-1 w-2/6">Value</th>
                            <th className="border px-2 py-1 w-1/6 text-right">Contribution (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map(({ category, value, contribution }, index) => (
                            <tr key={index} className="border border-gray-200">
                                <td className="border px-2 py-1 w-3/6">{category}</td>
                                <td className="border px-2 py-1 text-green-700 w-2/6">{formatCurrency(value)}</td>
                                <td className="border px-2 py-1 text-green-700 w-1/6 text-right">{contribution}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr className="w-full border-t border-gray-300 my-10" />

            {/* Add SIP Form */}
            {showAddSipForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add New SIP</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="sipName" className="form-label">SIP Name</label>
                                <input
                                    type="text"
                                    id="sipName"
                                    className="input"
                                    value={newSip.sipName}
                                    onChange={(e) => setNewSip({ ...newSip, sipName: e.target.value })}
                                    placeholder="e.g., SBI Bluechip, Axis"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    id="category"
                                    className="input"
                                    value={newSip.category}
                                    onChange={(e) => setNewSip({ ...newSip, category: e.target.value })}
                                >
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="sip" className="form-label">SIP Amount</label>
                                <input
                                    type="number"
                                    id="sip"
                                    className="input"
                                    value={newSip.sip}
                                    onChange={(e) => setNewSip({ ...newSip, sip: Number(e.target.value) })}
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
                                disabled={!newSip.sipName || newSip.sip <= 0}
                            >
                                Add SIP
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* SIPs List */}
            {editedData[section].length > 0 ? (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Your SIPs</h2>
                    <div className="overflow-x-auto ">
                        <div className='float-right'>
                            {sumOfSips > domesticEquity? <span className='text-red-600'>You Don't have Enough Money</span> : <></>}
                        </div>
                        <br />
                        <div className='float-right'>
                            <b>Max Amount :  {formatCurrency(domesticEquity) }</b>
                        </div>
                        <table className="min-w-full divide-y divide-secondary-200 ">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        SIP Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        SIP Amount
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
                                                    value={sip.sipName}
                                                    onChange={(e) => handleChange(index, 'sipName', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{sip.sipName}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingSipIndex === index ? (
                                                <select
                                                    className="input"
                                                    value={sip.category}
                                                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                                                >
                                                    {CATEGORY_OPTIONS.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="text-sm text-secondary-900">{sip.category}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingSipIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={sip.sip}
                                                    onChange={(e) => handleChange(index, 'sip', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(sip.sip)}</div>
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
                        <button onClick={() => setShowAddSipForm(true)} className="btn btn-primary mt-4">Add SIP</button>
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
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No SIPs yet</h3>
                        <p className="text-secondary-600 mb-6">Start by adding your first SIP</p>
                        <button onClick={() => setShowAddSipForm(true)} className="btn btn-primary">
                            Add Your First SIP
                        </button>
                    </motion.div>
                )
            )}
        </div>
    );
}