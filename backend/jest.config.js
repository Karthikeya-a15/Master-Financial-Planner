import dotenv from "dotenv";
dotenv.config();

// jest.config.js
export default {
    preset: '@shelf/jest-mongodb', // Use the mongodb-memory-server preset
    testEnvironment: 'node',
    // setupFiles: ["backend/src/config.js"], // Load environment variables
    transform: {
      "^.+\\.jsx?$": "babel-jest",  
      "^.+\\.mjs$": "babel-jest",
      "^.+\\.js$": "babel-jest"
    },
    transformIgnorePatterns: [
       "/node_modules/(?!(@google/generative-ai)/)",  // Don't ignore ES modules in node_modules
    ],
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'], // Important for module resolution
    verbose: true,
    testTimeout: 10000, // Increase timeout to 10 seconds
  };