import { Avatar, Box, Grid, Typography } from "@mui/material";
import React from "react";

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

// Helper function to format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// Custom Timeline Component with improved styling
export const TimelineEvent = ({ date, status, icon: Icon, isLast }) => (
  <Box sx={{ display: "flex", mb: isLast ? 0 : 2 }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mr: 2,
      }}
    >
      <Avatar
        sx={{
          width: 35,
          height: 35,
          bgcolor: "var(--primary-green)",
          color: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Icon size={16} />
      </Avatar>
      {!isLast && (
        <Box
          sx={{
            width: 2,
            height: "100%",
            bgcolor: "var(--primary-green)",
            my: 1,
            opacity: 0.5,
          }}
        />
      )}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {formatDate(date)}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {status}
      </Typography>
    </Box>
  </Box>
);

// Section Title Component
export const SectionTitle = ({ title }) => (
  <Typography
    variant="h6"
    gutterBottom
    color="var(--primary-green)"
    sx={{
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      "&::before": {
        content: '""',
        width: 4,
        height: 24,
        backgroundColor: "var(--primary-green)",
        marginRight: 1,
        borderRadius: 1,
      },
    }}
  >
    {title}
  </Typography>
);

// Info Row Component
export const InfoRow = ({ label, value, fullWidth = false }) => (
  <Grid item xs={12} sm={fullWidth ? 12 : 6}>
    <Box sx={{ mb: 1 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value || "N/A"}
      </Typography>
    </Box>
  </Grid>
);
