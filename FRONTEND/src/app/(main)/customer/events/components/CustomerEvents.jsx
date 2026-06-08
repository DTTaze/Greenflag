import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  createEvent,
  deleteEvent,
  getOwnerEvents,
  updateEvent,
} from "@/src/utils/api";

import EventDialog from "./EventDialog";
import EventFilters from "./EventFilters";
import EventList from "./EventList";

const CustomerEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    minPrice: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOwnerEvents();

      console.log("events response: ", response);
      if (response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    // Filter by minimum price
    if (filters.minPrice) {
      filtered = filtered.filter(
        (event) => event.coins >= parseFloat(filters.minPrice),
      );
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      minPrice: "",
    });
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setLoading(true);
        await deleteEvent(eventId);
        await fetchEvents();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete event");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEvent = async (formData, images) => {
    try {
      setLoading(true);
      setError(null);

      if (selectedEvent) {
        await updateEvent(selectedEvent.id, formData, images);
      } else {
        await createEvent(formData, images);
      }

      await fetchEvents();
      setOpenDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Events Management</h2>
        <Button
          onClick={handleAddEvent}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add Event
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <EventFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <EventList
        events={filteredEvents}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onAdd={handleAddEvent}
      />

      <EventDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
      />
    </div>
  );
};

export default CustomerEvents;
