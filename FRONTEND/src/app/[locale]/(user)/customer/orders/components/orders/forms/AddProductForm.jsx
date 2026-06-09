import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import React from "react";

const AddProductForm = ({ newProduct, setNewProduct, onCancel, onSave }) => {
  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nhập tên"
              fullWidth
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="KL (gram)"
              fullWidth
              type="number"
              required
              value={newProduct.weight}
              onChange={(e) =>
                setNewProduct({ ...newProduct, weight: e.target.value })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Số lượng"
              fullWidth
              type="number"
              required
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  quantity: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Mã sản phẩm"
              fullWidth
              value={newProduct.code}
              onChange={(e) =>
                setNewProduct({ ...newProduct, code: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            color: "#f97316",
            borderColor: "#f97316",
            "&:hover": {
              borderColor: "#ea580c",
            },
          }}
        >
          Xóa
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!newProduct.name || !newProduct.weight}
          sx={{
            bgcolor: "#f97316",
            color: "white",
            "&:hover": {
              bgcolor: "#ea580c",
            },
          }}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  );
};

export default AddProductForm;
