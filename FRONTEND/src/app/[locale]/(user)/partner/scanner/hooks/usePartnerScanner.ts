import { useEffect, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { eventServices } from "@/src/services/event";
import { getUserByIdHandler } from "@/src/services/user/userHandlers";
import { EventType } from "@/src/types/event/event.type";
import { UserType } from "@/src/types/user/user.type";

export function usePartnerScanner() {
  const t = useTranslations("partner");
  const locale = useLocale();

  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [scannedResult, setScannedResult] = useState<string>("");
  const [scannedUser, setScannedUser] = useState<UserType | null>(null);

  const scannerControlsRef = useRef<any>(null);

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
        const data = res?.data || res || [];
        if (Array.isArray(data)) {
          setEvents(data);
          if (data.length > 0) {
            setSelectedEventId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách sự kiện:", err);
        toast.error(t("scanner.errLoadEventsFailed"));
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, []);

  const handleQRCode = async (qrData: string) => {
    if (!selectedEventId) {
      toast.warning(t("scanner.warnSelectEvent"));
      return;
    }

    setIsProcessing(true);
    setScannedResult(qrData);

    // Pause scanner
    if (scannerControlsRef.current) {
      try {
        scannerControlsRef.current.pause();
      } catch (e) {
        console.warn("Pause error:", e);
      }
    }

    // Parse user_id from QR code payload
    let userId = qrData.trim();
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.userId) userId = parsed.userId;
      else if (parsed.user_id) userId = parsed.user_id;
      if (parsed.eventId && parsed.eventId !== selectedEventId) {
        toast.error(t("scanner.errOtherEventTicket"));
        setScanStatus("error");
        playBeep(false);
        setTimeout(() => {
          setIsProcessing(false);
          setScanStatus("idle");
          // Resume scanner
          if (scannerControlsRef.current) {
            try {
              scannerControlsRef.current.resume();
            } catch (e) {
              console.warn("Resume error:", e);
            }
          }
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
      await eventServices.partnerCheckIn(
        selectedEventId,
        userId,
      );

      // Flash green, beep, toast success
      setScanStatus("success");
      playBeep(true);
      toast.success(t("scanner.successCheckin"));

      // Fetch user profile info
      try {
        const userRes = await getUserByIdHandler(userId);
        if (userRes && userRes.success && userRes.data) {
          setScannedUser(userRes.data);
        } else {
          setScannedUser(null);
        }
      } catch (err) {
        console.warn("Failed to fetch user details:", err);
        setScannedUser(null);
      }
    } catch (error: any) {
      // Flash red, beep, toast error
      setScanStatus("error");
      playBeep(false);

      const getErrorMessage = (err: any): string => {
        const serverCode = err?.response?.data?.code;
        const serverMessage = err?.response?.data?.message;

        if (serverCode === "event_checkin_already") {
          return t("scanner.errors.eventCheckinAlready");
        }
        if (serverCode === "event_user_not_found") {
          return t("scanner.errors.eventUserNotFound");
        }
        if (serverCode === "event_not_found") {
          return t("scanner.errors.eventNotFound");
        }
        if (serverCode === "user_not_found") {
          return t("scanner.errors.userNotFound");
        }

        if (typeof serverMessage === "string") {
          return serverMessage;
        }
        if (Array.isArray(serverMessage) && serverMessage.length > 0) {
          return serverMessage[0];
        }
        return t("scanner.errInvalidQrOrCheckedIn");
      };

      toast.error(getErrorMessage(error));
    } finally {
      // Reset scanning state after 2 seconds debounce
      setTimeout(() => {
        setIsProcessing(false);
        setScanStatus("idle");
        // Resume scanner
        if (scannerControlsRef.current) {
          try {
            scannerControlsRef.current.resume();
          } catch (e) {
            console.warn("Resume error:", e);
          }
        }
      }, 2200);
    }
  };

  const handleReset = () => {
    setScannedResult("");
    setScannedUser(null);
    setScanStatus("idle");
    setIsProcessing(false);
    if (scannerControlsRef.current) {
      try {
        scannerControlsRef.current.resume();
      } catch (e) {
        console.warn("Resume error:", e);
      }
    }
  };

  return {
    t,
    locale,
    events,
    selectedEventId,
    setSelectedEventId,
    loadingEvents,
    isProcessing,
    scanStatus,
    scannedResult,
    scannedUser,
    scannerControlsRef,
    handleQRCode,
    handleReset,
  };
}
