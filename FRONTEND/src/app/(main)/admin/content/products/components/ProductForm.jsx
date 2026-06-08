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

export default function ProductForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    seller_id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    product_status: "",
    post_status: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        seller_id: initialData?.seller_id || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        category: initialData?.category || "",
        product_status: initialData?.product_status || "",
        post_status: initialData?.post_status || "",
      });
    } else {
      setFormData({
        id: "",
        seller_id: "",
        name: "",
        description: "",
        price: "",
        category: "",
        product_status: "",
        post_status: "",
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
      <DialogTitle>
        {mode === "add" ? "Add New Product" : "Edit Product"}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Tên sản phẩm"
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
            label="Giá trị (VNĐ)"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormControl fullWidth margin="dense" required>
            <InputLabel id="category-label">Danh mục</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Danh mục"
            >
              <MenuItem value="recycled">Tái chế</MenuItem>
              <MenuItem value="handicraft">Thủ công</MenuItem>
              <MenuItem value="organic">Hữu cơ</MenuItem>
              <MenuItem value="plants">Cây trồng</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" required>
            <InputLabel id="product_status-label">
              Tình trạng sản phẩm
            </InputLabel>
            <Select
              labelId="product_status-label"
              name="product_status"
              value={formData.product_status}
              onChange={handleChange}
              label="Tình trạng sản phẩm"
            >
              <MenuItem value="new">Mới</MenuItem>
              <MenuItem value="used">Đã sử dụng</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" required>
            <InputLabel id="post_status-label">Trạng thái bài đăng</InputLabel>
            <Select
              labelId="post_status-label"
              name="post_status"
              value={formData.post_status}
              onChange={handleChange}
              label="Trạng thái bài đăng"
            >
              <MenuItem value="public">Công khai</MenuItem>
              <MenuItem value="private">Riêng tư</MenuItem>
              <MenuItem value="pending">Chờ duyệt</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Chủ sở hữu"
            name="seller_id"
            value={formData.seller_id}
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
