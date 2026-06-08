import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocationHistory from "../LocationHistory";

const OrderTrackingDialog = ({ open, onClose, order, handleViewDetails }) => {
  if (!order) return null;

  // Get the latest status and time safely
  const latestTimeline =
    order.timeline && order.timeline.length > 0
      ? order.timeline[order.timeline.length - 1]
      : { status: "Unknown", time: "N/A" };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="tracking-dialog-title"
      disableRestoreFocus
    >
      <DialogTitle
        id="tracking-dialog-title"
        sx={{
          bgcolor: "var(--light-green)",
          color: "var(--primary-green)",
        }}
      >
        Track Order #{order.id}
      </DialogTitle>
      <DialogContent dividers>
        {/* Enhanced location tracking history */}
        <LocationHistory
          locationHistory={order.locationHistory || []}
          status={order.status}
        />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Current Status
          </Typography>
          <Typography variant="body1">{latestTimeline.status}</Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {latestTimeline.time}
          </Typography>
        </Box>

        {order.collectorName && (
          <Box sx={{ p: 2, bgcolor: "var(--light-green)", borderRadius: 1 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "var(--primary-green)" }}
            >
              Collector Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  Name: {order.collectorName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  Contact: {order.collectorContact}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          className="customer-button-secondary"
          startIcon={<ReceiptIcon />}
          onClick={() => {
            onClose();
            setTimeout(() => handleViewDetails(order), 10);
          }}
        >
          View Details
        </Button>
        <Button onClick={onClose} className="customer-button" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderTrackingDialog;
