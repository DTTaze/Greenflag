import {
  Box,
  CircularProgress,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "lucide-react";
import React, { useState } from "react";

const LocationSelect = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  loading,
  disabled,
}) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes((search || "").toLowerCase()),
  );

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
        {label} <span style={{ color: "red" }}>*</span>
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            border: "1px solid #e0e0e0",
            borderRadius: 1,
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2">Đang tải...</Typography>
        </Box>
      ) : (
        <FormControl
          fullWidth
          variant="outlined"
          size="small"
          disabled={disabled}
        >
          <Select
            value={value || ""}
            onChange={onChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography color="text.secondary">{placeholder}</Typography>
                );
              }
              const found = options.find(
                (opt) => opt.id === selected || opt.code === selected,
              );
              return found ? found.name : "";
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            <Box
              sx={{
                p: 1,
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                zIndex: 1,
              }}
            >
              <TextField
                placeholder={`Tìm kiếm ${label.toLowerCase()}...`}
                size="small"
                fullWidth
                variant="outlined"
                value={search}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </Box>
            {filteredOptions.map((opt) => (
              <MenuItem key={opt.id || opt.code} value={opt.id || opt.code}>
                {opt.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default LocationSelect;
