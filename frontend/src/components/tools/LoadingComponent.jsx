import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingComponent() {
  const [points, setPoints] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let value = 5;
    const newPoints = [];
    const totalPoints = 12;

    const interval = setInterval(() => {
      if (newPoints.length < totalPoints) {
        if (newPoints.length === 0) {
          value = 5;
        } else if (newPoints.length === totalPoints - 1) {
          value = 95;
        } else {
          const progress = newPoints.length / totalPoints;
          const targetValue = 5 + progress * 90;
          const randomVariation = Math.random() * 10 - 5;
          value = Math.max(
            newPoints[newPoints.length - 1],
            Math.min(targetValue + randomVariation, 95)
          );
        }

        newPoints.push(value);
        setPoints([...newPoints]);
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const createPath = (points) => {
    if (points.length < 2) return "";

    const width = 300;
    const height = 150;
    const xStep = width / (points.length - 1);

    return points
      .map((point, i) => {
        const x = i * xStep;
        const y = height - (point / 100) * height;
        return `${i === 0 ? "M" : "L"} ${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-slate-50 rounded-xl shadow-md">
      <div className="w-[300px] h-[150px] relative mb-8">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full h-px bg-slate-200" />
          ))}
        </div>
        <div className="absolute inset-0 flex justify-between items-stretch">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full w-px bg-slate-200" />
          ))}
        </div>

        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <motion.path
            d={createPath(points)}
            fill="none"
            stroke="url(#blueGradient)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d={`${createPath(points)} L ${points.length > 0 ? 300 : 0},150 L 0,150 Z`}
            fill="url(#areaGradient)"
            opacity={0.2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {points.map((point, i) => {
            const x = i * (300 / (points.length - 1 || 1));
            const y = 150 - (point / 100) * 150;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill="#fff"
                stroke="#3b82f6"
                strokeWidth={2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            );
          })}
        </svg>
        {points.length > 0 && (
          <motion.div
            className="absolute -top-10 right-0 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            ${(5000 + points[points.length - 1] * 150).toLocaleString()}
          </motion.div>
        )}
      </div>
      <motion.div
        className="text-center text-blue-800 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        Getting Best Investments for You...
      </motion.div>
      {isComplete && (
        <div className="mt-6 w-full">
          <motion.div
            className="grid grid-cols-3 gap-2 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
          </motion.div>
        </div>
      )}
    </div>
  );
}
