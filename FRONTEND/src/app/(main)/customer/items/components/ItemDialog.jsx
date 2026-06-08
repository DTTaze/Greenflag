import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import MultiImageUpload from "@/src/components/common/MultiImageUpload";

const INITIAL_FORM_STATE = {
  name: "",
  price: "",
  stock: "",
  description: "",
  status: "",
  purchase_limit_per_day: 1,
  weight: "",
  length: "",
  width: "",
  height: "",
};

const ItemDialog = ({ open, onClose, onSave, item, isSubmitting }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setImages([]);
    setPreviewImages([]);
    setErrors({});
  };

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        stock: item.stock || "",
        description: item.description || "",
        status: item.status || "",
        purchase_limit_per_day: item.purchase_limit_per_day || 1,
        weight: item.weight || "",
        length: item.length || "",
        width: item.width || "",
        height: item.height || "",
      });
      setPreviewImages(item.images || []);
    } else {
      resetForm();
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImagesSelected = (files) => {
    setImages((prev) => [...prev, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "Stock must be 0 or greater";
    if (
      !formData.purchase_limit_per_day ||
      formData.purchase_limit_per_day < 1
    ) {
      newErrors.purchase_limit_per_day = "Daily limit must be at least 1";
    }
    if (!formData.weight || formData.weight <= 0)
      newErrors.weight = "Weight must be greater than 0";
    if (!formData.length || formData.length <= 0)
      newErrors.length = "Length must be greater than 0";
    if (!formData.width || formData.width <= 0)
      newErrors.width = "Width must be greater than 0";
    if (!formData.height || formData.height <= 0)
      newErrors.height = "Height must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData, images);
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? "Edit Item" : "Add New Item"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              required
              InputProps={{
                startAdornment: "$",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              error={!!errors.stock}
              helperText={errors.stock}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (g)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              error={!!errors.weight}
              helperText={errors.weight}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Length (cm)"
              name="length"
              type="number"
              value={formData.length}
              onChange={handleChange}
              error={!!errors.length}
              helperText={errors.length}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Width (cm)"
              name="width"
              type="number"
              value={formData.width}
              onChange={handleChange}
              error={!!errors.width}
              helperText={errors.width}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              error={!!errors.height}
              helperText={errors.height}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Daily Purchase Limit"
              name="purchase_limit_per_day"
              type="number"
              value={formData.purchase_limit_per_day}
              onChange={handleChange}
              error={!!errors.purchase_limit_per_day}
              helperText={errors.purchase_limit_per_day}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold_out">Sold Out</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <MultiImageUpload
              previewImages={previewImages}
              onImageChange={handleImagesSelected}
              onRemoveImage={handleRemoveImage}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className="customer-button"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Saving..." : item ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDialog;
