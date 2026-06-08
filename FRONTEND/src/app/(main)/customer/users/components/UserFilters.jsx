import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const UserFilters = ({ events, filters, onFilterChange, onReset }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <TextField
        size="small"
        placeholder="Search by name or email"
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
          ),
        }}
        sx={{ minWidth: 250 }}
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Event</InputLabel>
        <Select
          value={filters.eventId}
          label="Event"
          onChange={(e) => onFilterChange("eventId", e.target.value)}
        >
          <MenuItem value="">All Events</MenuItem>
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={onReset} sx={{ ml: "auto" }}>
        Reset Filters
      </Button>
    </Box>
  );
};

export default UserFilters;
