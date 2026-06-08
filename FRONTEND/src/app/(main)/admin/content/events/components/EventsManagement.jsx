import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  createEventApi,
  deleteEventApi,
  getAllEventsApi,
  updateEventApi,
} from "@/src/utils/api";

import DataTable from "../../../components/DataTable";
import { eventsColumns } from "../../../components/HeaderColumn";
import EventForm from "./EventForm";

export default function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllEventsApi();
        if (res.success) {
          setEvents(res.data);
        } else {
          console.log(res.error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddEvent = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditEvent = (event) => {
    setFormMode("edit");
    setEditData(event);
    setFormOpen(true);
  };

  const handleDeleteEvent = async (event) => {
    if (confirm("Bạn có chắc chắn muốn xóa sự kiện này không?")) {
      try {
        const res = await deleteEventApi(event.id);
        if (res.success) {
          alert("Xóa sự kiện thành công!");
          setEvents((prev) => prev.filter((e) => e.id !== event.id));
        } else {
          alert("Xóa sự kiện thất bại!");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Có lỗi xảy ra khi xóa sự kiện!");
      }
    }
  };

  const handleSubmitEvent = async (data, mode) => {
    try {
      if (mode === "add") {
        const result = await createEventApi(data, data.images);
        if (result.success) {
          alert("Thêm sự kiện thành công!");
          // Refresh events list
          const res = await getAllEventsApi();
          if (res.success) {
            setEvents(res.data);
          }
        } else {
          alert("Thêm sự kiện thất bại!");
        }
      } else if (mode === "edit") {
        const result = await updateEventApi(data.id, data, data.images);
        if (result.success) {
          alert("Cập nhật sự kiện thành công!");
          // Refresh events list
          const res = await getAllEventsApi();
          if (res.success) {
            setEvents(res.data);
          }
        } else {
          alert("Cập nhật sự kiện thất bại!");
        }
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("Có lỗi xảy ra khi xử lý sự kiện!");
    }
  };

  return (
    <Box>
      <DataTable
        title="Events"
        columns={eventsColumns}
        rows={events}
        onAdd={handleAddEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        loading={loading}
      />
      <EventForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitEvent}
        initialData={editData}
        mode={formMode}
      />
    </Box>
  );
}
