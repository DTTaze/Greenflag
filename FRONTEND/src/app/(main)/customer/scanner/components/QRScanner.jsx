import React, { useRef, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function QRScanner({
  scanning,
  loading,
  onStartScan,
  onStopScan,
  onScanResult,
  disabled,
}) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const scanControlsRef = useRef(null);

  const startScanning = async () => {
    try {
      const videoInputDevices =
        await BrowserMultiFormatReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        throw new Error("No camera found on this device.");
      }

      if (videoRef.current) {
        videoRef.current.style.display = "block";
        videoRef.current.style.width = "100%";
        videoRef.current.style.height = "100%";
        videoRef.current.style.objectFit = "contain";
      }

      const reader = new BrowserMultiFormatReader();
      codeReader.current = reader;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      await reader.decodeFromVideoDevice(
        videoInputDevices[0].deviceId,
        videoRef.current,
        (result, err, controls) => {
          scanControlsRef.current = controls;

          if (result) {
            onScanResult(result.getText());
            stopVideoStream();
            onStopScan();
            if (scanControlsRef.current) {
              scanControlsRef.current.stop();
            }
          }

          if (err && err.name !== "NotFoundException") {
            console.error("Error scanning QR code:", err.message);
          }
        }
      );
    } catch (e) {
      console.error("Could not access camera: ", e.message);
      onStopScan();
    }
  };

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      if (codeReader.current) {
        scanControlsRef.current.stop();
      }
      stopVideoStream();
    };
  }, []);

  const handleStartScan = () => {
    onStartScan();
    startScanning();
  };

  return (
    <Box className="customer-qr-scanner-container">
      <Box className="customer-qr-preview" style={{ position: "relative" }}>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 8,
            background: "#000",
            display: scanning ? "block" : "none",
          }}
          autoPlay
          muted
          playsInline
        />
        {scanning && (
          <div className="qr-corner-overlay" style={{ pointerEvents: "none" }}>
            <div className="qr-corner qr-corner-tl" />
            <div className="qr-corner qr-corner-tr" />
            <div className="qr-corner qr-corner-bl" />
            <div className="qr-corner qr-corner-br" />
          </div>
        )}
        {!scanning && !loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              bgcolor: "rgba(255,255,255,0.7)",
            }}
          >
            <QrCodeScannerIcon
              sx={{
                fontSize: 60,
                mb: 1,
                color: "var(--primary-green)",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Click "Start Scanning" to open your camera
            </Typography>
          </Box>
        )}
        {loading && !scanning && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.7)",
            }}
          >
            <CircularProgress color="success" />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 2,
        }}
      >
        {!scanning ? (
          <Button
            className="customer-button"
            startIcon={<QrCodeScannerIcon />}
            onClick={handleStartScan}
            disabled={disabled}
          >
            Start Scanning
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              stopVideoStream();
              onStopScan();
              if (codeReader.current) {
                scanControlsRef.current.stop();
              }
            }}
          >
            Stop Scanning
          </Button>
        )}
      </Box>
    </Box>
  );
}
