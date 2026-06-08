import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function ItemForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    owner_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    status: "",
    purchase_limit_per_day: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        owner_id: initialData?.owner_id || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        stock: initialData?.stock || "",
        weight: initialData?.weight || "",
        length: initialData?.length || "",
        width: initialData?.width || "",
        height: initialData?.height || "",
        status: initialData?.status || "",
        purchase_limit_per_day:
          initialData?.purchase_limit_per_day || "Không giới hạn",
      });
    } else {
      setFormData({
        id: "",
        owner_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        status: "",
        purchase_limit_per_day: "",
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "add" ? "Add New Item" : "Edit Item"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Tên vật phẩm"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Giá trị (xu)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Tồn kho"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Cân nặng (g)"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Chiều dài (cm)"
            name="length"
            value={formData.length}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Chiều rộng (cm)"
            name="width"
            value={formData.width}
            onChange={handleChange}
            fullWidth
            required
          />{" "}
          <TextField
            margin="dense"
            label="Chiều cao (cm)"
            name="height"
            value={formData.height}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="available">Sẵn hàng</MenuItem>
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="sold_out">Hết hàng</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Chủ sở hữu"
            name="owner_id"
            value={formData.owner_id}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Giới hạn lượt mua/ngày"
            name="purchase_limit_per_day"
            value={formData.purchase_limit_per_day}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === "add" ? "Create" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
