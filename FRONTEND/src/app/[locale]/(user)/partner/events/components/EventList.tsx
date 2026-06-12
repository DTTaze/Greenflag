"use client";

import { Calendar, MapPin, QrCode, Users, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { EventType } from "@/src/types/event/event.type";

type EventListLabels = {
  eventListTitle: string;
  eventListDesc: string;
  noEvents: string;
  loadingEvents: string;
  participants: string;
  viewQr: string;
  deleteConfirm?: string;
  deleteBtn?: string;
};

type EventListProps = {
  events: EventType[];
  loading: boolean;
  labels: EventListLabels;
  onViewQr: (eventId: string, eventTitle: string) => void;
  onSelectEvent: (event: EventType) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedEventId?: string | null;
};

function formatDateTime(dateString: string): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<string, string> = {
  upcoming:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  ongoing:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  finished:
    "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export function EventList({
  events,
  loading,
  labels,
  onViewQr,
  onSelectEvent,
  onDeleteEvent,
  selectedEventId = null,
}: EventListProps) {
  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="mb-6 flex flex-row items-center justify-between p-0">
        <div>
          <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
            {labels.eventListTitle}
          </CardTitle>
          <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
            {labels.eventListDesc}
          </CardDescription>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-emerald-800 uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
          {events.length}
        </span>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <span className="text-sm text-gray-500 dark:text-slate-400">
              {labels.loadingEvents}
            </span>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-emerald-200/50 bg-emerald-50/10 py-12 text-center dark:border-emerald-800/20 dark:bg-emerald-950/5">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-emerald-300 dark:text-emerald-700" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {labels.noEvents}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const isSelected = selectedEventId === event.id;
              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className={`group flex items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-300 cursor-pointer hover:scale-[1.005] hover:shadow-xs ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-100/20 dark:border-emerald-500 dark:bg-emerald-950/30 shadow-xs"
                      : "border-emerald-100/60 bg-emerald-50/20 hover:border-emerald-200 dark:border-emerald-900/30 dark:bg-emerald-950/10 dark:hover:border-emerald-800/50"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {event.images && event.images.length > 0 ? (
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="h-12 w-12 object-cover rounded-xl border border-emerald-100 dark:border-slate-800 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Calendar size={20} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">
                          {event.title}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[event.status] || STATUS_STYLES.finished}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location || "—"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.eventUsers?.length ?? 0}/{event.capacity}{" "}
                          {labels.participants}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateTime(event.startTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewQr(event.id, event.title);
                      }}
                      className="rounded-xl border-emerald-200 text-emerald-700 transition-all duration-200 hover:bg-emerald-50 dark:border-emerald-700/40 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                    >
                      <QrCode className="mr-1.5 h-3.5 w-3.5" />
                      {labels.viewQr}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(event.id);
                      }}
                      className="rounded-xl border-rose-200 text-rose-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/40 dark:text-rose-450 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
