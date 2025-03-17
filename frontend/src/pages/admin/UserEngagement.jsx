import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Box, Typography, CircularProgress, Paper, Card, CardContent, 
  Grid, Divider, Tooltip as MuiTooltip, IconButton
} from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "./AdminNavbar";

export default function UserEngagementChart() {
  const [userEngagementData, setUserEngagementData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Colors for consistent styling
  const colors = {
    logins: "#2196f3",
    timeSpent: "#4caf50",
    actions: "#ff9800",
    newUsers: "#9c27b0",
    returningUsers: "#f44336",
    conversions: "#00bcd4"
  };

  useEffect(() => {
    fetchUserEngagementData();
    // Generate mock time series data for demo
    generateTimeSeriesData();
  }, []);

  const generateTimeSeriesData = () => {
    // Generate last 7 days of mock data for demonstration
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mockData = days.map((day, index) => ({
      day,
      logins: Math.floor(Math.random() * 200) + 100,
      timeSpent: Math.floor(Math.random() * 100) + 50,
      actions: Math.floor(Math.random() * 300) + 150,
    }));
    setTimeSeriesData(mockData);
  };

  const fetchUserEngagementData = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(
        "/api/v1/admin/analytics/user-engagement"
      );
      setUserEngagementData(response.data);
      console.log(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching user engagement data:", error);
      setError("Failed to load user engagement data");
      setLoading(false);
      setRefreshing(false);
      toast.error("Failed to load user engagement data");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserEngagementData();
    generateTimeSeriesData();
    toast.info("Refreshing dashboard data...");
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress size={60} />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography color="error" variant="h5">{error}</Typography>
    </Box>
  );

  // Mock user types data for pie chart
  const userTypeData = [
    { id: 0, value: userEngagementData.newUsersLastMonth || 100, label: 'New Users' },
    { id: 1, value: userEngagementData.returningUsers || 300, label: 'Returning' },
    { id: 2, value: userEngagementData.inactiveUsers || 50, label: 'Inactive' }
  ];

  // Calculate growth percentages (mock data)
  const loginGrowth = 12.5;
  const timeSpentGrowth = -5.2;
  const actionsGrowth = 8.7;

  return (
    <>
      <AdminNavbar />
      <Box sx={{ p: 3, maxWidth: 1200, margin: "auto" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            User Engagement Dashboard
          </Typography>
          <MuiTooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <span>🔄</span>
            </IconButton>
          </MuiTooltip>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
            <Card sx={{ bgcolor: "#f5f9ff", boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box bgcolor={colors.logins} sx={{ p: 1, borderRadius: 1, mr: 2 }}>
                    <span style={{ color: "white" }}>👥</span>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="textSecondary">Total Logins</Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" fontWeight="bold">{userEngagementData.logins || 0}</Typography>
                      <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                        <span>{loginGrowth > 0 ? "↗️" : "↘️"}</span>
                        <Typography variant="body2" color={loginGrowth > 0 ? "success.main" : "error.main"}>
                          {Math.abs(loginGrowth)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
            <Card sx={{ bgcolor: "#f5fff7", boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box bgcolor={colors.timeSpent} sx={{ p: 1, borderRadius: 1, mr: 2 }}>
                    <span style={{ color: "white" }}>⏱️</span>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="textSecondary">Time Spent (min)</Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" fontWeight="bold">{userEngagementData.timeSpent || 0}</Typography>
                      <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                        <span>{timeSpentGrowth > 0 ? "↗️" : "↘️"}</span>
                        <Typography variant="body2" color={timeSpentGrowth > 0 ? "success.main" : "error.main"}>
                          {Math.abs(timeSpentGrowth)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
            <Card sx={{ bgcolor: "#fffbf0", boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box bgcolor={colors.actions} sx={{ p: 1, borderRadius: 1, mr: 2 }}>
                    <span style={{ color: "white" }}>👆</span>
                  </Box>
                  <Box>
                    <Typography variant="h6" color="textSecondary">Actions Performed</Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" fontWeight="bold">{userEngagementData.actionsPerformed || 0}</Typography>
                      <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                        <span>{actionsGrowth > 0 ? "↗️" : "↘️"}</span>
                        <Typography variant="body2" color={actionsGrowth > 0 ? "success.main" : "error.main"}>
                          {Math.abs(actionsGrowth)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Main Charts Section */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          {/* Primary Engagement Metrics */}
          <Box sx={{ flex: '1 1 600px', minWidth: { xs: '100%', md: 'calc(66.66% - 12px)' } }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                User Engagement Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box height={350}>
                <BarChart
                  xAxis={[{ scaleType: "band", data: ["Logins", "Time Spent (min)", "Actions"] }]}
                  series={[
                    {
                      data: [
                        userEngagementData.logins || 0,
                        userEngagementData.timeSpent || 0,
                        userEngagementData.actionsPerformed || 0,
                      ],
                      color: colors.logins,
                      label: "Current Period",
                    },
                    {
                      data: [
                        (userEngagementData.previousLogins || 0),
                        (userEngagementData.previousTimeSpent || 0),
                        (userEngagementData.previousActions || 0),
                      ],
                      color: "#ccc",
                      label: "Previous Period",
                    },
                  ]}
                  height={300}
                  margin={{ top: 30, bottom: 30, left: 40, right: 40 }}
                />
              </Box>
            </Paper>
          </Box>

          {/* User Composition */}
          <Box sx={{ flex: '1 1 300px', minWidth: { xs: '100%', md: 'calc(33.33% - 12px)' } }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                User Composition
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box height={350} display="flex" flexDirection="column" justifyContent="center">
                <PieChart
                  series={[
                    {
                      data: userTypeData,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      arcLabel: (item) => `${item.label}: ${Math.round((item.value / userTypeData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%`,
                      arcLabelMinAngle: 20,
                    },
                  ]}
                  height={300}
                  margin={{ top: 10, bottom: 10 }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      padding: 0,
                    },
                  }}
                  colors={[colors.newUsers, colors.returningUsers, "#9e9e9e"]}
                />
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Weekly Trends */}
        <Box sx={{ width: '100%', mb: 3 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Weekly Engagement Trends
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box height={350}>
              <LineChart
                series={[
                  {
                    data: timeSeriesData.map(item => item.logins),
                    label: 'Logins',
                    color: colors.logins,
                  },
                  {
                    data: timeSeriesData.map(item => item.timeSpent),
                    label: 'Time Spent',
                    color: colors.timeSpent,
                  },
                  {
                    data: timeSeriesData.map(item => item.actions),
                    label: 'Actions',
                    color: colors.actions,
                  },
                ]}
                xAxis={[{
                  scaleType: 'point',
                  data: timeSeriesData.map(item => item.day),
                }]}
                height={300}
                margin={{ top: 30, bottom: 30, left: 40, right: 40 }}
              />
            </Box>
          </Paper>
        </Box>

        {/* User Growth Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 400px', minWidth: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  New Users This Month
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box height={250}>
                  <BarChart
                    series={[
                      { data: [userEngagementData.newUsersLastMonth || 0], label: "New Users", color: colors.newUsers },
                      { data: [userEngagementData.newUsersPreviousMonth || 0], label: "Previous Month", color: "#e1bee7" },
                    ]}
                    xAxis={[{ scaleType: "band", data: ["Monthly Comparison"] }]}
                    height={200}
                  />
                </Box>
                <Box mt={2} p={2} bgcolor="#f3e5f5" borderRadius={1}>
                  <Typography variant="body2">
                    {userEngagementData.newUsersLastMonth > 0 
                      ? `👍 New user signups increased by ${userEngagementData.newUsersLastMonth || 15}% compared to last month.`
                      : `👎 New user signups decreased by ${Math.abs(userEngagementData.newUsersLastMonth) || 5}% compared to last month.`
                    }
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 400px', minWidth: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Retention Rate
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box height={250}>
                  <BarChart
                    series={[
                      { 
                        data: [
                          userEngagementData.retentionRate7Days || 85, 
                          userEngagementData.retentionRate30Days || 72, 
                          userEngagementData.retentionRate90Days || 58
                        ], 
                        label: "Retention %", 
                        color: colors.returningUsers 
                      },
                    ]}
                    xAxis={[{ scaleType: "band", data: ["7 Days", "30 Days", "90 Days"] }]}
                    yAxis={[{ min: 0, max: 100 }]}
                    height={200}
                  />
                </Box>
                <Box mt={2} p={2} bgcolor="#ffebee" borderRadius={1}>
                  <Typography variant="body2">
                    The 30-day retention rate is {userEngagementData.retentionRateChange > 0 
                      ? `up ${userEngagementData.retentionRateChange || 3.5}%` 
                      : `down ${Math.abs(userEngagementData.retentionRateChange) || 2.1}%`} compared to the previous period.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
}