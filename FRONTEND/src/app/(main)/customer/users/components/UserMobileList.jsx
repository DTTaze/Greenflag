import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Coins, Star } from "lucide-react";
import React from "react";

import getAmount from "@/src/utils/getAmount";

import { getStatusColor, getStatusLabel } from "./userListHelpers";

export default function UserMobileList({ users, onEvaluate, onAddToEvent }) {
  return (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid item xs={12} key={user.id}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Avatar
                  src={user.avatar}
                  alt={user.full_name}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h6">{user.full_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Events
                  </Typography>
                  <Typography variant="body2">{user.events.length}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Coins
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Coins style={{ color: "#ed6c02" }} size={16} />
                    <Typography fontWeight={500}>
                      {getAmount(user.coins)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Events
              </Typography>
              <Stack spacing={1}>
                {user.events.map((event) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      backgroundColor: "var(--grey-100)",
                      borderRadius: 1,
                      border: "1px solid var(--grey-200)",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {event.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Chip
                          label={getStatusLabel(event.status)}
                          color={getStatusColor(event.status)}
                          size="small"
                        />
                        <Typography variant="caption">
                          {event.completion_rate}% completed
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onEvaluate(user, event.id)}
                      sx={{
                        minWidth: 0,
                        p: "4px",
                        color: "var(--primary-green)",
                        borderColor: "var(--light-green)",
                      }}
                    >
                      <Star size={16} />
                    </Button>
                  </Box>
                ))}
              </Stack>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => onAddToEvent(user)}
                  sx={{
                    bgcolor: "var(--primary-green)",
                    "&:hover": {
                      bgcolor: "var(--dark-green)",
                    },
                  }}
                >
                  Add to Event
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {users.length === 0 && (
        <Grid item xs={12}>
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              backgroundColor: "var(--grey-100)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
