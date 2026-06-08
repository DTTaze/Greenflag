import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Coins, Star, UserMinus } from "lucide-react";
import React from "react";

import getAmount from "@/src/utils/getAmount";

const UserList = ({
  users,
  onEvaluate,
  onAddToEvent,
  onRemoveUser,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "In Progress";
      case "completed":
        return "Completed";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  if (!isMobile) {
    return (
      <TableContainer component={Paper} className="customer-table">
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Coins</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <React.Fragment key={user.id}>
                  {user.events.map((event, index) => (
                    <TableRow
                      key={`${user.id}-${event.id}`}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      {index === 0 ? (
                        <TableCell rowSpan={user.events.length}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={user.avatar}
                              alt={user.full_name}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {user.full_name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <Typography variant="body2">{event.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(event.status)}
                          color={getStatusColor(event.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ width: "200px" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={event.completion_rate}
                            sx={{
                              flexGrow: 1,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {event.completion_rate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Coins style={{ color: "#ed6c02" }} size={20} />
                          <Typography variant="body2">
                            {getAmount(user.coins)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Remove from event">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() =>
                              onRemoveUser(user, event, event.eventUser)
                            }
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.08)",
                              },
                            }}
                          >
                            <UserMinus size={20} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    No users found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </TableContainer>
    );
  }

  // Mobile view
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
};

export default UserList;
