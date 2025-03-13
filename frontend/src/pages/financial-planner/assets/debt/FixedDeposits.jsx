import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

export default function FixedDeposit({
    formatCurrency,
    debtData,
    editedData,
    setEditedData,
    handleSave,
}) {
    if (!debtData) return <LoadingSpinner />;

    const section = "fixedDeposit";
    const [showAddFixedForm, setShowAddFixedForm] = useState(false);
    const [newFixed, setNewFixed] = useState({
        bankName: '',
        currentValue: 0,
    });
    const [editingFixedIndex, setEditingFixedIndex] = useState(null);

    // Add a new Fixed Deposit
    const handleAddFixed = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newFixed],
        }));
        setShowAddFixedForm(false);
        setNewFixed({ bankName: '', currentValue: 0 });
        toast.success('Fixed Deposit added successfully');
    }, [newFixed, setEditedData]);

    // Delete a Fixed Deposit
    const handleDeleteFixed = useCallback((index) => {
        if (confirm('Are you sure you want to delete this fixed deposit?')) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]];
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success('Fixed Deposit deleted successfully');
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

    // Save changes for a specific Fixed Deposit
    const handleFixedSave = (index) => {
        setEditedData((prevData) => {
            const updatedFixedDeposits = [...prevData[section]];
            updatedFixedDeposits[index] = { ...editedData[section][index] };
            return {
                ...prevData,
                [section]: updatedFixedDeposits,
            };
        });
        setEditingFixedIndex(null);
        toast.success('Fixed Deposit updated successfully');
    };

    // Cancel editing or adding a Fixed Deposit
    const handleCancelEdit = () => {
        setEditingFixedIndex(null);
        setShowAddFixedForm(false);
        setEditedData(debtData);
        setNewFixed({ bankName: '', currentValue: 0 });
    };

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">Fixed Deposits</h3>

            {/* Add Fixed Deposit Form */}
            {showAddFixedForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add Fixed Deposit</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="bankName" className="form-label">Bank Name</label>
                                <input
                                    type="text"
                                    id="bankName"
                                    className="input"
                                    value={newFixed.bankName}
                                    onChange={(e) => setNewFixed({ ...newFixed, bankName: e.target.value })}
                                    placeholder="e.g., Axis, Kotak"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="currentValue" className="form-label">Current Value</label>
                                <input
                                    type="number"
                                    id="currentValue"
                                    className="input"
                                    value={newFixed.currentValue}
                                    onChange={(e) => setNewFixed({ ...newFixed, currentValue: Number(e.target.value) })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowAddFixedForm(false)} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleAddFixed}
                                className="btn btn-primary"
                                disabled={!newFixed.bankName || newFixed.currentValue <= 0}
                            >
                                Add Fixed Deposit
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Fixed Deposits List */}
            {editedData[section].length > 0 ? (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Your Fixed Deposits</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Bank Name
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
                                {editedData[section].map((fixed, index) => (
                                    <tr key={index} className={editingFixedIndex === index ? 'bg-primary-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingFixedIndex === index ? (
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={fixed.bankName}
                                                    onChange={(e) => handleChange(index, 'bankName', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{fixed.bankName}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingFixedIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={fixed.currentValue}
                                                    onChange={(e) => handleChange(index, 'currentValue', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(fixed.currentValue)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingFixedIndex === index ? (
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={() => handleFixedSave(index)}
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
                                                        onClick={() => setEditingFixedIndex(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFixed(index)}
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
                        <button onClick={() => setShowAddFixedForm(true)} className="btn btn-primary mt-4">Add Fixed Deposit</button>
                        {!showAddFixedForm && (
                            <button onClick={() => handleSave(section)} className="btn btn-success m-4">Save</button>
                        )}
                    </div>
                </motion.div>
            ) : (
                !showAddFixedForm && (
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
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No fixed deposits yet</h3>
                        <p className="text-secondary-600 mb-6">Start by adding your first fixed deposit</p>
                        <button onClick={() => setShowAddFixedForm(true)} className="btn btn-primary">
                            Add Your First Fixed Deposit
                        </button>
                    </motion.div>
                )
            )}
        </div>
    );
}