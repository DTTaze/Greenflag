import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  createEventApi,
  deleteEventApi,
  getOwnerEventApi,
  updateEventApi,
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
      const response = await getOwnerEventApi();

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
        event.name.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    // Filter by minimum price
    if (filters.minPrice) {
      filtered = filtered.filter(
        (event) => event.price >= parseFloat(filters.minPrice),
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
        await deleteEventApi(eventId);
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
        await updateEventApi(selectedEvent.id, formData, images);
      } else {
        await createEventApi(formData, images);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          Events Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddEvent}
          className="customer-button"
        >
          Add Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
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
    </Box>
  );
};

export default CustomerEvents;
