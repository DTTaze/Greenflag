import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const EventList = ({ events, onEdit, onDelete, onAdd }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "upcoming":
        return "info";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  if (events.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No events found
        </Typography>
        <IconButton color="primary" onClick={onAdd} sx={{ mt: 1 }} size="large">
          <AddIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Box
                  component="img"
                  src={event.images?.[0] || "/placeholder-image.jpg"}
                  alt={event.title}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />
              </TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                {new Date(event.start_time).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(event.end_time).toLocaleDateString()}
              </TableCell>
              <TableCell>{event.capacity}</TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(event.status)}
                  color={getStatusColor(event.status)}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onEdit(event)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(event.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventList;
