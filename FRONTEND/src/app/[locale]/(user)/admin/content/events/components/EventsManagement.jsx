"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

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

  const tCommon = useTranslations("admin.common");
  const tSidebar = useTranslations("admin.sidebar");
  const tEvents = useTranslations("partner.events");

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
    if (window.confirm(tCommon("confirmBulkDelete").replace("{count}", "1"))) {
      try {
        const res = await deleteEvent(event.id);
        if (res.success) {
          toast.success(tEvents("errors.deleteSuccess"));
          fetchEvents();
        } else {
          toast.error(tEvents("errors.deleteFailed"));
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error(tEvents("errors.deleteFailed"));
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
        toast.success(tCommon("deleteSelected") + `: ${successful.length}`);
      } else {
        const sampleError = failed[0].reason?.response?.data?.message || failed[0].value?.error || "Error";
        toast.warning(`${tCommon("deleteSelected")} ${successful.length}/${ids.length}. ${tEvents("errors.deleteFailed")} (${sampleError}).`);
      }
      fetchEvents();
    } catch (e) {
      console.log(e);
      toast.error(tEvents("errors.deleteFailed"));
    }
  };

  const handleSubmitEvent = async (data, mode) => {
    try {
      if (mode === "add") {
        const result = await createEvent(data, data.images);
        if (result.success) {
          toast.success(tEvents("errors.createSuccess"));
          fetchEvents();
        } else {
          toast.error(tEvents("errors.createFailed"));
        }
      } else if (mode === "edit") {
        const result = await updateEvent(data.id, data, data.images);
        if (result.success) {
          toast.success(tEvents("errors.updateSuccess"));
          fetchEvents();
        } else {
          toast.error(tEvents("errors.updateFailed"));
        }
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error(tEvents("errors.createFailed"));
    }
  };

  return (
    <div>
      <DataTable
        title={tSidebar("events")}
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
