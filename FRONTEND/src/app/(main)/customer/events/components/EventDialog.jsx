import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import MultiImageUpload from "@/src/components/common/MultiImageUpload";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

const EventDialog = ({ open, onClose, onSave, event }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    capacity: "",
    start_time: "",
    end_time: "",
    end_sign: "",
    coins: "",
    status: "upcoming",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      capacity: "",
      start_time: "",
      end_time: "",
      end_sign: "",
      coins: "",
      status: "upcoming",
    });
    setImages([]);
    setPreviewImages([]);
    setErrors({});
  };

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        capacity: event.capacity || "",
        start_time: event.start_time
          ? new Date(event.start_time).toISOString().slice(0, 16)
          : "",
        end_time: event.end_time
          ? new Date(event.end_time).toISOString().slice(0, 16)
          : "",
        end_sign: event.end_sign
          ? new Date(event.end_sign).toISOString().slice(0, 16)
          : "",
        coins: event.coins || "",
        status: event.status || "upcoming",
      });
      const eventImages = event.images || [];
      const imageUrls = Array.isArray(eventImages)
        ? eventImages.map((img) => img.url || img)
        : [];
      setPreviewImages(imageUrls);
    } else {
      resetForm();
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImagesSelected = (files) => {
    setImages((prev) => [...prev, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = "Capacity must be at least 1";
    }
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (
      formData.start_time &&
      formData.end_time &&
      new Date(formData.end_time) <= new Date(formData.start_time)
    ) {
      newErrors.end_time = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData, images);
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto p-6 sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {event ? "Edit Event" : "Add New Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
              placeholder="Event Title"
            />
            {errors.title && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.title}
              </span>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe the event..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? "border-red-500" : ""}
              placeholder="Event Location"
            />
            {errors.location && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.location}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Capacity <span className="text-red-500">*</span>
            </label>
            <Input
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              className={errors.capacity ? "border-red-500" : ""}
              placeholder="Maximum Participants"
            />
            {errors.capacity && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.capacity}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <Input
              name="start_time"
              type="datetime-local"
              value={formData.start_time}
              onChange={handleChange}
              className={errors.start_time ? "border-red-500" : ""}
            />
            {errors.start_time && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.start_time}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              End Time <span className="text-red-500">*</span>
            </label>
            <Input
              name="end_time"
              type="datetime-local"
              value={formData.end_time}
              onChange={handleChange}
              className={errors.end_time ? "border-red-500" : ""}
            />
            {errors.end_time && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.end_time}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              End Sign Up Time
            </label>
            <Input
              name="end_sign"
              type="datetime-local"
              value={formData.end_sign}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Coins Reward
            </label>
            <Input
              name="coins"
              type="number"
              value={formData.coins}
              onChange={handleChange}
              placeholder="e.g. 100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Event Images
            </label>
            <MultiImageUpload
              previewImages={previewImages}
              onImageChange={handleImagesSelected}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t pt-4 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {event ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
