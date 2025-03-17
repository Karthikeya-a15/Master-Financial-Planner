import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const GoalsContext = createContext();

export const GoalsProvider = ({ children }) => {
  const [goalsData, setGoalsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch goals data
  const fetchGoalsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/planner/financialGoals");
      setGoalsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching goals data:", error);
      setError("Failed to load goals data. Please try again later.");
      setLoading(false);
    }
  };

  // 🔹 Fetch goalsData when the provider mounts (app starts)
  useEffect(() => {
    fetchGoalsData();
  }, []);

  return (
    <GoalsContext.Provider value={{ goalsData, setGoalsData }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);
