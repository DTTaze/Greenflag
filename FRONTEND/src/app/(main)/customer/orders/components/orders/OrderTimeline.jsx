import React from "react";
import { Box, Typography, Stepper, Step, StepLabel } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";

const OrderTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No timeline information available for this order.
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TimelineIcon sx={{ mr: 1, color: "var(--primary-green)" }} /> Order
        Timeline
      </Typography>
      <Box sx={{ maxHeight: "400px", overflow: "auto", pr: 1 }}>
        <Stepper orientation="vertical" sx={{ mt: 2 }}>
          {timeline.map((step, index) => (
            <Step key={index} active={true} completed={true}>
              <StepLabel
                StepIconProps={{
                  sx: { color: "var(--primary-green)" },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {step.status}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.time}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
};

export default OrderTimeline;
