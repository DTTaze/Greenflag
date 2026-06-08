import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Paper, Typography, IconButton } from "@mui/material";

export default function StatCard({
  title,
  value,
  bgColor = "#fff",
  trendText,
  trendSubtext,
  icon: IconComponent,
}) {
  return (
    <Paper
      className="admin-card"
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 140,
        position: "relative",
        backgroundColor: bgColor,
        borderRadius: 2,
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
        {value}
      </Typography>
      <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
        <TrendingUpIcon fontSize="small" color="success" />
        <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
          {trendText}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {trendSubtext}
        </Typography>
      </Box>
      {IconComponent && (
        <Box
          sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1 }}
        >
          <IconComponent sx={{ fontSize: 60 }} />
        </Box>
      )}
    </Paper>
  );
}
