"use client";

import { Calendar, ScanQrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Link } from "@/src/i18n/navigation";

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
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-3xl border border-emerald-200/50 bg-white/85 p-6 backdrop-blur-xl shadow-xs dark:border-emerald-500/20 dark:bg-slate-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="rounded-2xl bg-emerald-600 p-3.5 text-white shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:shadow-none transition-all duration-300">
            <Calendar size={28} />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold tracking-[0.1em] text-emerald-800 uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
              {t("events.version")}
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
              {t("events.headline")}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-zinc-400">
              {t("events.subtitle")}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/20 dark:bg-blue-950/10 max-w-sm">
          <p className="text-xs font-bold tracking-wider text-blue-800 uppercase dark:text-blue-400">
            {t("events.badge")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t("events.panelDescription")}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Create Event Card */}
        <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
              {t("events.createTitle")}
            </CardTitle>
            <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
              {t("events.createDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t("events.inputLabel")}
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={t("events.inputPlaceholder")}
                  className="mt-2 w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-800/30 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  type="button"
                  onClick={generate}
                  disabled={generating}
                  className="rounded-2xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-600 transition-all duration-300 px-5 py-2.5 h-auto"
                >
                  {generating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      {t("events.generating")}
                    </>
                  ) : (
                    t("events.generateBtn")
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEventName("")}
                  className="rounded-2xl border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/20 px-5 py-2.5 h-auto transition-all duration-300"
                >
                  {t("events.clearBtn")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Section Card */}
        <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
          <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
                {t("events.qrSectionTitle")}
              </CardTitle>
              <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                {t("events.qrSectionDescription")}
              </CardDescription>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-emerald-850 uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
              {t("events.qrBadge")}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-3xl border-2 border-dashed border-emerald-200/50 bg-emerald-50/10 p-8 text-center dark:border-emerald-800/20 dark:bg-emerald-950/5">
              {qrSrc ? (
                <div className="space-y-6">
                  <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-3xl border border-emerald-100 bg-white p-3 shadow-md transition-transform duration-300 hover:scale-102 dark:border-emerald-950 dark:bg-zinc-950">
                    <img
                      src={qrSrc}
                      alt="event-qr"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Button
                      type="button"
                      onClick={downloadQR}
                      className="w-full sm:w-auto rounded-2xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-650 transition-all duration-300 px-5 py-2.5 h-auto"
                    >
                      {t("events.downloadQr")}
                    </Button>
                    <Link
                      href="/partner/scanner"
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white/70 px-5 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900/50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    >
                      <ScanQrCode className="mr-2 h-4 w-4" size={18} />
                      {t("events.openScanner")}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t("events.qrNotCreated")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
