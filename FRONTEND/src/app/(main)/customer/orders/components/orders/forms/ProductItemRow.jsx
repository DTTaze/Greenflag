import { Box, Checkbox, IconButton, Paper, Typography } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

const ProductItemRow = ({
  product,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Checkbox
        checked={isSelected}
        onChange={onToggleSelect}
        sx={{
          color: "#f97316",
          "&.Mui-checked": {
            color: "#f97316",
          },
        }}
      />
      <Typography variant="body1" sx={{ flex: 1 }}>
        {product.name}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          KL (gram):{" "}
          <span style={{ color: "#f97316", fontWeight: "bold" }}>
            {product.weight}
          </span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Số lượng:{" "}
          <span style={{ color: "#f97316", fontWeight: "bold" }}>
            {product.quantity}
          </span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mã sản phẩm: {product.code}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
        <IconButton size="small" sx={{ color: "#1976d2" }} onClick={onEdit}>
          <Pencil size={16} />
        </IconButton>
        <IconButton size="small" color="error" onClick={onDelete}>
          <Trash2 size={16} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ProductItemRow;
