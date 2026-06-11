"use client";

import { Calendar, ScanQrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import React from "react";

import { Button } from "@/src/components/ui/button";

export default function PartnerEventsPage() {
  const [eventName, setEventName] = React.useState("");
  const [qrSrc, setQrSrc] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState("");
  const t = useTranslations("partner");

  async function generate() {
    if (!eventName.trim()) {
      setError(t("events.errors.requiredName"));
      return;
    }

    setError("");
    setGenerating(true);
    try {
      const data = JSON.stringify({ event: eventName, id: Date.now() });
      const url = await QRCode.toDataURL(data, { margin: 1, width: 300 });
      setQrSrc(url);
    } catch (err) {
      console.error(err);
      setError(t("events.errors.generateFailed"));
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
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <Calendar size={28} />
            </div>
            <div>
              <div>
                <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-900 dark:text-slate-200">
                  {t("events.version")}
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {t("events.headline")}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                  {t("events.subtitle")}
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-blue-50 p-4 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
              <p className="text-sm font-semibold tracking-[0.18em] uppercase">
                {t("events.badge")}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                {t("events.panelDescription")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {t("events.createTitle")}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("events.createDescription")}
            </p>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("events.inputLabel")}
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={t("events.inputPlaceholder")}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={generate} disabled={generating}>
                  {generating
                    ? t("events.generating")
                    : t("events.generateBtn")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEventName("")}
                >
                  {t("events.clearBtn")}
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {t("events.qrSectionTitle")}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t("events.qrSectionDescription")}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                {t("events.qrBadge")}
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
                    <Button type="button" onClick={downloadQR}>
                      {t("events.downloadQr")}
                    </Button>
                    <a
                      href="/partner/scanner"
                      className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      <ScanQrCode className="mr-2" size={18} />
                      {t("events.openScanner")}
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {t("events.qrNotCreated")}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
