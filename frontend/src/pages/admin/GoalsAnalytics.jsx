import React, { useState, useEffect } from "react";
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Skeleton,
  Divider,
  useTheme,
  Container,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab
} from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import axios from "axios";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function GoalChart() {
  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    fetchGoalsData();
  }, [timeFilter]);

  const fetchGoalsData = async () => {
    try {
      const response = await axios.get(`/api/v1/admin/analytics/goals?timeFrame=${timeFilter}`);
      setGoalData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user engagement data:", error);
      setError("Failed to load user engagement data");
      setLoading(false);
      toast.error("Failed to load user engagement data");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const chartColors = {
    goals: theme.palette.primary.main,
    sip: theme.palette.success.main,
    completion: theme.palette.warning.main,
    distribution: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ],
    trend: theme.palette.info.main
  };

  // Mock trend data - Replace with actual API data when available
  const trendData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    shortTerm: [12, 15, 18, 22, 24, 30],
    mediumTerm: [8, 9, 11, 14, 16, 20],
    longTerm: [5, 6, 7, 10, 12, 15]
  };

  // Mock completion data - Replace with actual API data when available
  const completionData = {
    shortTerm: {
      completed: 24,
      inProgress: 42,
      delayed: 14
    },
    mediumTerm: {
      completed: 18,
      inProgress: 36,
      delayed: 8
    },
    longTerm: {
      completed: 6,
      inProgress: 22,
      delayed: 4
    }
  };

  // Mock category data - Replace with actual API data when available
  const categoryData = {
    categories: ["Education", "Home", "Travel", "Retirement", "Vehicle", "Other"],
    counts: [45, 32, 28, 22, 18, 15]
  };

  const chartHeight = 300;
  const chartWidth = 500;

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            Goal Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and analyze user goal distribution and SIP requirements across different time frames
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="time-filter-label">Time Period</InputLabel>
            <Select
              labelId="time-filter-label"
              id="time-filter"
              value={timeFilter}
              label="Time Period"
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Basic Metrics" />
            <Tab label="Trends" />
            <Tab label="Categories" />
          </Tabs>
        </Box>

        {/* Basic Metrics Tab (Original Charts) */}
        {tabValue === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Goal Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Number of goals categorized by time horizon
                  </Typography>
                  
                  {loading ? (
                    <Skeleton variant="rectangular" width={chartWidth} height={chartHeight} />
                  ) : (
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: ["Short Term", "Medium Term", "Long Term"],
                          tickLabelStyle: {
                            fontSize: 12,
                            fontWeight: 500
                          }
                        },
                      ]}
                      series={[
                        {
                          data: [
                            goalData?.formattedCounts?.shortTerm || 0,
                            goalData?.formattedCounts?.mediumTerm || 0,
                            goalData?.formattedCounts?.longTerm || 0,
                          ],
                          color: chartColors.goals,
                          label: "Goals Count",
                          valueFormatter: (value) => `${value} goals`
                        },
                      ]}
                      width={chartWidth}
                      height={chartHeight}
                      tooltip={{ trigger: "item" }}
                      slotProps={{
                        legend: {
                          hidden: false,
                          position: { vertical: "top", horizontal: "right" }
                        }
                      }}
                    />
                  )}

                  {!loading && goalData && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight="medium">
                        Total Goals: {
                          (goalData.formattedCounts?.shortTerm || 0) + 
                          (goalData.formattedCounts?.mediumTerm || 0) + 
                          (goalData.formattedCounts?.longTerm || 0)
                        }
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Average SIP Required
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Average systematic investment plan amounts by goal term
                  </Typography>
                  
                  {loading ? (
                    <Skeleton variant="rectangular" width={chartWidth} height={chartHeight} />
                  ) : (
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: ["Short Term", "Medium Term", "Long Term"],
                          tickLabelStyle: {
                            fontSize: 12,
                            fontWeight: 500
                          }
                        },
                      ]}
                      series={[
                        {
                          data: [
                            goalData?.averagesPerTerm?.shortTermAvgSip || 0,
                            goalData?.averagesPerTerm?.mediumTermAvgSip || 0,
                            goalData?.averagesPerTerm?.longTermAvgSip || 0,
                          ],
                          color: chartColors.sip,
                          label: "Average SIP (₹)",
                          valueFormatter: (value) => `₹${value.toLocaleString()}`
                        },
                      ]}
                      width={chartWidth}
                      height={chartHeight}
                      tooltip={{ trigger: "item" }}
                      slotProps={{
                        legend: {
                          hidden: false,
                          position: { vertical: "top", horizontal: "right" }
                        }
                      }}
                    />
                  )}

                  {!loading && goalData && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight="medium">
                        Overall Average: ₹{Math.round((
                          (goalData.averagesPerTerm?.shortTermAvgSip || 0) + 
                          (goalData.averagesPerTerm?.mediumTermAvgSip || 0) + 
                          (goalData.averagesPerTerm?.longTermAvgSip || 0)
                        ) / 3).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Trends Tab */}
        {tabValue === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card 
                elevation={3} 
                sx={{ 
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Goal Creation Trends
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Monthly trend of new goals created by time horizon
                  </Typography>
                  
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={400} />
                  ) : (
                    <LineChart
                      xAxis={[{
                        data: trendData.months,
                        scaleType: 'point',
                        tickLabelStyle: {
                          fontSize: 12,
                          fontWeight: 500
                        }
                      }]}
                      series={[
                        {
                          data: trendData.shortTerm,
                          label: 'Short Term',
                          color: theme.palette.primary.main,
                          curve: 'natural'
                        },
                        {
                          data: trendData.mediumTerm,
                          label: 'Medium Term',
                          color: theme.palette.success.main,
                          curve: 'natural'
                        },
                        {
                          data: trendData.longTerm,
                          label: 'Long Term',
                          color: theme.palette.warning.main,
                          curve: 'natural'
                        }
                      ]}
                      width={1000}
                      height={400}
                      margin={{ left: 70, right: 70, top: 70, bottom: 30 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Categories Tab */}
        {tabValue === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Goal Categories Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Breakdown of goals by category types
                  </Typography>
                  
                  {loading ? (
                    <Skeleton variant="rectangular" width={chartWidth} height={chartHeight} />
                  ) : (
                    <PieChart
                      series={[
                        {
                          data: categoryData.categories.map((category, index) => ({
                            id: index,
                            value: categoryData.counts[index],
                            label: category
                          })),
                          innerRadius: 30,
                          outerRadius: 100,
                          paddingAngle: 1,
                          cornerRadius: 5,
                          startAngle: -90,
                          endAngle: 270,
                          cx: 150,
                          cy: 150
                        }
                      ]}
                      width={500}
                      height={400}
                      tooltip={{ trigger: "item" }}
                      slotProps={{
                        legend: {
                          hidden: false,
                          position: { vertical: "top", horizontal: "right" }
                        }
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    SIP Distribution by Category
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Average SIP amount per goal category
                  </Typography>
                  
                  {loading ? (
                    <Skeleton variant="rectangular" width={chartWidth} height={chartHeight} />
                  ) : (
                    <BarChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: categoryData.categories,
                          tickLabelStyle: {
                            fontSize: 12,
                            fontWeight: 500
                          }
                        },
                      ]}
                      series={[
                        {
                          data: [14500, 10200, 8700, 18400, 12500, 9600],
                          color: chartColors.sip,
                          label: "Average SIP (₹)",
                          valueFormatter: (value) => `₹${value.toLocaleString()}`
                        },
                      ]}
                      width={500}
                      height={400}
                      tooltip={{ trigger: "item" }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}