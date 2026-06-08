import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  CheckInUserByUserIdApi,
  CheckOutUserByUserIdApi,
  getEventUserByEventIdApi,
  getUserByIDPublicApi,
} from "@/src/utils/api";

import EventSelector, { getEventNameById } from "./EventSelector";
import HowItWorks from "./HowItWorks";
import ManualAddDialog from "./ManualAddDialog";
import QRScanner from "./QRScanner";
import { injectQRScannerStyles } from "./QRScannerStyles";
import ScannedUsersList from "./ScannedUsersList";

export default function CustomerQRScanner() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [scanning, setScanning] = useState(false);
  const [checkoutScanning, setCheckoutScanning] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [scannedUsers, setScannedUsers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    injectQRScannerStyles();
  }, []);

  // Fetch scanned users when event changes
  useEffect(() => {
    const fetchScannedUsers = async () => {
      if (selectedEvent) {
        try {
          const response = await getEventUserByEventIdApi(selectedEvent);
          console.log("Fetched scanned users: ", response);
          const users = response.data.map((user) => ({
            id: user.user_id,
            name: user.User.full_name,
            email: user.User.email,
            avatar:
              user.User.avatar_url ||
              `https://mui.com/static/images/avatar/${
                Math.floor(Math.random() * 8) + 1
              }.jpg`,
            scannedAt: user.joined_at || new Date().toISOString(),
            eventId: selectedEvent,
            eventTitle: user.Event.title,
          }));
          setScannedUsers(users);
        } catch (error) {
          console.error("Error fetching scanned users:", error);
          setError("Failed to fetch scanned users");
        }
      } else {
        setScannedUsers([]);
      }
    };

    fetchScannedUsers();
  }, [selectedEvent]);

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleStartScan = () => {
    setScanning(true);
    setLoading(true);
  };

  const handleStopScan = () => {
    setScanning(false);
    setLoading(false);
  };

  const handleGenericScan = async (public_id, isCheckout) => {
    const setLoad = isCheckout ? setCheckoutLoading : setLoading;
    const setScan = isCheckout ? setCheckoutScanning : setScanning;
    try {
      setLoad(true);
      console.log(
        `Scanned QR code for ${isCheckout ? "checkout" : "checkin"}: `,
        public_id,
      );

      const userResponse = await getUserByIDPublicApi(public_id);
      const userData = userResponse.data;
      console.log(
        "userdata.id after response in CustomerQRScanner: ",
        userData.id,
      );

      if (isCheckout) {
        await CheckOutUserByUserIdApi(userData.id, selectedEvent);
      } else {
        await CheckInUserByUserIdApi(userData.id, selectedEvent);
      }

      setScan(false);
      setLoad(false);

      const updatedResponse = await getEventUserByEventIdApi(selectedEvent);
      const updatedUsers = updatedResponse.data.map((user) => ({
        id: user.user_id,
        name: user.User.full_name,
        email: user.User.email,
        avatar:
          user.User.avatar_url ||
          `https://mui.com/static/images/avatar/${
            Math.floor(Math.random() * 8) + 1
          }.jpg`,
        scannedAt: user.joined_at || new Date().toISOString(),
        eventId: selectedEvent,
        eventTitle: user.Event.title,
      }));
      setScannedUsers(updatedUsers);

      const eventName = getEventNameById(selectedEvent, events);
      setSuccessMessage(
        isCheckout
          ? `Đã check out ${userData.full_name} khỏi sự kiện: ${eventName}`
          : `Đã thêm ${userData.full_name} vào sự kiện: ${eventName}`,
      );
      setShowSuccess(true);
    } catch (error) {
      console.error(
        `Error during ${isCheckout ? "checkout " : ""}scan process:`,
        error,
      );
      setError(
        isCheckout
          ? "Failed to process checkout scan"
          : "Failed to process scan",
      );
      setLoad(false);
      setScan(false);
    }
  };

  const handleScanResult = (public_id) => handleGenericScan(public_id, false);

  const handleRemoveUser = async (userId) => {
    try {
      // Here you would need to implement the remove user API call
      // For now, we'll just update the local state
      setScannedUsers(scannedUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error removing user:", error);
      setError("Failed to remove user");
    }
  };

  const handleCheckoutStartScan = () => {
    setCheckoutScanning(true);
    setCheckoutLoading(true);
  };

  const handleCheckoutStopScan = () => {
    setCheckoutScanning(false);
    setCheckoutLoading(false);
  };

  const handleCheckoutScanResult = (public_id) =>
    handleGenericScan(public_id, true);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="customer-content-container">
      <Box className="customer-section">
        <Typography className="customer-section-title">
          QR Code Scanner
        </Typography>
        <Typography paragraph>
          <br />
          Scan QR codes to check in or check out users from events. Select an
          event and start scanning, or add users manually.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid var(--light-green)",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                1. Select an Event
              </Typography>
              <EventSelector
                selectedEvent={selectedEvent}
                onEventChange={handleEventChange}
                onEventsLoaded={setEvents}
              />

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                2. Choose Action
              </Typography>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Check In" />
                <Tab label="Check Out" />
              </Tabs>

              <Typography variant="h6" gutterBottom>
                {activeTab === 0 ? "Check In User" : "Check Out User"}
              </Typography>
              <QRScanner
                scanning={activeTab === 0 ? scanning : checkoutScanning}
                loading={activeTab === 0 ? loading : checkoutLoading}
                onStartScan={
                  activeTab === 0 ? handleStartScan : handleCheckoutStartScan
                }
                onStopScan={
                  activeTab === 0 ? handleStopScan : handleCheckoutStopScan
                }
                onScanResult={
                  activeTab === 0 ? handleScanResult : handleCheckoutScanResult
                }
                disabled={!selectedEvent}
              />

              {!selectedEvent && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Please select an event before scanning
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  className="customer-button-secondary"
                  startIcon={<UserPlus size={20} />}
                  onClick={() => setManualAddOpen(true)}
                >
                  Add Manually
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                border: "1px solid var(--light-green)",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ScannedUsersList
                scannedUsers={scannedUsers}
                onRemoveUser={handleRemoveUser}
              />
            </Paper>
          </Grid>
        </Grid>

        <HowItWorks />
      </Box>

      <ManualAddDialog
        open={manualAddOpen}
        onClose={() => setManualAddOpen(false)}
        selectedEvent={selectedEvent}
        events={events}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          setShowSuccess(true);
        }}
        onError={setError}
      />

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
