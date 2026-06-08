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
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-gray-100 shadow-inner flex items-center justify-center">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${scanning ? "block" : "hidden"}`}
          autoPlay
          muted
          playsInline
        />
        
        {scanning && (
          <div className="absolute inset-0 pointer-events-none z-10 p-6">
            <div className="w-full h-full border-2 border-emerald-500/50 rounded-lg relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1 rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1 rounded-br" />
            </div>
          </div>
        )}

        {!scanning && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <QrCode className="w-16 h-16 mb-2 text-emerald-600 animate-pulse" />
            <span className="text-xs text-gray-400">
              Click &quot;Start Scanning&quot; to open camera
            </span>
          </div>
        )}

        {loading && !scanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3 mt-4 w-full">
        {!scanning ? (
          <button
            onClick={handleStartScan}
            disabled={disabled}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            <span>Stop Scanning</span>
          </button>
        )}
      </div>
    </div>
  );
}
