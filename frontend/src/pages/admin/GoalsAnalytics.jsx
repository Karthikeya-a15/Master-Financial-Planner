import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

export default function GoalChart() {
  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const fetchGoalsData = async () => {
    try {
      const response = await axios.get("/api/v1/admin/analytics/goals");
      setGoalData(response.data);
    //   console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user engagement data:", error);
      setError("Failed to load user engagement data");
      setLoading(false);
      toast.error("Failed to load user engagement data");
    }
  };

  return (
    <>
      <AdminNavbar />
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Goal Distribution
        </Typography>

        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Short Term", "Medium Term", "Long Term"],
            },
          ]}
          series={[
            {
              data: [
                goalData?.formattedCounts?.shortTerm || 0,
                goalData?.formattedCounts?.mediumTerm || 0,
                goalData?.formattedCounts?.longTerm || 0,
              ],
              color: "#1976d2",
              label: "Goals Count",
            },
          ]}
          width={500}
          height={300}
        />

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Overall Average SIP Required
        </Typography>

        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Short Term", "Medium Term", "Long Term"],
            },
          ]}
          series={[
            {
              data: [
                goalData?.averagesPerTerm?.shortTermAvgSip || 0,
                goalData?.averagesPerTerm?.mediumTermAvgSip || 0,
                goalData?.averagesPerTerm?.longTermAvgSip || 0,
              ],
              color: "#4caf50",
              label: "Average SIP Required",
            },
          ]}
          width={500}
          height={300}
        />
      </Paper>
    </>
  );
}
