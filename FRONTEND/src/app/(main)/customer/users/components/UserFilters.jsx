import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Search } from "lucide-react";
import React from "react";

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
            <Search
              style={{ marginRight: 8 }}
              size={20}
              className="text-gray-500"
            />
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
