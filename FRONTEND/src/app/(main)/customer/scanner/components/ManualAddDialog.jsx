"use client";

import { AlertCircle, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

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
      <DialogContent className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:max-w-[450px]">
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
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600"
              />
              <div>
                <span className="font-semibold">
                  The user will be added to:
                </span>{" "}
                {selectedEvent
                  ? getEventNameById(selectedEvent, events)
                  : "No event selected"}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!manualUser.name || !manualUser.email}
              className="flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
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
