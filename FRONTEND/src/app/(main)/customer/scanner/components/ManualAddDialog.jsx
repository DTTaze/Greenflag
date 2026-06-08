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
import React, { useEffect, useState } from "react";

import { getEventNameById } from "./EventSelector";

export default function ManualAddDialog({
  open,
  onClose,
  selectedEvent,
  events,
  onSuccess,
  onError,
}) {
  const [manualUser, setManualUser] = useState({
    name: "",
    email: "",
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setManualUser({ name: "", email: "" });
    }
  }, [open]);

  const handleManualInputChange = (event) => {
    setManualUser({
      ...manualUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleManualAdd = async () => {
    if (!selectedEvent) {
      onSuccess("Please select an event first");
      onClose();
      return;
    }

    try {
      // Mock API call for manual add
      onClose();
      const eventName = getEventNameById(selectedEvent, events);
      onSuccess(`${manualUser.name} đã được thêm vào sự kiện: ${eventName}`);
    } catch (error) {
      console.error("Error adding user manually:", error);
      onError("Failed to add user manually");
    }
  };

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
              onChange={handleManualInputChange}
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
              onChange={handleManualInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">
              The user will be added to:{" "}
              {selectedEvent
                ? getEventNameById(selectedEvent, events)
                : "No event selected"}
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          className="customer-button"
          onClick={handleManualAdd}
          disabled={!manualUser.name || !manualUser.email}
          startIcon={<UserPlus size={20} />}
        >
          Add to Event
        </Button>
      </DialogActions>
    </Dialog>
  );
}
