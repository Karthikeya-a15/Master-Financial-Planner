import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

export default function LiquidFund({
    formatCurrency,
    debtData,
    editedData,
    setEditedData,
    handleSave,
}){
    if(!debtData) return <LoadingSpinner/>

    const section = "liquidFund";
    const [showAddLiquidForm, setShowAddLiquidForm] = useState(false);
    const [newLiquid, setNewLiquid] = useState({
        particulars: '',
        currentValue: 0,
    });
    const [editingLiquidIndex, setEditingLiquidIndex] = useState(null);

    const handleAddLiquid = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newLiquid],
        }));
        setShowAddLiquidForm(false);
        setNewLiquid({ particulars: '', currentValue: 0 });
        toast.success('Liquid Fund added successfully');
    }, [newLiquid, setEditedData]);

    const handleDeleteLiquid = useCallback((index) => {
        if (confirm('Are you sure you want to delete this liquid fund?')) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]]; //
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success('Liquid Fund Deleted successfully');
        }
    }, []);

    const handleChange = (index, field, value) => {
        setEditedData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy to avoid mutation issues
            
            // Ensure the value is properly parsed for numerical fields
            const parsedValue = field === 'currentValue' ? parseFloat(value) || 0 : value;
    
            newData[section][index] = {
                ...newData[section][index],
                [field]: parsedValue,
            };
            
            return newData;
        });
    };

    const handleLiquidSave = (index) => {
        setEditedData((prevData) => {
            const updatedLiquids = [...prevData[section]];
            
            updatedLiquids[index] = { ...editedData[section][index] };
            
            return {
                ...prevData,
                [section]: updatedLiquids,
            };
        });  
        setEditingLiquidIndex(false);
        toast.success('Liquid Fund Updated successfully');
    };
    
    
    const handleCancelEdit = () => {
        setEditingLiquidIndex(null);
        setShowAddLiquidForm(false);
        setEditedData(debtData);
        setNewLiquid({  
            particulars: '',
            currentValue: 0, });
    };

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">Liquid Fund</h3>
            
            {/* Add Liquid Fund Form */}
            {showAddLiquidForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add Liquid Fund</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="liquidName" className="form-label">Particulars</label>
                                <input
                                    type="text"
                                    id="particulars"
                                    className="input"
                                    value={newLiquid.particulars}
                                    onChange={(e) => setNewLiquid({ ...newLiquid, particulars: e.target.value })}
                                    placeholder="e.g., HDFC Savings.. "
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="currentValue" className="form-label">Current Value</label>
                                <input
                                    type="number"
                                    id="currentValue"
                                    className="input"
                                    value={newLiquid.currentValue}
                                    onChange={(e) => setNewLiquid({ ...newLiquid, currentValue: Number(e.target.value) })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowAddLiquidForm(false)} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleAddLiquid}
                                className="btn btn-primary"
                                disabled={!newLiquid.particulars || newLiquid.currentValue <= 0}
                            >
                                Add Liquid Fund
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Liquid Fund List */}
            {editedData[section].length > 0 ? (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Your Liquid Funds</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Particulars
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
                                {editedData[section].map((liquid, index) => (
                                    <tr key={index} className={editingLiquidIndex === index ? 'bg-primary-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingLiquidIndex === index ? (
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={liquid.particulars}
                                                    onChange={(e) => handleChange(index, 'particulars', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{liquid.particulars}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingLiquidIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={liquid.currentValue}
                                                    onChange={(e) => handleChange(index, 'currentValue', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(liquid.currentValue)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingLiquidIndex === index ? (
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={()=>handleLiquidSave(index)}
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
                                                        onClick={() => setEditingLiquidIndex(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLiquid(index)}
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
                        <button onClick={() => setShowAddLiquidForm(true)} className="btn btn-primary mt-4">Add Liquid</button>
                        {!showAddLiquidForm && (
                            <button onClick={() => handleSave("liquidFund")} className="btn btn-success m-4">Save</button>
                        )}

                    </div>
                </motion.div>
            ) : (
                !showAddLiquidForm && (
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
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No liquids yet</h3>
                        <p className="text-secondary-600 mb-6">Start by adding your first liquid</p>
                        <button onClick={() => setShowAddLiquidForm(true)} className="btn btn-primary">
                            Add Your First Liquid Fund
                        </button>
                    </motion.div>
                )
            )}

        </div>
    )

}