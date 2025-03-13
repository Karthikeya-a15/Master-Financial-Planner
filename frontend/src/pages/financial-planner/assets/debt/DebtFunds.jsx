import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

export default function DebtFunds({
    formatCurrency,
    debtData,
    editedData,
    setEditedData,
    handleSave,
}) {
    if (!debtData) return <LoadingSpinner />;

    const section = "debtFunds";
    const [showAddDebtForm, setShowAddDebtForm] = useState(false);
    const [newDebt, setNewDebt] = useState({
        name: '',
        currentValue: 0,
    });
    const [editingDebtIndex, setEditingDebtIndex] = useState(null);

    // Add a new Debt Fund
    const handleAddDebt = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newDebt],
        }));
        setShowAddDebtForm(false);
        setNewDebt({ name: '', currentValue: 0 });
        toast.success('Debt Fund added successfully');
    }, [newDebt, setEditedData]);

    // Delete a Debt Fund
    const handleDeleteDebt = useCallback((index) => {
        if (confirm('Are you sure you want to delete this debt fund?')) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]];
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success('Debt Fund deleted successfully');
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

    // Save changes for a specific Debt Fund
    const handleDebtSave = (index) => {
        setEditedData((prevData) => {
            const updatedDebtFunds = [...prevData[section]];
            updatedDebtFunds[index] = { ...editedData[section][index] };
            return {
                ...prevData,
                [section]: updatedDebtFunds,
            };
        });
        setEditingDebtIndex(null);
        toast.success('Debt Fund updated successfully');
    };

    // Cancel editing or adding a Debt Fund
    const handleCancelEdit = () => {
        setEditingDebtIndex(null);
        setShowAddDebtForm(false);
        setEditedData(debtData);
        setNewDebt({ name: '', currentValue: 0 });
    };

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">Debt Funds</h3>

            {/* Add Debt Fund Form */}
            {showAddDebtForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add Debt Fund</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Fund Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input"
                                    value={newDebt.name}
                                    onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                                    placeholder="e.g., ICICI Corporate Bond Fund"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="currentValue" className="form-label">Current Value</label>
                                <input
                                    type="number"
                                    id="currentValue"
                                    className="input"
                                    value={newDebt.currentValue}
                                    onChange={(e) => setNewDebt({ ...newDebt, currentValue: Number(e.target.value) })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowAddDebtForm(false)} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleAddDebt}
                                className="btn btn-primary"
                                disabled={!newDebt.name || newDebt.currentValue <= 0}
                            >
                                Add Debt Fund
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Debt Funds List */}
            {editedData[section].length > 0 ? (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Your Debt Funds</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Fund Name
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
                                {editedData[section].map((debt, index) => (
                                    <tr key={index} className={editingDebtIndex === index ? 'bg-primary-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingDebtIndex === index ? (
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={debt.name}
                                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{debt.name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingDebtIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={debt.currentValue}
                                                    onChange={(e) => handleChange(index, 'currentValue', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(debt.currentValue)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingDebtIndex === index ? (
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={() => handleDebtSave(index)}
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
                                                        onClick={() => setEditingDebtIndex(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDebt(index)}
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
                        <button onClick={() => setShowAddDebtForm(true)} className="btn btn-primary mt-4">Add Debt Fund</button>
                        {!showAddDebtForm && (
                            <button onClick={() => handleSave(section)} className="btn btn-success m-4">Save</button>
                        )}
                    </div>
                </motion.div>
            ) : (
                !showAddDebtForm && (
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
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No debt funds yet</h3>
                        <p className="text-secondary-600 mb-6">Start by adding your first debt fund</p>
                        <button onClick={() => setShowAddDebtForm(true)} className="btn btn-primary">
                            Add Your First Debt Fund
                        </button>
                    </motion.div>
                )
            )}
        </div>
    );
}