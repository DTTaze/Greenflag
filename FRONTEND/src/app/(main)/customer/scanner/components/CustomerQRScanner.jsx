"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Info, AlertTriangle } from "lucide-react";

import {
  checkInUser,
  checkOutUser,
  getEventUsersByEventId,
  getUserByIDPublic,
} from "@/src/utils/api";

import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("0");

  useEffect(() => {
    injectQRScannerStyles();
  }, []);

  // Fetch scanned users when event changes
  const fetchScannedUsers = async () => {
    if (selectedEvent) {
      try {
        const response = await getEventUsersByEventId(selectedEvent);
        console.log("Fetched scanned users: ", response);
        const users = response.data.map((user) => ({
          id: user.user_id,
          name: user.User.full_name,
          email: user.User.email,
          avatar: user.User.avatar_url || null,
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

  useEffect(() => {
    fetchScannedUsers();
  }, [selectedEvent]);

  // Success message auto-hide timer
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

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

      const userResponse = await getUserByIDPublic(public_id);
      const userData = userResponse.data;
      console.log(
        "userdata.id after response in CustomerQRScanner: ",
        userData.id,
      );

      if (isCheckout) {
        await checkOutUser(userData.id, selectedEvent);
      } else {
        await checkInUser(userData.id, selectedEvent);
      }

      setScan(false);
      setLoad(false);

      // Refresh list
      await fetchScannedUsers();

      const eventName = getEventNameById(selectedEvent, events);
      setSuccessMessage(
        isCheckout
          ? `Đã check out ${userData.full_name} khỏi sự kiện: ${eventName}`
          : `Đã thêm ${userData.full_name} vào sự kiện: ${eventName}`,
      );
      setShowSuccess(true);
      setError("");
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

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-950">QR Code Scanner</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Scan QR codes to check in or check out users from events. Select an
          event and start scanning, or add users manually.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Scanner controls */}
        <div className="md:col-span-7 bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Event Selector */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-900">
                1. Select an Event
              </h4>
              <EventSelector
                selectedEvent={selectedEvent}
                onEventChange={handleEventChange}
                onEventsLoaded={setEvents}
              />
            </div>

            {/* Choose Action Tabs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-900">
                2. Choose Action
              </h4>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-gray-100 p-1 rounded-lg flex gap-1">
                  <TabsTrigger
                    value="0"
                    className="flex-1 py-1.5 text-xs font-semibold rounded-md transition-all text-gray-500 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm focus:outline-none"
                  >
                    Check In
                  </TabsTrigger>
                  <TabsTrigger
                    value="1"
                    className="flex-1 py-1.5 text-xs font-semibold rounded-md transition-all text-gray-500 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm focus:outline-none"
                  >
                    Check Out
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* QR Scanner viewport */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-sm text-gray-800 text-center">
                {activeTab === "0" ? "Check In User" : "Check Out User"}
              </h4>
              <QRScanner
                scanning={activeTab === "0" ? scanning : checkoutScanning}
                loading={activeTab === "0" ? loading : checkoutLoading}
                onStartScan={
                  activeTab === "0" ? handleStartScan : handleCheckoutStartScan
                }
                onStopScan={
                  activeTab === "0" ? handleStopScan : handleCheckoutStopScan
                }
                onScanResult={
                  activeTab === "0" ? handleScanResult : handleCheckoutScanResult
                }
                disabled={!selectedEvent}
              />
            </div>

            {/* Alert banners */}
            {!selectedEvent && (
              <div className="flex gap-2.5 items-start bg-amber-50 border border-amber-100 text-amber-800 p-3 rounded-lg text-xs">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>Please select an event before scanning</span>
              </div>
            )}

            {error && (
              <div className="flex gap-2.5 items-start bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg text-xs">
                <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setManualAddOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors shadow-sm"
            >
              <UserPlus size={16} />
              <span>Add Manually</span>
            </button>
          </div>
        </div>

        {/* Right Side: Scanned list */}
        <div className="md:col-span-5 bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <ScannedUsersList
            scannedUsers={scannedUsers}
            onRemoveUser={handleRemoveUser}
          />
        </div>
      </div>

      <HowItWorks />

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

      {/* Floating success banner toast */}
      {showSuccess && (
        <div className="fixed bottom-4 left-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm transition-all duration-300">
          <span>{successMessage}</span>
          <button
            onClick={() => setShowSuccess(false)}
            className="hover:text-emerald-100 font-bold ml-2 text-base"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
