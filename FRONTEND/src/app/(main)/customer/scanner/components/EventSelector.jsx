import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import { getOwnerEventApi } from "@/src/utils/api";

export const getEventNameById = (eventId, events = []) => {
  const event = events.find((e) => String(e.id) === String(eventId));
  return event ? event.title : "Unknown Event";
};

export default function EventSelector({ selectedEvent, onEventChange }) {
  const [events, setEvents] = useState([]);
  console.log("selected event: ", selectedEvent);
  console.log("on event change: ", onEventChange);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getOwnerEventApi();
        console.log("Fetched events:", response.data); // Debugging line
        console.log(
          "Start time:",
          dayjs(response.data[0].start_time).format("HH:mm DD/MM/YYYY"),
        ); // Debugging line

        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel id="event-select-label">Event</InputLabel>
      <Select
        labelId="event-select-label"
        id="event-select"
        value={selectedEvent}
        label="Event"
        onChange={onEventChange}
      >
        {events.map((event) => (
          <MenuItem key={event.id} value={event.id}>
            {event.title} - {dayjs(event.start_time).format("HH:mm DD/MM/YYYY")}{" "}
            to {dayjs(event.end_time).format("HH:mm DD/MM/YYYY")}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
