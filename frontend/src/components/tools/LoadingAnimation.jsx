import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  // Generate sample data points for the growing portfolio line
  const generateDataPoints = () => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      points.push({
        x: i * 10,
        y: Math.pow(1.1, i) * 10 + Math.random() * 20 - 10 // Exponential growth with some randomness
      });
    }
    return points;
  };

  const dataPoints = generateDataPoints();
  const pathData = `M ${dataPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-primary-600 mb-8">
          Getting the best funds for you...
        </h2>
        
        <div className="relative h-64 w-full">
          <svg className="w-full h-full">
            {/* Grid lines */}
            {[...Array(10)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 25}
                x2="100%"
                y2={i * 25}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2="100%"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Animated line */}
            <motion.path
              d={pathData}
              stroke="#2563eb"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </svg>
        </div>
        
        <div className="mt-8 flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="flex items-center space-x-2"
          >
            <div className="w-3 h-3 bg-primary-600 rounded-full" />
            <div className="w-3 h-3 bg-primary-600 rounded-full" />
            <div className="w-3 h-3 bg-primary-600 rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}