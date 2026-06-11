"use client";

import { Calendar, ScanQrCode } from "lucide-react";
import QRCode from "qrcode";
import React from "react";

export default function PartnerEventsPage() {
  const [eventName, setEventName] = React.useState("");
  const [qrSrc, setQrSrc] = React.useState(null);
  const [generating, setGenerating] = React.useState(false);

  async function generate() {
    if (!eventName) return;
    setGenerating(true);
    try {
      const data = JSON.stringify({ event: eventName, id: Date.now() });
      const url = await QRCode.toDataURL(data, { margin: 1, width: 300 });
      setQrSrc(url);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  function downloadQR() {
    if (!qrSrc) return;
    const a = document.createElement("a");
    a.href = qrSrc;
    a.download = `${eventName || "event"}_qr.png`;
    a.click();
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-md bg-emerald-600 p-3 text-white">
          <Calendar />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Partner Events
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Organize campaigns, manage registrations and QR check-ins.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
            Create Event
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Event details, schedule and QR-based attendance settings.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event name"
              className="rounded-md border px-3 py-2"
            />
            <button
              type="button"
              onClick={generate}
              className="rounded-md bg-emerald-600 px-3 py-2 text-white"
            >
              {generating ? "Generating..." : "Generate QR"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
            QR Code
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Generated QR for event check-in.
          </p>
          <div className="mt-3">
            {qrSrc ? (
              <div className="flex flex-col items-start gap-3">
                <img
                  src={qrSrc}
                  alt="event-qr"
                  className="w-48 rounded-md border"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadQR}
                    className="rounded-md bg-emerald-600 px-3 py-2 text-white"
                  >
                    Download
                  </button>
                  <a
                    href="/customer/scanner"
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2"
                  >
                    Open Scanner <ScanQrCode />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No QR generated yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
