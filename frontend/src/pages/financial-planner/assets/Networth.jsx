import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Networth({data, totalIlliquid, totalLiquid, totalAssets, totalLiabilities, formatCurrency}){
  
  return (
    <>  
        {/* Asset Allocation */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-secondary-900 mb-6">Asset Allocation</h2>
            
              <div>
                {AssetTable({data, totalAssets, formatCurrency})}
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {CurrentAssetTable({data, formatCurrency})}
              
              {RequiredAssetTable({data, formatCurrency})}
              
            </div>
          </motion.div>

          <hr className="w-full border-t border-gray-300 my-10" />
          
          {/* Asset Details */}
            {AssetDetails({data, formatCurrency, totalIlliquid, totalLiquid, totalLiabilities})}    
    </>
  )
}


const AssetTable = ({ data, totalAssets, formatCurrency }) => {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">Total Asset Summary</h3>
        <table className="w-2/3 border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Particular(s)</th>
              <th className="border border-gray-300 px-4 py-2">Current Value</th>
              <th className="border border-gray-300 px-4 py-2">Contribution (%)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.totalAssetSummary).map(([key, value]) => {
              let percentage = ((value / totalAssets) * 100).toFixed(1);
              const decimalPart = Number(percentage.split(".")[1]);
              percentage = decimalPart < 5 ? Math.floor(percentage) : Math.ceil(percentage);
              
              return (
                <tr key={key} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2 capitalize">{key==="realEstate"? key.replace("realEstate", "Real Estate / REITs") : key.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-700">{formatCurrency(value)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-green-700">{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr className="w-2/3 border-t border-gray-300 my-10" />
      </div>
    );
  };
  
  
  const COLORS = {
    realEstate: "#2563EB", // primary-600
    domesticEquity: "#16A34A", // success-600
    usEquity: "#F59E0B", // warning-600
    debt: "#64748B", // secondary-600
    gold: "#EAB308", // yellow-500
    crypto: "#7C3AED", // purple-600
    default: "#2563EB"
  };
  const formatLabel = (key) => key==="realEstate"? key.replace("realEstate", "Real Estate / REITs") : key.replace(/([A-Z])/g, " $1").trim().replace(/^./, str => str.toUpperCase());
  
  const CurrentAssetTable = ({ data, formatCurrency }) => {
    const chartData = Object.entries(data.totalAssetSummary).map(([key, value]) => {
      let finalValue = value;
      if (key === "realEstate") {
        finalValue -= data.illiquid.home;
      } else if (key === "gold") {
        finalValue -= data.illiquid.jewellery;
      }
      let percentage = ((finalValue / data.currentInvestibleAssets) * 100).toFixed(1);
      const decimalPart = Number(percentage.split(".")[1]);
      percentage = decimalPart < 5 ? Math.floor(percentage) : Math.ceil(percentage);
      return { name: formatLabel(key), value: finalValue, percentage: Number(percentage), color: COLORS[key] || COLORS.default };
    });
  
    return (
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">Current Allocation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
  
        
        <table className="w-full border-collapse border border-gray-300 mt-4 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Particular(s)</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map(({ name, value }) => (
              <tr key={name} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{name}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-700">{formatCurrency(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  
  const RequiredAssetTable = ({ data, formatCurrency }) => {
    const totalRecommended = Object.values(data.requiredInvestableAssetAllocation).reduce((sum, val) => sum + val, 0);
    const chartData = Object.entries(data.requiredInvestableAssetAllocation).map(([key, value]) => {
      let percentage = ((value / totalRecommended) * 100).toFixed(1);
      const decimalPart = Number(percentage.split(".")[1]);
      percentage = decimalPart < 5 ? Math.floor(percentage) : Math.ceil(percentage);
      return { name: formatLabel(key), value, percentage: Number(percentage), color: COLORS[key] || COLORS.default };
    });
  
    return (
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 text-center">Recommended Allocation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <table className="w-full border-collapse border border-gray-300 mt-4 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Particular(s)</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map(({ name, value }) => (
              <tr key={name} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{name}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-700">{formatCurrency(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  
  const AssetDetails = ({data, formatCurrency, totalIlliquid, totalLiquid, totalLiabilities}) => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Liquid Assets */}
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-secondary-900">Liquid Assets</h2>
                  <span className="text-lg font-semibold text-secondary-900">{formatCurrency(totalLiquid)}</span>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(data.liquid).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-secondary-100 last:border-0">
                      <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Illiquid Assets */}
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-secondary-900">Illiquid Assets</h2>
                  <span className="text-lg font-semibold text-secondary-900">{formatCurrency(totalIlliquid)}</span>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(data.illiquid).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-secondary-100 last:border-0">
                      <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
  
              </motion.div>
              
              {/* Liabilities */}
              <motion.div 
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-secondary-900">Liabilities</h2>
                  <span className="text-lg font-semibold text-danger-600">{formatCurrency(totalLiabilities)}</span>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(data.Liabilities).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-secondary-100 last:border-0">
                      <span className="text-secondary-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-secondary-900 font-medium">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
                
              </motion.div>
              
            </div>
      </>
    )
  }