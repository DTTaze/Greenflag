import React from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  DialogContent,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AddShippingAccountForm = ({
  newShippingAccount,
  setNewShippingAccount,
  handleAddShippingAccount,
  handleUpdateShippingAccount,
  handleCloseDialog,
  handleOpenManageDialog,
  isEditing = false,
  resetForm,
}) => {
  const handleSubmit = () => {
    if (isEditing) {
      handleUpdateShippingAccount();
    } else {
      handleAddShippingAccount();
      resetForm();
    }
    handleOpenManageDialog();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShippingAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <DialogTitle
        sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
      >
        {isEditing ? "Edit Shipping Account" : "Add Shipping Account"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Tên tài khoản"
              name="name"
              fullWidth
              value={newShippingAccount.name}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="carrier-label">Đơn vị vận chuyển</InputLabel>
              <Select
                labelId="carrier-label"
                name="carrier"
                value={newShippingAccount.carrier}
                onChange={handleChange}
                label="Đơn vị vận chuyển"
              >
                <MenuItem value="ghn">Giao Hàng Nhanh</MenuItem>
                <MenuItem value="ghtk">Giao Hàng Tiết Kiệm</MenuItem>
                <MenuItem value="grab">Grab Hỏa Tốc</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Shop ID"
              name="shop_id"
              fullWidth
              value={newShippingAccount.shop_id}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Token API"
              name="token"
              fullWidth
              value={newShippingAccount.token}
              onChange={handleChange}
              required
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => {
            handleCloseDialog();
            handleOpenManageDialog();
          }}
          className="customer-button-secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="customer-button"
          disabled={
            !newShippingAccount.name ||
            !newShippingAccount.shop_id ||
            !newShippingAccount.carrier
          }
        >
          {isEditing ? "Save Changes" : "Add Account"}
        </Button>
      </DialogActions>
    </>
  );
};

export default AddShippingAccountForm;
