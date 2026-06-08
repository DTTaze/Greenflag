import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TimelineIcon from "@mui/icons-material/Timeline";

const LocationHistory = ({ locationHistory, status }) => {
  if (!locationHistory || locationHistory.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No location tracking available for this order.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 1,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "var(--primary-green)",
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TimelineIcon sx={{ mr: 1 }} /> Location History
      </Typography>

      {/* Location Timeline */}
      <Box sx={{ pl: 2 }}>
        {locationHistory.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              mb: index === locationHistory.length - 1 ? 0 : 4,
              position: "relative",
            }}
          >
            {/* Location Pin */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor:
                  index === locationHistory.length - 1
                    ? "var(--primary-green)"
                    : "var(--light-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:
                  index === locationHistory.length - 1
                    ? "white"
                    : "var(--primary-green)",
                border: "2px solid",
                borderColor: "var(--primary-green)",
                zIndex: 2,
              }}
            >
              <LocationOnIcon />
            </Box>

            {/* Vertical connecting line */}
            {index < locationHistory.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  top: 40,
                  bottom: -20,
                  width: 2,
                  bgcolor: "var(--grey-300)",
                  zIndex: 1,
                }}
              />
            )}

            {/* Location details */}
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color:
                    index === locationHistory.length - 1
                      ? "var(--primary-green)"
                      : "inherit",
                }}
              >
                {item.location}
                {index === locationHistory.length - 1 &&
                  status === "In Progress" && (
                    <Chip
                      label="Current"
                      color="success"
                      size="small"
                      sx={{ ml: 1, fontWeight: "bold" }}
                    />
                  )}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 0.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.time}
                </Typography>
              </Box>

              {/* Additional info for current location */}
              {index === locationHistory.length - 1 &&
                status === "In Progress" && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: "rgba(46, 125, 50, 0.05)",
                      borderRadius: 1,
                      border: "1px dashed var(--primary-green)",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Estimated arrival:</strong> 15 minutes
                    </Typography>
                  </Box>
                )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LocationHistory;
