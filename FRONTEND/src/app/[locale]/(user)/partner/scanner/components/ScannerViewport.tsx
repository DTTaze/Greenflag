import { AlertCircle, Camera, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/src/components/ui/card";
import QRscanner from "../../../missions/components/QRscanner";

interface ScannerViewportProps {
  selectedEventId: string;
  isProcessing: boolean;
  scanStatus: "idle" | "success" | "error";
  errorMessage: string;
  scannerControlsRef: React.MutableRefObject<any>;
  onScan: (qrData: string) => void;
}

export function ScannerViewport({
  selectedEventId,
  isProcessing,
  scanStatus,
  errorMessage,
  scannerControlsRef,
  onScan,
}: ScannerViewportProps) {
  const t = useTranslations("partner");

  return (
    <Card className="flex flex-col items-center justify-center rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      {!selectedEventId ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-zinc-400">
          <Camera
            size={48}
            className="mb-4 text-emerald-600/30 dark:text-emerald-400/20"
          />
          <p className="text-sm font-semibold">
            {t("scanner.notReadyTitle")}
          </p>
          <p className="mt-1 text-xs">
            {t("scanner.notReadyDesc")}
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-0">
          {/* Custom Styles for Html5QrcodeScanner */}
          <style>{`
            #qr-reader {
              border: none !important;
              background: transparent !important;
            }
            #qr-reader__scan_region {
              background: transparent !important;
              display: flex !important;
              align-items: center;
              justify-content: center;
            }
            #qr-reader img[alt="Info icon"] {
              display: none !important;
            }
            #qr-reader img[alt="Camera icon"] {
              display: none !important;
            }
            #qr-reader button {
              background-color: #10b981 !important;
              color: white !important;
              border-radius: 1rem !important;
              padding: 0.6rem 1.2rem !important;
              font-weight: 700 !important;
              border: none !important;
              cursor: pointer !important;
              font-size: 0.875rem !important;
              transition: all 0.2s !important;
              box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06) !important;
              margin-top: 0.5rem !important;
            }
            #qr-reader button:hover {
              background-color: #0d9668 !important;
              transform: scale(1.02) !important;
            }
            #qr-reader button:active {
              transform: scale(0.98) !important;
            }
            #qr-reader select {
              border-radius: 0.75rem !important;
              padding: 0.4rem 0.8rem !important;
              border: 1px solid rgba(16, 185, 129, 0.2) !important;
              background-color: white !important;
              color: #1f2937 !important;
              font-size: 0.875rem !important;
              margin-top: 0.5rem !important;
              outline: none !important;
            }
            .dark #qr-reader select {
              background-color: #0f172a !important;
              color: #f3f4f6 !important;
              border: 1px solid rgba(16, 185, 129, 0.1) !important;
            }
          `}</style>

          {/* Relative wrapper scopes the viewfinder overlay only over the camera feed */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/50 shadow-md dark:border-emerald-500/30">
            <QRscanner
              key={selectedEventId}
              onScan={onScan}
              onError={(err: any) => console.warn("Scanner error:", err)}
              style={{ width: "100%", height: "100%" }}
              scannerControlsRef={scannerControlsRef}
            />

            {/* API Processing State Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/60 backdrop-blur-xs">
                {scanStatus === "success" ? (
                  <>
                    <CheckCircle2
                      size={40}
                      className="animate-bounce text-emerald-500"
                    />
                    <span className="text-sm font-semibold text-white">
                      {t("scanner.success")}
                    </span>
                  </>
                ) : scanStatus === "error" ? (
                  <>
                    <AlertCircle
                      size={40}
                      className="animate-bounce text-red-500"
                    />
                    <span className="text-sm font-semibold text-white px-4 text-center">
                      {errorMessage || t("scanner.error")}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                    <span className="text-sm font-semibold text-white">
                      {t("scanner.processing")}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
