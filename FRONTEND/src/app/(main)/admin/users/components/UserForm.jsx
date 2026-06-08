import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function UserForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    role_id: "",
    role_name: "",
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
    coins: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        role_id: initialData?.role_id || null,
        role_name: initialData?.roles?.name || null,
        full_name: initialData?.full_name || "",
        username: initialData?.username || "",
        email: initialData?.email || "",
        phone_number: initialData?.phone_number || "",
        coins: initialData?.coins?.amount || "",
      });
    } else {
      setFormData({
        id: "",
        role_id: "",
        role_name: "",
        full_name: "",
        username: "",
        email: "",
        phone_number: "",
        coins: "",
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
      <DialogTitle>{mode === "add" ? "Add New User" : "Edit User"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Họ tên"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Tên người dùng"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          {mode === "add" && (
            <TextField
              margin="dense"
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          )}
          <TextField
            margin="dense"
            label="Số điện thoại"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            fullWidth
          />
          {mode === "edit" && (
            <>
              <TextField
                margin="dense"
                label="Số xu"
                name="coins"
                value={formData.coins}
                fullWidth
                disabled
              />
              <TextField
                margin="dense"
                label="Vai trò"
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </>
          )}
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
