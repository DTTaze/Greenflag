"use client";

import { ArrowRight, Leaf, Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { eventServices } from "@/src/services/event";
import { EventType } from "@/src/types/event/event.type";

interface EventSelectionModalProps {
  open: boolean;
  onCancel: () => void;
  onSelectEvent: (event: EventType) => void;
}

export default function EventSelectionModal({
  open,
  onCancel,
  onSelectEvent,
}: EventSelectionModalProps) {
  const t = useTranslations("forum");
  const locale = useLocale();

  const [recentEvents, setRecentEvents] = useState<EventType[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecentEvents = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await eventServices.getAllEvents({ status: "active" });
      if (res.success && Array.isArray(res.data)) {
        setRecentEvents(res.data);
      } else {
        setRecentEvents([]);
      }
    } catch (err) {
      toast.error(t("loadCommentsFailed"));
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSearchTerm("");
      fetchRecentEvents();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  const filteredEvents = recentEvents.filter((evt) =>
    evt.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl transform overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <span className="text-gray-850 text-[17px] font-bold dark:text-gray-100">
            {t("selectAttachedEvent")}
          </span>
          <button
            onClick={onCancel}
            type="button"
            className="hover:text-gray-650 dark:hover:bg-gray-850 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {isHistoryLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#2F9E44]" />
              <p className="mt-2 text-sm font-medium text-gray-500">
                {t("loadingEvents")}
              </p>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <Leaf className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
              <p className="mb-4 text-[14px] text-gray-500 dark:text-gray-400">
                {t("noEventsAvailable")}
              </p>
              <Link
                href="/partner/events"
                onClick={onCancel}
                className="inline-flex transform cursor-pointer items-center gap-2 rounded-lg bg-[#2F9E44] px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#1F6F2E] active:scale-[0.98]"
              >
                <span>{t("browsePublicEvents")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder={t("searchEventsPlaceholder") || "Tìm kiếm sự kiện..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-[13px] outline-none transition-all placeholder:text-gray-400 focus:border-[#2F9E44] focus:bg-white focus:ring-2 focus:ring-[#2F9E44]/10 dark:border-gray-800 dark:bg-gray-800/50 dark:placeholder:text-gray-500 dark:focus:border-[#2F9E44] dark:focus:bg-gray-900"
                />
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <div className="mb-3 rounded-full bg-gray-50 p-4 dark:bg-gray-800">
                    <Search className="h-8 w-8 animate-pulse text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-[14px] font-semibold text-gray-650 dark:text-gray-350">
                    {t("noEventsFound")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredEvents.map((evt) => {
                    const dateStr =
                      evt.startTime || (evt as any).start_time || evt.createdAt
                        ? new Intl.DateTimeFormat(
                            locale === "en" ? "en-US" : "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          ).format(
                            new Date(
                              evt.startTime ||
                                (evt as any).start_time ||
                                evt.createdAt,
                            ),
                          )
                        : "";
                    const location = evt.location || t("onlineEvent");
                    const evtImageUrl =
                      evt.images && evt.images.length > 0
                        ? evt.images[0]
                        : "/images/event-placeholder.png";

                    return (
                      <div
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt);
                          onCancel();
                        }}
                        className="flex cursor-pointer gap-3 rounded-xl border border-gray-100 p-2.5 transition-all hover:border-emerald-400 hover:bg-emerald-50/10 dark:border-gray-800 dark:hover:bg-emerald-950/10 hover:scale-[1.01] active:scale-[0.99] duration-150"
                      >
                        <div className="dark:border-gray-850 border-gray-105 h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white">
                          <img
                            src={evtImageUrl}
                            alt={evt.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/event-placeholder.png";
                            }}
                          />
                        </div>
                        <div className="flex flex-col justify-between overflow-hidden">
                          <div>
                            <p className="text-gray-850 line-clamp-1 text-[14px] font-bold dark:text-gray-200">
                              {evt.title}
                            </p>
                            <p className="line-clamp-1 text-[11px] text-gray-500 dark:text-gray-400">
                              📍 {location}
                            </p>
                          </div>
                          <p className="text-[11px] text-gray-400">📅 {dateStr}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
