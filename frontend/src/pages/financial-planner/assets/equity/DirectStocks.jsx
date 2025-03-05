import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PieChart } from '@mui/x-charts';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';

export default function DirectStocks({
    formatCurrency,
    equityData,
    editedData,
    setEditedData,
    CATEGORY_OPTIONS,
    COLORS,
    handleSave,
}) {
    const section = 'directStocks';
    const [showAddStockForm, setShowAddStockForm] = useState(false);
    const [newStock, setNewStock] = useState({
        stockName: '',
        category: CATEGORY_OPTIONS[0],
        currentValue: 0,
    });
    const [editingStockIndex, setEditingStockIndex] = useState(null);

    const handleAddStock = useCallback(() => {
        setEditedData((prev) => ({
            ...prev,
            [section]: [...prev[section], newStock],
        }));
        setShowAddStockForm(false);
        setNewStock({ stockName: '', category: CATEGORY_OPTIONS[0], currentValue: 0 });
        toast.success('Stock added successfully');
    }, [newStock]);

    const handleDeleteStock = useCallback((index) => {
        if (confirm('Are you sure you want to delete this stock?')) {
            setEditedData((prev) => {
                const updatedSection = [...prev[section]]; //
                updatedSection.splice(index, 1);
                return { ...prev, [section]: updatedSection };
            });
            toast.success('Stock deleted successfully');
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

    const handleStockSave = (index) => {
        setEditedData((prevData) => {
            const updatedStocks = [...prevData[section]];
            
            updatedStocks[index] = { ...editedData[section][index] };
            
            return {
                ...prevData,
                [section]: updatedStocks,
            };
        });  
        setEditingStockIndex(false);
        toast.success('Stock Updated successfully');
    };
    
    
    const handleCancelEdit = () => {
        setEditingStockIndex(null);
        setShowAddStockForm(false);
        setEditedData(equityData);
        setNewStock({ stockName: '', category: CATEGORY_OPTIONS[0], currentValue: 0 });
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

    if (!equityData) return <LoadingSpinner />;

    return (
        <div key={section} className="space-y-8">
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">Direct Stocks</h3>

            {/* Summary Cards */}
            {/* <div className='flex justify-center'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-lg font-semibold mb-2">Total Stocks</h2>
                    <p className="text-3xl font-bold">{editedData[section].length}</p>
                </motion.div>

                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h2 className="text-lg font-semibold text-secondary-900 mb-2">Total Value</h2>
                    <p className="text-3xl font-bold text-secondary-900">{formatCurrency(totalValue)}</p>
                </motion.div>
            </div>
            </div> */}

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
                    width={400}
                    height={250}
                />
            </div>

            {/* Contribution Table */}
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

            {/* Add Stock Form */}
            {showAddStockForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div 
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-bold text-secondary-900 mb-6">Add New Stock</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="form-group">
                                <label htmlFor="stockName" className="form-label">Stock Name</label>
                                <input
                                    type="text"
                                    id="stockName"
                                    className="input"
                                    value={newStock.stockName}
                                    onChange={(e) => setNewStock({ ...newStock, stockName: e.target.value })}
                                    placeholder="e.g., Apple, Tesla"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    id="category"
                                    className="input"
                                    value={newStock.category}
                                    onChange={(e) => setNewStock({ ...newStock, category: e.target.value })}
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
                                    value={newStock.currentValue}
                                    onChange={(e) => setNewStock({ ...newStock, currentValue: Number(e.target.value) })}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={() => setShowAddStockForm(false)} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleAddStock}
                                className="btn btn-primary"
                                disabled={!newStock.stockName || newStock.currentValue <= 0}
                            >
                                Add Stock
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Stocks List */}
            {editedData[section].length > 0 ? (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Your Stocks</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                        Stock Name
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
                                {editedData[section].map((stock, index) => (
                                    <tr key={index} className={editingStockIndex === index ? 'bg-primary-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingStockIndex === index ? (
                                                <input
                                                    type="text"
                                                    className="input"
                                                    value={stock.stockName}
                                                    onChange={(e) => handleChange(index, 'stockName', e.target.value)}
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-secondary-900">{stock.stockName}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingStockIndex === index ? (
                                                <select
                                                    className="input"
                                                    value={stock.category}
                                                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                                                >
                                                    {CATEGORY_OPTIONS.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="text-sm text-secondary-900">{stock.category}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {editingStockIndex === index ? (
                                                <input
                                                    type="number"
                                                    className="input w-32 text-right"
                                                    value={stock.currentValue}
                                                    onChange={(e) => handleChange(index, 'currentValue', e.target.value)}
                                                    min="0"
                                                    step="1000"
                                                />
                                            ) : (
                                                <div className="text-sm text-secondary-900">{formatCurrency(stock.currentValue)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingStockIndex === index ? (
                                                <div className="flex space-x-2 justify-end">
                                                    <button
                                                        onClick={()=>handleStockSave(index)}
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
                                                        onClick={() => setEditingStockIndex(index)}
                                                        className="text-primary-600 hover:text-primary-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteStock(index)}
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
                        <button onClick={() => setShowAddStockForm(true)} className="btn btn-primary mt-4">Add Stock</button>
                        {!showAddStockForm ? 
                        <button onClick={() => handleSave("directStocks")} className="btn btn-success m-4">Save</button>
                        :
                            <></>
                        }


                    </div>
                </motion.div>
            ) : (
                !showAddStockForm && (
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
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No stocks yet</h3>
                        <p className="text-secondary-600 mb-6">Start by adding your first stock</p>
                        <button onClick={() => setShowAddStockForm(true)} className="btn btn-primary">
                            Add Your First Stock
                        </button>
                    </motion.div>
                )
            )}
        </div>
    );
}