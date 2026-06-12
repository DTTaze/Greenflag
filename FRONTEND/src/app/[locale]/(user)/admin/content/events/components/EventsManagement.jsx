"use client";

import React, { useEffect, useState } from "react";

import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
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
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAllEvents(showDeleted);
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

  useEffect(() => {
    fetchEvents();
  }, [showDeleted]);

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
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này không?")) {
      try {
        const res = await deleteEvent(event.id);
        if (res.success) {
          alert("Xóa sự kiện thành công!");
          fetchEvents();
        } else {
          alert("Xóa sự kiện thất bại!");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Có lỗi xảy ra khi xóa sự kiện!");
      }
    }
  };

  const handleBulkDeleteEvents = async (ids) => {
    try {
      const results = await Promise.allSettled(
        ids.map((id) => deleteEvent(id))
      );

      const successful = results.filter((r) => r.status === "fulfilled" && r.value?.success);
      const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value?.success));

      if (failed.length === 0) {
        alert(`Đã xóa thành công ${successful.length} sự kiện.`);
      } else {
        const sampleError = failed[0].reason?.response?.data?.message || failed[0].value?.error || "Dữ liệu đang được sử dụng hoặc bị ràng buộc khóa ngoại";
        alert(`Xóa thành công ${successful.length}/${ids.length} sự kiện. Thất bại ${failed.length} sự kiện (${sampleError}).`);
      }
      fetchEvents();
    } catch (e) {
      console.log(e);
      alert("Đã xảy ra lỗi hệ thống khi thực hiện xóa hàng loạt.");
    }
  };

  const handleSubmitEvent = async (data, mode) => {
    try {
      if (mode === "add") {
        const result = await createEvent(data, data.images);
        if (result.success) {
          alert("Thêm sự kiện thành công!");
          fetchEvents();
        } else {
          alert("Thêm sự kiện thất bại!");
        }
      } else if (mode === "edit") {
        const result = await updateEvent(data.id, data, data.images);
        if (result.success) {
          alert("Cập nhật sự kiện thành công!");
          fetchEvents();
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
    <div>
      <DataTable
        title="Events"
        columns={eventsColumns}
        rows={events}
        onAdd={handleAddEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onBulkDelete={handleBulkDeleteEvents}
        loading={loading}
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
      />
      <EventForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitEvent}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}
