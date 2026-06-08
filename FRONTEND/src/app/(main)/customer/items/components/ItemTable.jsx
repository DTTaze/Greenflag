import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const ItemTable = ({ items, onEdit, onDelete, onAdd }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "success";
      case "sold_out":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "sold_out":
        return "Sold Out";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <TableContainer component={Paper} className="customer-table">
      <Table sx={{ minWidth: 650 }} aria-label="items table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell align="right">Daily Limit</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box
                    component="img"
                    src={item.images?.[0] || "/placeholder-image.jpg"}
                    alt={item.name}
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="right">{item.stock}</TableCell>
                <TableCell align="right">
                  {item.purchase_limit_per_day}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(item.status)}
                    size="small"
                    color={getStatusColor(item.status)}
                  />
                </TableCell>
                
                <TableCell align="right">
                {item.status === "available" && 
                  <IconButton
                    size="small"
                    onClick={() => onEdit(item)}
                    sx={{ color: "var(--primary-green)" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>}
                  <IconButton
                    size="small"
                    onClick={() => onDelete(item.id)}
                    sx={{ color: "var(--error)" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No items found. Try adjusting your filters or add a new item.
                </Typography>
                <Button
                  className="customer-button"
                  startIcon={<AddIcon />}
                  onClick={onAdd}
                  sx={{ mt: 2 }}
                >
                  Add Item
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;
