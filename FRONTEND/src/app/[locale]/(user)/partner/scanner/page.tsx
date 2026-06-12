"use client";

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  RotateCcw,
  ScanQrCode,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useZxing } from "react-zxing";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
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
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-3xl border border-emerald-200/50 bg-white/85 p-6 backdrop-blur-xl shadow-xs dark:border-emerald-500/20 dark:bg-slate-900/80">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-emerald-600 p-3.5 text-white shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:shadow-none transition-all duration-300">
            <ScanQrCode size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {locale === "vi"
                ? "Máy quét mã QR sự kiện"
                : "Event QR Scanner"}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-gray-600 dark:text-zinc-400">
              {locale === "vi"
                ? "Sử dụng camera của thiết bị để quét mã QR điểm danh khách dự sự kiện."
                : "Use your device's camera to scan QR codes for event check-in."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Control and selection panel */}
        <Card className="flex flex-col justify-between rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
              {locale === "vi"
                ? "Cấu hình & Trạng thái"
                : "Configuration & Status"}
            </CardTitle>
            <CardDescription className="mt-1.5 text-sm text-gray-600 dark:text-slate-400">
              {locale === "vi"
                ? "Chọn sự kiện trước khi bắt đầu quét."
                : "Select an event before starting the scan."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6 flex-1">
              {loadingEvents ? (
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mr-2" />
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
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {locale === "vi" ? "Chọn sự kiện" : "Select Event"}
                    <div className="mt-2">
                      <Select
                        value={selectedEventId}
                        onValueChange={(val) => setSelectedEventId(val || "")}
                      >
                        <SelectTrigger className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-800/30 dark:bg-gray-950 dark:text-gray-100 h-auto flex justify-between items-center">
                          <SelectValue placeholder={locale === "vi" ? "Chọn sự kiện" : "Select Event"} />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900 border border-emerald-200/50 dark:border-emerald-500/20">
                          {events.map((evt) => (
                            <SelectItem key={evt.id} value={evt.id}>
                              {evt.title || evt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </label>
                </div>
              )}

              {/* Scan Result Logs */}
              {scannedResult && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 dark:border-emerald-950/40 dark:bg-zinc-950/50">
                  <p className="text-xs font-bold text-emerald-800 uppercase dark:text-emerald-450">
                    {locale === "vi"
                      ? "Kết quả quét gần nhất"
                      : "Last Scanned Raw Result"}
                  </p>
                  <p className="mt-1.5 font-mono text-sm break-all text-gray-800 dark:text-zinc-200">
                    {scannedResult}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                type="button"
                className="flex-1 rounded-2xl border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/20 px-5 py-2.5 h-auto transition-all duration-300 font-bold"
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
          </CardContent>
        </Card>

        {/* Video Scanner Feed Viewport */}
        <Card className="flex flex-col items-center justify-center rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
          {!selectedEventId ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-zinc-400">
              <Camera
                size={48}
                className="mb-4 text-emerald-600/30 dark:text-emerald-400/20"
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
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-emerald-200/50 bg-black shadow-md dark:border-emerald-500/30">
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
                  className={`relative h-64 w-64 rounded-2xl border-2 transition-all duration-300 ${scanStatus === "success"
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

              {/* API Processing State Overlay */}
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
        </Card>
      </div>
    </div>
  );
}
