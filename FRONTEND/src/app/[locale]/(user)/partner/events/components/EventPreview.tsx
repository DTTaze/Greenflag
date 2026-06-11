import { ScanQrCode } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import React from "react";

type EventPreviewProps = {
  qrSrc: string | null;
  onDownload: () => void;
  labels: {
    sectionTitle: string;
    sectionDescription: string;
    badge: string;
    downloadQr: string;
    openScanner: string;
    qrNotCreated: string;
  };
};

export function EventPreview({ qrSrc, onDownload, labels }: EventPreviewProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {labels.sectionTitle}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {labels.sectionDescription}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
          {labels.badge}
        </span>
      </div>

      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
        {qrSrc ? (
          <>
            <img
              src={qrSrc}
              alt="event-qr"
              className="mx-auto h-48 w-48 rounded-3xl border border-gray-200 object-cover dark:border-gray-700"
            />
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button type="button" onClick={onDownload}>
                {labels.downloadQr}
              </Button>
              <a
                href="/customer/scanner"
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <ScanQrCode className="mr-2" size={18} />
                {labels.openScanner}
              </a>
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {labels.qrNotCreated}
          </div>
        )}
      </div>
    </section>
  );
}
