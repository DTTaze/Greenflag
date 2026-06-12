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
import { Link } from "@/src/i18n/navigation";
import { eventServices } from "@/src/services/event";
import { CreateEventPayload } from "@/src/types/event/event.payload";
import { EventType } from "@/src/types/event/event.type";

import { EventForm } from "./components/EventForm";
import { EventList } from "./components/EventList";

const INITIAL_FORM: CreateEventPayload = {
  title: "",
  description: "",
  location: "",
  capacity: 50,
  coins: 10,
  end_sign: "",
  start_time: "",
  end_time: "",
};

function formatIsoToDateTimeLocal(isoString?: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function PartnerEventsPage() {
  const t = useTranslations("partner");

  const [form, setForm] = useState<CreateEventPayload>(INITIAL_FORM);
  const [events, setEvents] = useState<EventType[]>([]);
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [qrEventTitle, setQrEventTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  function handleFieldChange(
    field: keyof CreateEventPayload,
    value: string | number,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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

  function validateForm(): string | null {
    if (!form.title.trim()) return t("events.errors.requiredTitle");
    if (!form.description.trim()) return t("events.errors.requiredDescription");
    if (!form.location.trim()) return t("events.errors.requiredLocation");
    if (!form.end_sign) return t("events.errors.requiredEndSign");
    if (!form.start_time) return t("events.errors.requiredStartTime");
    if (!form.end_time) return t("events.errors.requiredEndTime");
    return null;
  }

  async function generateQrForEvent(eventId: string, eventTitle: string) {
    try {
      const qrData = JSON.stringify({ eventId, title: eventTitle });
      const url = await QRCode.toDataURL(qrData, { margin: 1, width: 300 });
      setQrSrc(url);
      setQrEventTitle(eventTitle);
    } catch (err) {
      console.error(err);
      setError(t("events.errors.generateFailed"));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload: CreateEventPayload = {
        ...form,
        end_sign: new Date(form.end_sign).toISOString(),
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      };
      const res = await eventServices.partnerCreateEvent(payload);
      const createdEvent = res?.data || res;

      toast.success(t("events.errors.createSuccess"));
      setForm(INITIAL_FORM);
      await loadEvents();

      if (createdEvent?.id) {
        await generateQrForEvent(createdEvent.id, createdEvent.title || form.title);
      }
    } catch (err) {
      console.error(err);
      setError(t("events.errors.createFailed"));
    } finally {
      setSaving(false);
    }
  }

  function handleSelectEvent(event: EventType) {
    setEditingEventId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      capacity: event.capacity ?? 50,
      coins: event.coins ?? 10,
      end_sign: formatIsoToDateTimeLocal(event.endSign),
      start_time: formatIsoToDateTimeLocal(event.startTime),
      end_time: formatIsoToDateTimeLocal(event.endTime),
    });
    setError("");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEventId) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload: CreateEventPayload = {
        ...form,
        end_sign: new Date(form.end_sign).toISOString(),
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      };
      await eventServices.partnerUpdateEvent(editingEventId, payload);
      toast.success(t("events.errors.updateSuccess"));

      setForm(INITIAL_FORM);
      setEditingEventId(null);
      await loadEvents();

      if (qrSrc && qrEventTitle) {
        const matchingEvent = events.find((ev) => ev.id === editingEventId);
        if (matchingEvent && qrEventTitle === matchingEvent.title) {
          await generateQrForEvent(editingEventId, form.title);
        }
      }
    } catch (err) {
      console.error(err);
      setError(t("events.errors.updateFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(eventId: string) {
    try {
      await eventServices.partnerDeleteEvent(eventId);
      toast.success(t("events.errors.deleteSuccess"));

      if (editingEventId === eventId) {
        setEditingEventId(null);
        setForm(INITIAL_FORM);
      }

      if (qrSrc) {
        const deletedEvent = events.find((ev) => ev.id === eventId);
        if (deletedEvent && qrEventTitle === deletedEvent.title) {
          setQrSrc(null);
          setQrEventTitle("");
        }
      }

      await loadEvents();
    } catch (err) {
      console.error(err);
      toast.error(t("events.errors.deleteFailed"));
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
          form={form}
          onFieldChange={handleFieldChange}
          saving={saving}
          error={error}
          onSubmit={editingEventId ? handleUpdate : handleCreate}
          isEditing={!!editingEventId}
          onReset={() => {
            setForm(INITIAL_FORM);
            setEditingEventId(null);
            setError("");
          }}
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
        onDeleteEvent={handleDelete}
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
    </div>
  );
}
