"use client";

import { Calendar, ScanQrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Link } from "@/src/i18n/navigation";
import { eventServices } from "@/src/services/event";
import { EventType } from "@/src/types/event/event.type";
import { useEventForm } from "@/src/hooks/forms/useEventForm";

import { EventForm } from "./components/EventForm";
import { EventList } from "./components/EventList";

export default function PartnerEventsPage() {
  const t = useTranslations("partner");

  const [events, setEvents] = useState<EventType[]>([]);
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [qrEventTitle, setQrEventTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    errors,
    saving,
    editingEventId,
    selectedImages,
    previewUrls,
    handleImagesChange,
    handleRemoveImage,
    handleReset,
    handleSelectEvent,
  } = useEventForm(async (createdEvent?: any) => {
    await loadEvents();
    if (createdEvent?.id) {
      await generateQrForEvent(createdEvent.id, createdEvent.title);
    }
  });

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await eventServices.partnerGetMyEvents();
      const data = res?.data || res || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function generateQrForEvent(eventId: string, eventTitle: string) {
    try {
      const qrData = JSON.stringify({ eventId, title: eventTitle });
      const url = await QRCode.toDataURL(qrData, { margin: 1, width: 300 });
      setQrSrc(url);
      setQrEventTitle(eventTitle);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConfirmDelete() {
    if (!eventToDeleteId) return;
    setDeleting(true);
    try {
      await eventServices.partnerDeleteEvent(eventToDeleteId);
      toast.success(t("events.errors.deleteSuccess"));

      if (editingEventId === eventToDeleteId) {
        handleReset();
      }

      if (qrSrc) {
        const deletedEvent = events.find((ev) => ev.id === eventToDeleteId);
        if (deletedEvent && qrEventTitle === deletedEvent.title) {
          setQrSrc(null);
          setQrEventTitle("");
        }
      }

      setEventToDeleteId(null);
      await loadEvents();
    } catch (err) {
      console.error(err);
      toast.error(t("events.errors.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  }

  function downloadQR() {
    if (!qrSrc) return;
    const anchor = document.createElement("a");
    anchor.href = qrSrc;
    anchor.download = `${qrEventTitle || "event"}_qr.png`;
    anchor.click();
  }

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-6 rounded-3xl border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl md:flex-row md:items-center md:justify-between dark:border-emerald-500/20 dark:bg-slate-900/80">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="rounded-2xl bg-emerald-600 p-3.5 text-white shadow-md shadow-emerald-600/10 transition-all duration-300 dark:bg-emerald-500 dark:text-zinc-950 dark:shadow-none">
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
        <div className="max-w-sm rounded-2xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/20 dark:bg-blue-950/10">
          <p className="text-xs font-bold tracking-wider text-blue-800 uppercase dark:text-blue-400">
            {t("events.badge")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t("events.panelDescription")}
          </p>
        </div>
      </div>

      {/* Main Grid: Form + QR Preview */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Create Event Form */}
        <EventForm
          register={register}
          errors={errors}
          saving={saving}
          onSubmit={handleSubmit}
          isEditing={!!editingEventId}
          onReset={handleReset}
          selectedImages={selectedImages}
          previewUrls={previewUrls}
          onImagesChange={handleImagesChange}
          onRemoveImage={handleRemoveImage}
          labels={{
            createTitle: t("events.createTitle"),
            createDescription: t("events.createDescription"),
            titleLabel: t("events.titleLabel"),
            titlePlaceholder: t("events.titlePlaceholder"),
            descriptionLabel: t("events.descriptionLabel"),
            descriptionPlaceholder: t("events.descriptionPlaceholder"),
            locationLabel: t("events.locationLabel"),
            locationPlaceholder: t("events.locationPlaceholder"),
            capacityLabel: t("events.capacityLabel"),
            coinsLabel: t("events.coinsLabel"),
            endSignLabel: t("events.endSignLabel"),
            startTimeLabel: t("events.startTimeLabel"),
            endTimeLabel: t("events.endTimeLabel"),
            createBtn: t("events.createBtn"),
            creating: t("events.creating"),
            clearBtn: t("events.clearBtn"),
            updateBtn: t("events.updateBtn"),
            updating: t("events.updating"),
            editTitle: t("events.editTitle"),
            editDescription: t("events.editDescription"),
            cancelBtn: t("events.cancelBtn"),
            uploadImageLabel: t("events.uploadImageLabel"),
            clickToUpload: t("events.clickToUpload"),
            supportText: t("events.supportText"),
          }}
        />

        {/* QR Code Preview */}
        <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
          <CardHeader className="mb-6 flex flex-row items-center justify-between p-0">
            <div>
              <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
                {t("events.qrSectionTitle")}
              </CardTitle>
              <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                {t("events.qrSectionDescription")}
              </CardDescription>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-emerald-800 uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
              {t("events.qrBadge")}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-3xl border-2 border-dashed border-emerald-200/50 bg-emerald-50/10 p-8 text-center dark:border-emerald-800/20 dark:bg-emerald-950/5">
              {qrSrc ? (
                <div className="space-y-6">
                  {qrEventTitle && (
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {qrEventTitle}
                    </p>
                  )}
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
                      className="h-auto w-full rounded-2xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md shadow-emerald-600/10 transition-all duration-300 hover:bg-emerald-700 sm:w-auto dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-650"
                    >
                      {t("events.downloadQr")}
                    </Button>
                    <Link
                      href="/partner/scanner"
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-emerald-200 bg-white/70 px-5 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 sm:w-auto dark:border-emerald-500/30 dark:bg-slate-900/50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
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

      {/* Event List */}
      <EventList
        events={events}
        loading={loading}
        onViewQr={generateQrForEvent}
        onSelectEvent={handleSelectEvent}
        onDeleteEvent={setEventToDeleteId}
        selectedEventId={editingEventId}
        labels={{
          eventListTitle: t("events.eventListTitle"),
          eventListDesc: t("events.eventListDesc"),
          noEvents: t("events.noEvents"),
          loadingEvents: t("events.loadingEvents"),
          participants: t("events.participants"),
          viewQr: t("events.viewQr"),
          deleteConfirm: t("events.deleteConfirm"),
          deleteBtn: t("events.deleteBtn"),
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!eventToDeleteId} onOpenChange={(open) => { if (!open) setEventToDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              {t("events.deleteBtn")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-slate-400 mt-2">
              {t("events.deleteConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEventToDeleteId(null)}
              disabled={deleting}
              className="w-full sm:w-auto rounded-xl"
            >
              {t("events.cancelBtn")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-750 text-white rounded-xl"
            >
              {deleting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                t("events.deleteBtn")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
