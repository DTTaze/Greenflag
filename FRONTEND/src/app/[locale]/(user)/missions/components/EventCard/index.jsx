import { CalendarIcon, MapPin } from "lucide-react";
import React from "react";

export default function EventCard({ event, onOpenModal, isParticipated }) {
  return (
    <div className="group flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 dark:hover:border-emerald-500/40">
      {/* Decorative vertical line */}
      <div
        className={`w-1.5 ${isParticipated ? "bg-emerald-500" : "bg-blue-500"}`}
      ></div>

      <div className="flex-1 p-4">
        <h3 className="text-sm font-bold text-gray-800 transition-colors group-hover:text-emerald-800 dark:text-slate-100 dark:group-hover:text-emerald-300">
          {event.title}
        </h3>
        <p className="text-gray-550 mt-1 line-clamp-1 text-xs leading-relaxed dark:text-slate-300">
          {event.description}
        </p>

        <div className="mt-4.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400 dark:text-slate-300">
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-gray-400 dark:text-slate-300" />
              <span className="max-w-[120px] truncate">{event.location}</span>
            </div>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <div className="flex items-center gap-1">
              <CalendarIcon
                size={13}
                className="text-gray-400 dark:text-slate-300"
              />
              <span>
                {new Date(event.start_time).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-amber-100/30 bg-amber-50 px-2 py-0.5 text-xs font-extrabold text-amber-600 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
              <span>+{event.coins || 0}</span>
              <svg
                className="h-3.5 w-3.5 fill-current text-amber-500 dark:text-amber-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm4-9h-3V8a1 1 0 00-2 0v3H8a1 1 0 000 2h3v3a1 1 0 002 0v-3h3a1 1 0 000-2z" />
              </svg>
            </div>

            <button
              onClick={() => onOpenModal(event)}
              className={`cursor-pointer rounded-xl px-4.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                isParticipated
                  ? "bg-emerald-50 text-[#0B6E4F] hover:bg-emerald-100/80 dark:bg-emerald-400/15 dark:text-emerald-200 dark:hover:bg-emerald-400/25"
                  : "bg-blue-600 text-white shadow-xs hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/10 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
              }`}
            >
              {isParticipated ? "Chi tiết" : "Đăng ký"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
