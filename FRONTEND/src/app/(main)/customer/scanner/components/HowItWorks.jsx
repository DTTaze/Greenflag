import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Select an Event",
      description:
        "Choose the event that participants will be joining or leaving. This ensures users are added to or removed from the correct event.",
    },
    {
      number: 2,
      title: "Choose Action",
      description:
        "Select whether you want to check in (add) or check out (remove) participants from the event.",
    },
    {
      number: 3,
      title: "Scan User QR Code",
      description:
        "Ask participants to show their unique QR code from their user profile or event registration email.",
    },
    {
      number: 4,
      title: "Confirm Action",
      description:
        "The system automatically registers or removes the user from the event. You can view and manage all participants in the list.",
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        How It Works
      </Typography>
      <Grid container spacing={3}>
        {steps.map((step) => (
          <Grid item xs={12} sm={6} md={3} key={step.number}>
            <Card
              sx={{
                height: "100%",
                border: "1px solid var(--light-green)",
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mb: 1, color: "var(--primary-green)" }}
                >
                  Step {step.number}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
