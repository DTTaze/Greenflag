"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { QrCode } from "lucide-react";
import React, { useEffect, useRef } from "react";

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
        },
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
      if (codeReader.current && scanControlsRef.current) {
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
    <div className="mx-auto flex w-full max-w-md flex-col items-center">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-black shadow-inner">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${scanning ? "block" : "hidden"}`}
          autoPlay
          muted
          playsInline
        />

        {scanning && (
          <div className="pointer-events-none absolute inset-0 z-10 p-6">
            <div className="relative h-full w-full rounded-lg border-2 border-emerald-500/50">
              <div className="absolute top-0 left-0 -mt-1 -ml-1 h-6 w-6 rounded-tl border-t-4 border-l-4 border-emerald-500" />
              <div className="absolute top-0 right-0 -mt-1 -mr-1 h-6 w-6 rounded-tr border-t-4 border-r-4 border-emerald-500" />
              <div className="absolute bottom-0 left-0 -mb-1 -ml-1 h-6 w-6 rounded-bl border-b-4 border-l-4 border-emerald-500" />
              <div className="absolute right-0 bottom-0 -mr-1 -mb-1 h-6 w-6 rounded-br border-r-4 border-b-4 border-emerald-500" />
            </div>
          </div>
        )}

        {!scanning && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <QrCode className="mb-2 h-16 w-16 animate-pulse text-emerald-600" />
            <span className="text-xs text-gray-400">
              Click &quot;Start Scanning&quot; to open camera
            </span>
          </div>
        )}

        {loading && !scanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        )}
      </div>

      <div className="mt-4 flex w-full justify-center gap-3">
        {!scanning ? (
          <button
            onClick={handleStartScan}
            disabled={disabled}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <QrCode size={18} />
            <span>Start Scanning</span>
          </button>
        ) : (
          <button
            onClick={() => {
              stopVideoStream();
              onStopScan();
              if (codeReader.current && scanControlsRef.current) {
                scanControlsRef.current.stop();
              }
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700"
          >
            <span>Stop Scanning</span>
          </button>
        )}
      </div>
    </div>
  );
}
