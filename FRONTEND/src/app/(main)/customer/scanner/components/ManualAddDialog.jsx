"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

import { getEventNameById } from "./EventSelector";

export default function ManualAddDialog({
  open,
  onClose,
  selectedEvent,
  events,
  onSuccess,
  onError,
}) {
  const [manualUser, setManualUser] = useState({
    name: "",
    email: "",
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setManualUser({ name: "", email: "" });
    }
  }, [open]);

  const handleManualInputChange = (event) => {
    setManualUser({
      ...manualUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      onSuccess("Please select an event first");
      onClose();
      return;
    }

    try {
      onClose();
      const eventName = getEventNameById(selectedEvent, events);
      onSuccess(`${manualUser.name} đã được thêm vào sự kiện: ${eventName}`);
    } catch (error) {
      console.error("Error adding user manually:", error);
      onError("Failed to add user manually");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Add User Manually
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleManualAdd} className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={manualUser.name}
                onChange={handleManualInputChange}
                required
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={manualUser.email}
                onChange={handleManualInputChange}
                required
                placeholder="example@gmail.com"
              />
            </div>

            {/* Styled Info Alert Banner */}
            <div className="flex gap-2.5 items-start bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-sm mt-4">
              <AlertCircle size={18} className="shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <span className="font-semibold">The user will be added to:</span>{" "}
                {selectedEvent
                  ? getEventNameById(selectedEvent, events)
                  : "No event selected"}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!manualUser.name || !manualUser.email}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <UserPlus size={16} />
              <span>Add to Event</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
