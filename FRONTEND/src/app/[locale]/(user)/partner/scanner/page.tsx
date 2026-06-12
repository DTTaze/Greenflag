"use client";

import { usePartnerScanner } from "./hooks/usePartnerScanner";
import { ScannerHeader } from "./components/ScannerHeader";
import { ScannerConfigPanel } from "./components/ScannerConfigPanel";
import { ScannerViewport } from "./components/ScannerViewport";

export default function PartnerScannerPage() {
  const {
    events,
    selectedEventId,
    setSelectedEventId,
    scanMode,
    setScanMode,
    loadingEvents,
    isProcessing,
    scanStatus,
    errorMessage,
    scannedResult,
    scannedUser,
    scannerControlsRef,
    handleQRCode,
    handleReset,
  } = usePartnerScanner();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <ScannerHeader />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Control and selection panel */}
        <ScannerConfigPanel
          events={events}
          selectedEventId={selectedEventId}
          setSelectedEventId={setSelectedEventId}
          scanMode={scanMode}
          setScanMode={setScanMode}
          loadingEvents={loadingEvents}
          scannedResult={scannedResult}
          scannedUser={scannedUser}
          onReset={handleReset}
        />

        {/* Video Scanner Feed Viewport */}
        <ScannerViewport
          selectedEventId={selectedEventId}
          isProcessing={isProcessing}
          scanStatus={scanStatus}
          errorMessage={errorMessage}
          scannerControlsRef={scannerControlsRef}
          onScan={handleQRCode}
        />
      </div>
    </div>
  );
}
