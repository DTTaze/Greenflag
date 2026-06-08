import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <Card className="event-card">
      <Box className="event-card-image">
        <CardMedia
          component="img"
          image={event.images?.[event.id]}
          alt={event.title}
        />
        <Box className="event-card-date">
          {new Date(event.start_time).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Box>
      </Box>
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            className="event-card-title"
            sx={{ flex: 1 }}
          >
            {event.title}
          </Typography>
          <Box>
            <Chip
              label={event.status}
              size="small"
              color={
                event.status === "active"
                  ? "success"
                  : event.status === "upcoming"
                  ? "info"
                  : "default"
              }
              sx={{ textTransform: "capitalize" }}
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
            height: "40px",
          }}
        >
          {event.description}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOnIcon
            fontSize="small"
            sx={{ color: "var(--text-light)", mr: 0.5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PeopleIcon
            fontSize="small"
            sx={{ color: "var(--text-light)", mr: 0.5 }}
          />
          <Typography variant="body2" color="text.secondary">
            {event.capacity} Capacity
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => onEdit(event)}
            sx={{ color: "var(--primary-green)" }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(event.id)}
            sx={{ color: "var(--error)" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
