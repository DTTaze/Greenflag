import {
  Avatar,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Coins, UserMinus } from "lucide-react";
import React from "react";

import getAmount from "@/src/utils/getAmount";

import { getStatusColor, getStatusLabel } from "./userListHelpers";

export default function UserDesktopTable({
  users,
  onRemoveUser,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
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
                            <Typography variant="body2" color="text.secondary">
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
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
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
