import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import React from "react";

const ItemFilters = ({ filters, onFilterChange, onReset }) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "available", label: "Available" },
    { value: "sold_out", label: "Sold Out" },
    { value: "pending", label: "Pending" },
  ];

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && value >= 0)) {
      onFilterChange("minPrice", value);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="small"
            select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            size="small"
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handlePriceChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onReset}
            sx={{ height: "40px" }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemFilters;
