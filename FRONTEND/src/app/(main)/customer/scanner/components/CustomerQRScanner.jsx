import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { injectQRScannerStyles } from "./QRScannerStyles";
import EventSelector, { getEventNameById } from "./EventSelector";
import QRScanner from "./QRScanner";
import ScannedUsersList from "./ScannedUsersList";
import HowItWorks from "./HowItWorks";
import ManualAddDialog from "./ManualAddDialog";
import {
  getUserByIDPublicApi,
  getEventUserByEventIdApi,
  CheckInUserByUserIdApi,
  CheckOutUserByUserIdApi,
} from "@/src/utils/api";

export default function CustomerQRScanner() {
  const userInfo = useOutletContext();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [scanning, setScanning] = useState(false);
  const [checkoutScanning, setCheckoutScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [scannedUsers, setScannedUsers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [manualUser, setManualUser] = useState({
    name: "",
    email: "",
  });
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
            eventTitle: user.Event.title
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

  const handleScanResult = async (public_id) => {
    try {
      setLoading(true);
      console.log("Scanned QR code result: ", public_id);

      // Get user data
      const userResponse = await getUserByIDPublicApi(public_id);

      const userData = userResponse.data;
      console.log(
        "userdata.id after response in CustomerQRScanner: ",
        userData.id
      );

      // Check in user
      await CheckInUserByUserIdApi(userData.id, selectedEvent);

      setResult(userData.full_name);
      setScanning(false);
      setLoading(false);

      // Refresh scanned users list
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
        eventTitle: user.Event.title
      }));
      setScannedUsers(updatedUsers);

      setSuccessMessage(
        `Đã thêm ${userData.full_name} vào sự kiện: ${getEventNameById(
          selectedEvent,
          events
        )}`
      );
      setShowSuccess(true);
    } catch (error) {
      console.error("Error during scan process:", error);
      setError("Failed to process scan");
      setLoading(false);
      setScanning(false);
    }
  };

  const handleManualInputChange = (event) => {
    setManualUser({
      ...manualUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleManualAdd = async () => {
    if (!selectedEvent) {
      setSuccessMessage("Please select an event first");
      setShowSuccess(true);
      setManualAddOpen(false);
      return;
    }

    try {
      // Here you would need to implement the manual add API call
      // For now, we'll just show a message
      setManualAddOpen(false);
      setManualUser({ name: "", email: "" });
      setSuccessMessage(
        `${manualUser.name} đã được thêm vào sự kiện: ${getEventNameById(
          selectedEvent,
          events
        )}`
      );
      setShowSuccess(true);
    } catch (error) {
      console.error("Error adding user manually:", error);
      setError("Failed to add user manually");
    }
  };

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

  const handleCheckoutScanResult = async (public_id) => {
    try {
      setCheckoutLoading(true);
      console.log("Scanned QR code for checkout: ", public_id);

      // Get user data
      const userResponse = await getUserByIDPublicApi(public_id);
      const userData = userResponse.data;
      console.log(
        "userdata.id after response in CustomerQRScanner: ",
        userData.id
      );

      // Check out user
      await CheckOutUserByUserIdApi(userData.id, selectedEvent);

      setResult(userData.full_name);
      setCheckoutScanning(false);
      setCheckoutLoading(false);

      // Refresh scanned users list
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
        eventTitle: user.Event.title
      }));
      setScannedUsers(updatedUsers);

      setSuccessMessage(
        `Đã check out ${userData.full_name} khỏi sự kiện: ${getEventNameById(
          selectedEvent,
          events
        )}`
      );
      setShowSuccess(true);
    } catch (error) {
      console.error("Error during checkout scan process:", error);
      setError("Failed to process checkout scan");
      setCheckoutLoading(false);
      setCheckoutScanning(false);
    }
  };

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

              {activeTab === 0 ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Check In User
                  </Typography>
                  <QRScanner
                    scanning={scanning}
                    loading={loading}
                    onStartScan={handleStartScan}
                    onStopScan={handleStopScan}
                    onScanResult={handleScanResult}
                    disabled={!selectedEvent}
                  />
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Check Out User
                  </Typography>
                  <QRScanner
                    scanning={checkoutScanning}
                    loading={checkoutLoading}
                    onStartScan={handleCheckoutStartScan}
                    onStopScan={handleCheckoutStopScan}
                    onScanResult={handleCheckoutScanResult}
                    disabled={!selectedEvent}
                  />
                </>
              )}

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
                  startIcon={<PersonAddIcon />}
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
        manualUser={manualUser}
        onManualInputChange={handleManualInputChange}
        onManualAdd={handleManualAdd}
        selectedEvent={selectedEvent}
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
