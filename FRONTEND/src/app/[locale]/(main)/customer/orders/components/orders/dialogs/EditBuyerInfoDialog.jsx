import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";

const EditBuyerInfoDialog = ({
  open,
  onClose,
  buyerInfo,
  setBuyerInfo,
  handleUpdateBuyerInfo,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
      >
        Update Buyer Information
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Buyer Name"
              fullWidth
              value={buyerInfo.name}
              onChange={(e) =>
                setBuyerInfo({ ...buyerInfo, name: e.target.value })
              }
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={buyerInfo.phone}
              onChange={(e) =>
                setBuyerInfo({ ...buyerInfo, phone: e.target.value })
              }
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={buyerInfo.email}
              onChange={(e) =>
                setBuyerInfo({ ...buyerInfo, email: e.target.value })
              }
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Additional Notes"
              fullWidth
              multiline
              rows={3}
              value={buyerInfo.notes}
              onChange={(e) =>
                setBuyerInfo({ ...buyerInfo, notes: e.target.value })
              }
              margin="normal"
              placeholder="Special instructions or requests"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} className="customer-button-secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdateBuyerInfo} className="customer-button">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBuyerInfoDialog;
