import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import { getOwnerEvents } from "@/src/utils/api";

export const getEventNameById = (eventId, events = []) => {
  const event = events.find((e) => String(e.id) === String(eventId));
  return event ? event.title : "Unknown Event";
};

export default function EventSelector({ selectedEvent, onEventChange }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getOwnerEvents();
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="mb-6 w-full">
      <label
        htmlFor="event-select"
        className="text-gray-750 mb-1.5 block text-sm font-semibold"
      >
        Select Event
      </label>
      <select
        id="event-select"
        value={selectedEvent}
        onChange={onEventChange}
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>
          Choose an event
        </option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title} ({dayjs(event.start_time).format("HH:mm DD/MM/YYYY")}{" "}
            to {dayjs(event.end_time).format("HH:mm DD/MM/YYYY")})
          </option>
        ))}
      </select>
    </div>
  );
}
