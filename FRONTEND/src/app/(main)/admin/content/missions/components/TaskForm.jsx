import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function TaskForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coins: "",
    difficulty: "",
    total: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        title: initialData?.title || "",
        description: initialData?.description || "",
        coins: initialData?.coins || "",
        difficulty: initialData?.difficulty || "",
        total: initialData?.total || "",
      });
    } else {
      setFormData({
        id: "",
        title: "",
        description: "",
        coins: "",
        difficulty: "",
        total: "",
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
      <DialogTitle>{mode === "add" ? "Add New Task" : "Edit Task"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Tiêu đề"
            name="title"
            value={formData.title}
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
            required
          />
          <TextField
            margin="dense"
            label="Số xu thưởng"
            name="coins"
            value={formData.coins}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="difficulty-label">Độ khó</InputLabel>
            <Select
              labelId="difficulty-label"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              label="Trạng thái bài đăng"
            >
              <MenuItem value="easy">Dễ</MenuItem>
              <MenuItem value="medium">Trung bình</MenuItem>
              <MenuItem value="hard">Khó</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="Tổng tiến trình"
            name="total"
            value={formData.total}
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
