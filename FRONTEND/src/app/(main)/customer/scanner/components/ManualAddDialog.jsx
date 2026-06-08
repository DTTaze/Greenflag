import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { UserPlus } from "lucide-react";
import React from "react";

import { getEventNameById } from "./EventSelector";

export default function ManualAddDialog({
  open,
  onClose,
  manualUser,
  onManualInputChange,
  onManualAdd,
  selectedEvent,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add User Manually</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="name"
              value={manualUser.name}
              onChange={onManualInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={manualUser.email}
              onChange={onManualInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">
              The user will be added to:{" "}
              {selectedEvent
                ? getEventNameById(selectedEvent)
                : "No event selected"}
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          className="customer-button"
          onClick={onManualAdd}
          disabled={!manualUser.name || !manualUser.email}
          startIcon={<UserPlus size={20} />}
        >
          Add to Event
        </Button>
      </DialogActions>
    </Dialog>
  );
}
