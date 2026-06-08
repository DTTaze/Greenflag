import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { getAllUserApi } from "@/src/utils/api";

import SimpleLineChart from "./ChartAdmin";
import RecentActivityList from "./RecentActivityList";
import StatCard from "./StatCard";

export default function AdminDashboard() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUserApi();
        if (response?.data) {
          // Transform user data into recent activities format and sort by last_logined
          const activities = response.data
            .map((user) => ({
              id: user.id,
              user: user.full_name,
              action: "logged in",
              time: new Date(user.last_logined).toLocaleString(),
              last_logined: new Date(user.last_logined),
            }))
            .sort((a, b) => b.last_logined - a.last_logined);
          setRecentActivities(activities);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your admin dashboard. Here&apos;s what&apos;s happening
          today.
        </Typography>
      </Box>

      {/* Admin Grid Container */}
      <Box
        className="admin-grid-container"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        <StatCard
          title="Total Users"
          value="1,285"
          bgColor="#e3f2fd"
          trendText="+12.5%"
          trendSubtext="Since last month"
          icon={PeopleAltIcon}
        />

        <StatCard
          title="Tasks Completed"
          value="824"
          bgColor="#c8e6c9"
          trendText="+8.2%"
          trendSubtext="Since last week"
          icon={TaskAltIcon}
        />

        <StatCard
          title="Total Items"
          value="452"
          bgColor="#fff9c4"
          trendText="+5.3%"
          trendSubtext="Since last month"
          icon={ShoppingBagIcon}
        />

        <StatCard
          title="Total Revenue"
          value="$28,450"
          bgColor="#ffe0b2"
          trendText="+16.8%"
          trendSubtext="Since last month"
        />
      </Box>

      {/* Charts and Recent Activities Grid */}
      <Box
        className="admin-grid-container"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "2fr 1fr",
          },
          gap: 3,
          mt: 3,
        }}
      >
        {/* Charts */}
        <Paper className="admin-chart-container" sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Activity Overview</Typography>
            <Button size="small" variant="outlined">
              View Details
            </Button>
          </Box>
          <SimpleLineChart />
        </Paper>

        {/* Recent Activities */}
        <RecentActivityList recentActivities={recentActivities} loading={loading} />
      </Box>
    </Box>
  );
}
