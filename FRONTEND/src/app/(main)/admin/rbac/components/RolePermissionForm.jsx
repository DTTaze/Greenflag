import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
    status: "",
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
        status: initialData?.status || "",
      });
    } else {
      setFormData({
        id: "",
        owner_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "",
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
            label="Giá trị"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Hàng trong kho"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Trạng thái"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Chủ sở hữu"
            name="owner_id"
            value={formData.owner_id}
            onChange={handleChange}
            fullWidth
            required
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
