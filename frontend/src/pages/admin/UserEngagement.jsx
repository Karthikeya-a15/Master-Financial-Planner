import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Paper, Card, CardContent } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserEngagementChart() {
  const [userEngagementData, setUserEngagementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserEngagementData();
  }, []);

  const fetchUserEngagementData = async () => {
    try {
      const response = await axios.get(
        "/api/v1/admin/analytics/user-engagement"
      );
      setUserEngagementData(response.data);
    //   console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user engagement data:", error);
      setError("Failed to load user engagement data");
      setLoading(false);
      toast.error("Failed to load user engagement data");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      {/* User Engagement Metrics */}
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Engagement Metrics
        </Typography>

        <BarChart
          xAxis={[{ scaleType: "band", data: ["Logins", "Time Spent", "Actions"] }]}
          series={[
            {
              data: [
                userEngagementData.logins || 0,
                userEngagementData.timeSpent || 0,
                userEngagementData.actionsPerformed || 0,
              ],
              color: "#1976d2",
              label: "Engagement Data",
            },
          ]}
          width={500}
          height={300}
        />
      </Paper>

      {/* New Users Analytics */}
      <Card sx={{ maxWidth: 500, margin: "auto", padding: 2, boxShadow: 3, mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            New Users in Last Month
          </Typography>
          <BarChart
            series={[
              { data: [userEngagementData.newUsersLastMonth || 0], label: "New Users", color: "#4caf50" },
            ]}
            xAxis={[{ scaleType: "band", data: ["Last Month"] }]}
            height={300}
          />
        </CardContent>
      </Card>
    </>

  );
}
