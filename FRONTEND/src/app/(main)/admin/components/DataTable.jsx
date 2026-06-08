import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

// Custom NoRowsOverlay component
function CustomNoRowsOverlay() {
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      <Typography variant="h6" color="text.secondary">
        No records found
      </Typography>
    </Stack>
  );
}

// Custom Loading Overlay
function CustomLoadingOverlay() {
  return (
    <Stack
      spacing={1}
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <LinearProgress color="primary" style={{ width: "50%" }} />
      <Typography variant="body2" color="text.secondary">
        Loading data...
      </Typography>
    </Stack>
  );
}

export default function DataTable({
  title,
  columns,
  rows,
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
}) {
  // Function to render status cells with color-coded chips
  const renderStatusCell = (params) => {
    if (params.field === "status") {
      const statusColors = {
        Active: "success",
        Inactive: "error",
        Pending: "warning",
        Completed: "success",
        "In Progress": "info",
        Todo: "warning",
      };

      const status = params.value;
      const color = statusColors[status] || "default";

      return (
        <Chip
          label={status}
          color={color}
          size="small"
          variant="outlined"
          sx={{ minWidth: 90, justifyContent: "center" }}
        />
      );
    }
    return params.value;
  };

  // Add renderCell to columns that need special rendering
  const enhancedColumns = columns.map((column) => {
    if (column.field === "status") {
      return { ...column, renderCell: renderStatusCell };
    }
    return column;
  });

  // Action column with better styling
  const actionColumn = {
    field: "actions",
    headerName: "Thao tác",
    width: 150,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Stack direction="row" spacing={1} justifyContent="center">
        {onView && (
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={() => onView(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(params.row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    ),
  };

  const allColumns = [...enhancedColumns, actionColumn];

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        p: 3,
        mb: 3,
        boxShadow: (theme) => theme.shadows[2],
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" component="div" fontWeight={600}>
          {title}
        </Typography>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              boxShadow: 2,
            }}
          >
            Add New
          </Button>
        )}
      </Box>
      <Box sx={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={allColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          density="standard"
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: CustomNoRowsOverlay,
            LoadingOverlay: CustomLoadingOverlay,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              
            },
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.08),
              borderRadius: 1,
              color: (theme) => theme.palette.text.primary,
              fontWeight: 600,
            },
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.02),
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.08),
            },
            "& .MuiDataGrid-cell": {
              fontSize: 14,
            },
          }}
        />
      </Box>
    </Paper>
  );
}
