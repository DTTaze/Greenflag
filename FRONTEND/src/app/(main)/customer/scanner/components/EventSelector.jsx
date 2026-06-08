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
    <div className="w-full mb-6">
      <label htmlFor="event-select" className="block text-sm font-semibold text-gray-750 mb-1.5">
        Select Event
      </label>
      <select
        id="event-select"
        value={selectedEvent}
        onChange={onEventChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>Choose an event</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title} ({dayjs(event.start_time).format("HH:mm DD/MM/YYYY")} to {dayjs(event.end_time).format("HH:mm DD/MM/YYYY")})
          </option>
        ))}
      </select>
    </div>
  );
}
