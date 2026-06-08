import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Divider, Stack, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import IconButton from "@mui/material/IconButton";
import SimpleLineChart from "./ChartAdmin";
import { getAllUserApi } from "@/src/utils/api";

export default function AdminDashboard() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  const displayedActivities = showAll
    ? recentActivities
    : recentActivities.slice(0, 5);

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your admin dashboard. Here's what's happening today.
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
        {/* Statistic Cards */}
        <Box>
          <Paper
            className="admin-card"
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#e3f2fd",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Users
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              1,285
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +12.5%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1 }}
            >
              <PeopleAltIcon sx={{ fontSize: 60 }} />
            </Box>
          </Paper>
        </Box>

        <Box>
          <Paper
            className="admin-card"
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#c8e6c9",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tasks Completed
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              824
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +8.2%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last week
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1 }}
            >
              <TaskAltIcon sx={{ fontSize: 60 }} />
            </Box>
          </Paper>
        </Box>

        <Box>
          <Paper
            className="admin-card"
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#fff9c4",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Items
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              452
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +5.3%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1 }}
            >
              <ShoppingBagIcon sx={{ fontSize: 60 }} />
            </Box>
          </Paper>
        </Box>

        <Box>
          <Paper
            className="admin-card"
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#ffe0b2",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              $28,450
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +16.8%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
          </Paper>
        </Box>
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
        <Paper className="admin-section" sx={{ p: 3, height: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Recent Activities</Typography>
            <Button
              size="small"
              variant="text"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "View All"}
            </Button>
          </Box>
          <Stack spacing={2} divider={<Divider flexItem />}>
            {loading ? (
              <Typography variant="body2" color="text.secondary">
                Loading activities...
              </Typography>
            ) : displayedActivities.length > 0 ? (
              displayedActivities.map((activity) => (
                <Box key={activity.id}>
                  <Typography variant="body2" fontWeight={500}>
                    {activity.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent activities
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
