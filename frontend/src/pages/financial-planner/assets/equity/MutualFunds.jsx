import { PieChart } from '@mui/x-charts';

import LoadingSpinner from "../../../../components/common/LoadingSpinner";


export default function MutualFunds({ formatCurrency, equityData, editedData, isEditing, setIsEditing, handleChange, handleSave, CATEGORY_OPTIONS, COLORS }) {
    if (!equityData) return <LoadingSpinner />;
    const section = "mutualFunds";
    
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
        <div key={section}>
            <h3 className="text-lg font-semibold text-secondary-700 capitalize">Mutual Funds</h3>
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
                            innerRadius: 40,
                            outerRadius: 80,
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

            <div className="mt-4">
                <h3>  </h3>
                {editedData[section].map((item, index) => (
                    <div key={item._id} className="grid grid-cols-3 justify-center text-center bg-gray-100 p-2 rounded mt-2">
                        <span>{item.fundName}</span>
                        {isEditing ? (
                            <select value={item.category} onChange={(e) => handleChange(section, index, "category", e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-32">
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <span>{item.category}</span>
                        )}
                        {isEditing ? (
                            <input type="number" value={item.currentValue} onChange={(e) => handleChange(section, index, "currentValue", Number(e.target.value))} className="border border-gray-300 rounded px-2 py-1 w-24 text-right" />
                        ) : (
                            <span>{formatCurrency(item.currentValue)}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                {isEditing ? (
                    <>
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                        <button onClick={() => handleSave(section)} className="btn btn-primary">Save</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit</button>
                )}
            </div>
        </div>
    );
}