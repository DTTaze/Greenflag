"use client";

import { EventType, EVENT_STATUS } from "@/src/types/event/event.type";
import { Calendar, MapPin, ArrowRight, Coins } from "lucide-react";
import Link from "next/link";
import React from "react";

interface EventEmbeddedCardProps {
  event: EventType;
}

export default function EventEmbeddedCard({ event }: EventEmbeddedCardProps) {
  if (!event) return null;

  const publicId = event.publicId || (event as any).public_id || event.id;
  const startTime = event.startTime || (event as any).start_time;
  const endTime = event.endTime || (event as any).end_time;
  const coins = event.coins;
  const status = event.status;
  const imageUrl =
    event.images && event.images.length > 0
      ? event.images[0]
      : "/images/event-placeholder.png";

  // Format date elegantly
  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  // Get status badge configuration
  const getStatusBadge = (statusVal: EVENT_STATUS) => {
    const statusStr = String(statusVal).toLowerCase();
    switch (statusStr) {
      case EVENT_STATUS.UPCOMING:
        return (
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:border-blue-900/30 dark:bg-blue-950/40 dark:text-blue-400">
            Sắp diễn ra
          </span>
        );
      case EVENT_STATUS.ONGOING:
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400">
            Đang diễn ra
          </span>
        );
      case EVENT_STATUS.FINISHED:
        return (
          <span className="border-gray-150 inline-flex items-center rounded-full border bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-500 dark:border-gray-700/30 dark:bg-gray-800/40 dark:text-gray-400">
            Đã kết thúc
          </span>
        );
      case "cancelled":
      case "canceled":
        return (
          <span className="inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/40 dark:text-rose-400">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const statusStr = String(status).toLowerCase();
  const isMuted =
    status === EVENT_STATUS.FINISHED ||
    statusStr === "cancelled" ||
    statusStr === "canceled";

  return (
    <div
      className={`group mt-4 flex flex-col gap-4 rounded-xl border p-4 transition-all duration-300 sm:flex-row ${
        isMuted
          ? "border-slate-200 bg-slate-50 opacity-75 grayscale dark:border-slate-800 dark:bg-slate-900/40"
          : "border-emerald-100 bg-[#F8FAFC] hover:border-emerald-300 hover:shadow-md dark:border-emerald-950/30 dark:bg-emerald-950/5"
      }`}
    >
      {/* Event Thumbnail */}
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white sm:w-24 dark:border-gray-800">
        <img
          src={imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/event-placeholder.png";
          }}
        />
        {coins > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
            <Coins className="h-3 w-3" />
            <span>+{coins}</span>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {getStatusBadge(status)}
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
              Sự kiện đính kèm
            </span>
          </div>

          <h4 className="line-clamp-1 text-[15px] font-bold text-gray-800 transition-colors group-hover:text-emerald-700 dark:text-gray-100 dark:group-hover:text-emerald-400">
            {event.title}
          </h4>

          <p className="mt-1 line-clamp-2 text-[13px] text-gray-500 dark:text-gray-400">
            {event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-gray-200 pt-3 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="max-w-[150px] truncate">{event.location}</span>
              </div>
            )}
            {startTime && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{formatEventDate(startTime)}</span>
              </div>
            )}
          </div>

          <Link
            href={`/events/${publicId}`}
            className="inline-flex items-center gap-1 text-[13px] font-bold text-emerald-600 transition-all hover:translate-x-0.5 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Chi tiết sự kiện</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
