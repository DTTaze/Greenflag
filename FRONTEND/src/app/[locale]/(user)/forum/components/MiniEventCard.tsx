"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { EventType } from "@/src/types/event/event.type";

interface MiniEventCardProps {
  event: EventType;
  onRemove: () => void;
}

export default function MiniEventCard({ event, onRemove }: MiniEventCardProps) {
  const t = useTranslations("forum");

  if (!event) return null;

  const imageUrl =
    event.images && event.images.length > 0
      ? event.images[0]
      : "/images/event-placeholder.png";

  return (
    <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/10 p-3 dark:border-emerald-950/20 dark:bg-emerald-950/5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-emerald-200 bg-white dark:border-emerald-900">
          <img
            src={imageUrl}
            alt="Sự kiện"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/event-placeholder.png";
            }}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
            {t("attachedEventConfirm")}
          </p>
          <p className="dark:text-emerald-455 text-[14px] font-bold text-[#1F6F2E]">
            {event.title}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-800"
        title={t("removeAttachedEvent")}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
