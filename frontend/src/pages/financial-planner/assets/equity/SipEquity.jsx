import { PieChart } from '@mui/x-charts';

import LoadingSpinner from "../../../../components/common/LoadingSpinner";


export default function SipEquity({ formatCurrency, equityData, editedData, isEditing, setIsEditing, handleChange, handleSave, CATEGORY_OPTIONS, COLORS }) {
    if (!equityData) return <LoadingSpinner />;
    const section = "sipEquity";

    const summaryData = equityData[section].reduce((acc, { category, sip }) => {
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

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">SIP Equity</h2>
                <div className="flex flex-row items-center">
                    
                    <PieChart
                        series={[{
                            data: chartData.map(({ category, contribution, color }) => ({
                                id: category,
                                value: parseFloat(contribution),
                                label: category,
                                color: color,
                            })),
                            innerRadius: 40,
                            outerRadius: 80,
                        }]}
                        slotProps={{
                            legend: { direction: 'column', position: { vertical: 'middle', horizontal: 'right' } },
                            tooltip: { formatter: (params) => `${params.label}: ${params.value}%` },
                        }}
                        width={400}
                        height={250}
                    />
                </div>
                <div className="flex justify-center">
                    <table className="w-1/2 text-sm border-collapse border border-gray-200 mt-2">
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
                    {editedData.sipEquity.map((item, index) => (
                        <div key={item._id} className="grid grid-cols-3 justify-center text-center bg-gray-100 p-2 rounded mt-2">
                            <span>{item.sipName}</span>
                            {isEditing ? (
                                <select value={item.category} onChange={(e) => handleChange("sipEquity", index, "category", e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-32">
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <span>{item.category}</span>
                            )}
                            {isEditing ? (
                                <input type="number" value={item.sip} onChange={(e) => handleChange("sipEquity", index, "sip", Number(e.target.value))} className="border border-gray-300 rounded px-2 py-1 w-24 text-right" />
                            ) : (
                                <span>{formatCurrency(item.sip)}</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={() => handleSave("sipEquity")} className="btn btn-primary">Save</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit</button>
                    )}
                </div>
            </div>
        </>
    );
}