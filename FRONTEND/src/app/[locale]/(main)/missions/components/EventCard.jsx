import { CalendarIcon, MapPin } from "lucide-react";
import React from "react";

export default function EventCard({ event, onOpenModal, isParticipated }) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-200">
      <div className="w-1 bg-green-500"></div>
      <div className="flex-1 p-3">
        <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">
          {event.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin size={12} className="mr-1" />
              {event.location}
            </div>
            <span>•</span>
            <div className="flex items-center">
              <CalendarIcon size={12} className="mr-1" />
              {new Date(event.start_time).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-xs font-medium text-amber-600">
              <span>+{event.coins}</span>
              <svg
                className="ml-0.5 h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm4-9h-3V8a1 1 0 00-2 0v3H8a1 1 0 000 2h3v3a1 1 0 002 0v-3h3a1 1 0 000-2z" />
              </svg>
            </div>

            <button
              onClick={() => onOpenModal(event)}
              className="rounded-md bg-blue-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-600"
            >
              {isParticipated ? "Xem chi tiết" : "Tham gia"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
