import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

export default function GovernmentInvestments({
    formatCurrency,
    debtData,
    editedData,
    setEditedData,
    handleSave,
}) {
    if (!debtData) return <LoadingSpinner />;

    const section = "governmentInvestments";
    const [showAddGovtForm, setShowAddGovtForm] = useState(false);
    const [newGovt, setNewGovt] = useState({
        name: '',
        currentValue: 0,
    });
    const [editingGovtIndex, setEditingGovtIndex] = useState(null);

    // Add a new Government Investment
    const handleAddGovt = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newGovt],
        }));
        setShowAddGovtForm(false);
        setNewGovt({ name: '', currentValue: 0 });
        toast.success('Government Investment added successfully');
    }, [newGovt, setEditedData]);

    // Delete a Government Investment
    const handleDeleteGovt = useCallback((index) => {
        if (confirm('Are you sure you want to delete this government investment?')) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]];
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success('Government Investment deleted successfully');
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

    // Save changes for a specific Government Investment
    const handleGovtSave = (index) => {
        setEditedData((prevData) => {
            const updatedGovtInvestments = [...prevData[section]];
            updatedGovtInvestments[index] = { ...editedData[section][index] };
            return {
                ...prevData,
                [section]: updatedGovtInvestments,
            };
        });
        setEditingGovtIndex(null);
        toast.success('Government Investment updated successfully');
    };

    // Cancel editing or adding a Government Investment
    const handleCancelEdit = () => {
        setEditingGovtIndex(null);
        setShowAddGovtForm(false);
        setEditedData(debtData);
        setNewGovt({ name: '', currentValue: 0 });
    };

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">Government Investments</h3>

            {/* Add Government Investment Form */}
            {showAddGovtForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add Government Investment</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Investment Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input"
                                    value={newGovt.name}
                                    onChange={(e) => setNewGovt({ ...newGovt, name: e.target.value })}
                                    placeholder="e.g., PPF, EPF"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="currentValue" className="form-label">Current Value</label>
                                <input
                                    type="number"
                                    id="currentValue"
                                    className="input"
                                    value={newGovt.currentValue}
                                    onChange={(e) => setNewGovt({ ...newGovt, currentValue: Number(e.target.value) })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowAddGovtForm(false)} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleAddGovt}
                                className="btn btn-primary"
                                disabled={!newGovt.name || newGovt.currentValue <= 0}
                            >
                                Add Investment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Government Investments List */}
            {editedData[section].length > 0 ? (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Your Government Investments</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Investment Name
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
                                {editedData[section].map((govt, index) => (
                                    <tr key={index} className={editingGovtIndex === index ? 'bg-primary-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingGovtIndex === index ? (
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={govt.name}
                                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{govt.name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingGovtIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={govt.currentValue}
                                                    onChange={(e) => handleChange(index, 'currentValue', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(govt.currentValue)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingGovtIndex === index ? (
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={() => handleGovtSave(index)}
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
                                                        onClick={() => setEditingGovtIndex(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGovt(index)}
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
                        <button onClick={() => setShowAddGovtForm(true)} className="btn btn-primary mt-4">Add Investment</button>
                        {!showAddGovtForm && (
                            <button onClick={() => handleSave(section)} className="btn btn-success m-4">Save</button>
                        )}
                    </div>
                </motion.div>
            ) : (
                !showAddGovtForm && (
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
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No government investments yet</h3>
                        <p className="text-secondary-600 mb-6">Start by adding your first government investment</p>
                        <button onClick={() => setShowAddGovtForm(true)} className="btn btn-primary">
                            Add Your First Investment
                        </button>
                    </motion.div>
                )
            )}
        </div>
    );
}