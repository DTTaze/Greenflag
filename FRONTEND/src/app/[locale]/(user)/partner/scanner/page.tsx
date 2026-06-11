"use client";

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  RotateCcw,
  ScanQrCode,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { toast } from "react-toastify";

import { Button } from "@/src/components/ui/button";
import { eventServices } from "@/src/services/event";

export default function PartnerScannerPage() {
  const t = useTranslations("partner");
  const locale = useLocale();

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [scannedResult, setScannedResult] = useState<string>("");

  // Play audio beep notification using Web Audio API
  const playBeep = (success: boolean) => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      if (success) {
        // High pitch beep for success
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        // Double low pitch buzz for error
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3 note
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn("AudioContext beep failed:", e);
    }
  };

  // Fetch partner's events on mount
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await eventServices.partnerGetMyEvents();
        if (res && Array.isArray(res)) {
          setEvents(res);
          if (res.length > 0) {
            setSelectedEventId(res[0].id);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách sự kiện:", err);
        toast.error("Không thể tải danh sách sự kiện.");
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, []);

  const handleQRCode = async (qrData: string) => {
    if (!selectedEventId) {
      toast.warning("Vui lòng chọn một sự kiện trước khi quét!");
      return;
    }

    setIsProcessing(true);
    setScannedResult(qrData);

    // Parse user_id from QR code payload
    let userId = qrData.trim();
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.userId) userId = parsed.userId;
      else if (parsed.user_id) userId = parsed.user_id;
      if (parsed.eventId && parsed.eventId !== selectedEventId) {
        toast.error("Mã vé này thuộc về sự kiện khác!");
        setScanStatus("error");
        playBeep(false);
        setTimeout(() => {
          setIsProcessing(false);
          setScanStatus("idle");
        }, 2000);
        return;
      }
    } catch {
      // If it's userId:eventId
      if (qrData.includes(":")) {
        const parts = qrData.split(":");
        userId = parts[0];
      }
    }

    try {
      const response = await eventServices.partnerCheckIn(
        selectedEventId,
        userId,
      );

      // Flash green, beep, toast success
      setScanStatus("success");
      playBeep(true);
      toast.success(
        locale === "vi"
          ? "Check-in thành công cho người tham gia!"
          : "Check-in successful for attendee!",
      );
    } catch (error: any) {
      // Flash red, beep, toast error
      setScanStatus("error");
      playBeep(false);

      const errMsg =
        error?.response?.data?.message ||
        (locale === "vi"
          ? "Mã QR không hợp lệ hoặc đã được sử dụng!"
          : "Invalid QR code or already checked in!");
      toast.error(errMsg);
    } finally {
      // Reset scanning state after 2 seconds debounce
      setTimeout(() => {
        setIsProcessing(false);
        setScanStatus("idle");
      }, 2200);
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (isProcessing) return; // Prevent spamming requests
      handleQRCode(result.rawValue);
    },
    constraints: {
      video: { facingMode: "environment" },
    },
    paused: isProcessing || !selectedEventId,
  });

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 1; }
        }
        .animate-scan {
          animation: scan 2.5s linear infinite;
        }
        @keyframes success-pulse {
          0%, 100% { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 0 5px rgba(16, 185, 129, 0.2); }
          50% { border-color: rgba(16, 185, 129, 1); box-shadow: 0 0 20px rgba(16, 185, 129, 0.7); }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s ease-in-out infinite;
        }
        @keyframes error-pulse {
          0%, 100% { border-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 5px rgba(239, 68, 68, 0.2); }
          50% { border-color: rgba(239, 68, 68, 1); box-shadow: 0 0 20px rgba(239, 68, 68, 0.7); }
        }
        .animate-error-pulse {
          animation: error-pulse 0.6s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <ScanQrCode size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {locale === "vi"
                  ? "Máy quét mã QR sự kiện"
                  : "Event QR Scanner"}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                {locale === "vi"
                  ? "Sử dụng camera của thiết bị để quét mã QR điểm danh khách dự sự kiện."
                  : "Use your device's camera to scan QR codes for event check-in."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Control and selection panel */}
        <section className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {locale === "vi"
                  ? "Cấu hình & Trạng thái"
                  : "Configuration & Status"}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {locale === "vi"
                  ? "Chọn sự kiện trước khi bắt đầu quét."
                  : "Select an event before starting the scan."}
              </p>
            </div>

            {loadingEvents ? (
              <div className="animate-pulse text-sm text-gray-500">
                {locale === "vi"
                  ? "Đang tải danh sách sự kiện..."
                  : "Loading events..."}
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 p-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                <p className="text-sm font-semibold">
                  {locale === "vi"
                    ? "Không tìm thấy sự kiện nào!"
                    : "No events found!"}
                </p>
                <p className="mt-1 text-xs">
                  {locale === "vi"
                    ? "Bạn phải tạo ít nhất một sự kiện trong trang Sự kiện trước khi sử dụng máy quét."
                    : "You must create at least one event in the Events page before using the scanner."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {locale === "vi" ? "Chọn sự kiện" : "Select Event"}
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-gray-100"
                  >
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.title || evt.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            {/* Scan Result Logs */}
            {scannedResult && (
              <div className="border-gray-250 rounded-2xl border bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <p className="text-xs font-semibold text-gray-500 uppercase dark:text-zinc-400">
                  {locale === "vi"
                    ? "Kết quả quét gần nhất"
                    : "Last Scanned Raw Result"}
                </p>
                <p className="mt-1 font-mono text-sm break-all text-gray-800 dark:text-zinc-200">
                  {scannedResult}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              variant="outline"
              type="button"
              className="flex-1"
              onClick={() => {
                setScannedResult("");
                setScanStatus("idle");
                setIsProcessing(false);
              }}
            >
              <RotateCcw className="mr-2" size={16} />
              Reset
            </Button>
          </div>
        </section>

        {/* Video Scanner Feed Viewport */}
        <section className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {!selectedEventId ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-zinc-400">
              <Camera
                size={48}
                className="mb-4 text-gray-300 dark:text-zinc-700"
              />
              <p className="text-sm font-semibold">
                {locale === "vi" ? "Chưa sẵn sàng" : "Not Ready"}
              </p>
              <p className="mt-1 text-xs">
                {locale === "vi"
                  ? "Vui lòng chọn hoặc tạo sự kiện để khởi động Camera."
                  : "Please select or create an event to activate the camera."}
              </p>
            </div>
          ) : (
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-md">
              {/* Video elements for zxing */}
              <video
                ref={ref}
                className="h-full w-full object-cover"
                playsInline
                muted
              />

              {/* Viewfinder Target laser frame */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className={`relative h-64 w-64 rounded-2xl border-2 transition-all duration-300 ${
                    scanStatus === "success"
                      ? "animate-success-pulse border-emerald-500 bg-emerald-500/5"
                      : scanStatus === "error"
                        ? "animate-error-pulse border-red-500 bg-red-500/5"
                        : "border-emerald-500/60"
                  }`}
                >
                  {/* Four Corner Marks */}
                  <div className="absolute -top-1 -left-1 h-4 w-4 rounded-tl-lg border-t-4 border-l-4 border-emerald-500" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-tr-lg border-t-4 border-r-4 border-emerald-500" />
                  <div className="absolute -bottom-1 -left-1 h-4 w-4 rounded-bl-lg border-b-4 border-l-4 border-emerald-500" />
                  <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-br-lg border-r-4 border-b-4 border-emerald-500" />

                  {/* Red Laser scan line */}
                  {!isProcessing && (
                    <div className="animate-scan absolute left-0 h-[2px] w-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  )}
                </div>
              </div>

              {/* API Processing State Overlay overlay */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-xs">
                  {scanStatus === "success" ? (
                    <>
                      <CheckCircle2
                        size={40}
                        className="animate-bounce text-emerald-500"
                      />
                      <span className="text-sm font-semibold text-white">
                        {locale === "vi" ? "Thành công!" : "Success!"}
                      </span>
                    </>
                  ) : scanStatus === "error" ? (
                    <>
                      <AlertCircle
                        size={40}
                        className="animate-bounce text-red-500"
                      />
                      <span className="text-sm font-semibold text-white">
                        {locale === "vi"
                          ? "Lỗi xác thực!"
                          : "Validation Error!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                      <span className="text-sm font-semibold text-white">
                        {locale === "vi"
                          ? "Đang xử lý..."
                          : "Processing check-in..."}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
