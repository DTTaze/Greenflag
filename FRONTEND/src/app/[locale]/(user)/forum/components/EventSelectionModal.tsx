"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Leaf, ArrowRight, X } from "lucide-react";
import Link from "next/link";
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
  const [recentEvents, setRecentEvents] = useState<EventType[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    if (open) {
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

  const fetchRecentEvents = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await eventServices.getEventsSignedSelf();
      if (res.success && Array.isArray(res.data)) {
        const events = res.data
          .map((item: any) => item?.event || item?.Event)
          .filter(Boolean);
        setRecentEvents(events);
      } else {
        setRecentEvents([]);
      }
    } catch (err) {
      toast.error("Không thể tải danh sách sự kiện đã tham gia.");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl transform overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <span className="text-[17px] font-bold text-gray-800 dark:text-gray-100">
            Chọn sự kiện đính kèm
          </span>
          <button
            onClick={onCancel}
            type="button"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {isHistoryLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#2F9E44]" />
              <p className="mt-2 text-sm text-gray-500">
                Đang tải danh sách sự kiện...
              </p>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <Leaf className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
              <p className="mb-4 text-[14px] text-gray-500 dark:text-gray-400">
                Bạn chưa đăng ký tham gia sự kiện nào gần đây.
              </p>
              <Link
                href="/customer/events"
                onClick={onCancel}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2F9E44] px-4 py-2 text-[13px] font-bold text-white shadow-xs transition-all hover:scale-[1.02] hover:bg-[#1F6F2E] active:scale-[0.98]"
              >
                <span>Duyệt sự kiện công khai</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recentEvents.map((evt) => {
                const dateStr =
                  evt.startTime || (evt as any).start_time || evt.createdAt
                    ? new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(
                        new Date(
                          evt.startTime ||
                            (evt as any).start_time ||
                            evt.createdAt,
                        ),
                      )
                    : "";
                const location = evt.location || "Sự kiện Online";
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
                    className="flex cursor-pointer gap-3 rounded-xl border border-gray-100 p-2.5 transition-all hover:border-emerald-400 hover:bg-emerald-50/10 dark:border-gray-800 dark:hover:bg-emerald-950/10"
                  >
                    <div className="dark:border-gray-850 h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white">
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
                        <p className="line-clamp-1 text-[14px] font-bold text-gray-800 dark:text-gray-200">
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
        </div>
      </div>
    </div>
  );
}
