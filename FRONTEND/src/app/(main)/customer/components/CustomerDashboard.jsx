import React from "react";
import { Box, Paper, Typography, Stack, Button } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ForestIcon from "@mui/icons-material/Forest";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TimelineIcon from "@mui/icons-material/Timeline";
import getAmount from "@/src/utils/getAmount";

export default function CustomerDashboard() {
  const userInfo = useOutletContext();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          Welcome, {userInfo?.full_name || "Customer"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your environmental impact and manage your account.
        </Typography>
      </Box>

      {/* Quick Stats Grid */}
      <Box
        className="customer-grid-container"
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
        {/* Environmental Impact Card */}
        <Paper className="customer-card">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ForestIcon sx={{ color: "success.main", mr: 1 }} />
            <Typography variant="h6">Environmental Impact</Typography>
          </Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            1,285 kg
          </Typography>
          <Typography variant="body2" color="text.secondary">
            CO2 Reduced
          </Typography>
        </Paper>

        {/* Active Orders Card */}
        <Paper className="customer-card">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocalShippingIcon sx={{ color: "primary.main", mr: 1 }} />
            <Typography variant="h6">Active Orders</Typography>
          </Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            3
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In Progress
          </Typography>
        </Paper>

        {/* Rewards Points Card */}
        <Paper className="customer-card">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AccountBalanceWalletIcon sx={{ color: "warning.main", mr: 1 }} />
            <Typography variant="h6">Eco Coins</Typography>
          </Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {getAmount(userInfo?.coins)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Available Coins
          </Typography>
        </Paper>

        {/* Impact Timeline Card */}
        <Paper className="customer-card">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <TimelineIcon sx={{ color: "info.main", mr: 1 }} />
            <Typography variant="h6">Impact Timeline</Typography>
          </Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            12
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed Projects
          </Typography>
        </Paper>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            className="customer-button"
            onClick={() => navigate("/customer/orders")}
          >
            View Orders
          </Button>
          <Button
            variant="contained"
            className="customer-button"
            onClick={() => navigate("/customer/rewards")}
          >
            Redeem Coins
          </Button>
          <Button
            variant="contained"
            className="customer-button"
            onClick={() => navigate("/customer/profile")}
          >
            Update Profile
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
