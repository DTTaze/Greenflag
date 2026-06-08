import React, { useState } from "react";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";

export default function RecentActivityList({ recentActivities = [], loading }) {
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll
    ? recentActivities
    : recentActivities.slice(0, 5);

  return (
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
  );
}
