"use client";

import React, { useEffect, useState } from "react";
import { Upload, Trash } from "lucide-react";
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

export default function EventForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    max_participants: "",
    points: "",
    status: "active",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || "",
        title: initialData?.title || "",
        description: initialData?.description || "",
        location: initialData?.location || "",
        start_time: initialData?.start_time
          ? new Date(initialData.start_time).toISOString().slice(0, 16)
          : "",
        end_time: initialData?.end_time
          ? new Date(initialData.end_time).toISOString().slice(0, 16)
          : "",
        max_participants: initialData?.max_participants || "",
        points: initialData?.points || "",
        status: initialData?.status || "active",
        images: initialData?.images || [],
      });

      // Set preview URLs for existing images
      if (initialData.images && Array.isArray(initialData.images)) {
        setPreviewUrls(
          initialData.images.map((img) =>
            typeof img === "string" ? img : URL.createObjectURL(img)
          )
        );
      }
    } else {
      setFormData({
        title: "",
        description: "",
        location: "",
        start_time: "",
        end_time: "",
        max_participants: "",
        points: "",
        status: "active",
        images: [],
      });
      setPreviewUrls([]);
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {mode === "add" ? "Thêm sự kiện mới" : "Chỉnh sửa sự kiện"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Tên sự kiện</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Sự kiện nhặt rác vì môi trường"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Mô tả nội dung, mục tiêu của sự kiện..."
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Địa điểm</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. Công viên Thống Nhất, Hà Nội"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="start_time">Thời gian bắt đầu</Label>
              <Input
                id="start_time"
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="end_time">Thời gian kết thúc</Label>
              <Input
                id="end_time"
                name="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="max_participants">Số người tham gia tối đa</Label>
              <Input
                id="max_participants"
                name="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={handleChange}
                required
                placeholder="100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="points">Điểm thưởng</Label>
              <Input
                id="points"
                name="points"
                type="number"
                value={formData.points}
                onChange={handleChange}
                required
                placeholder="50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-8 border border-gray-200 rounded-lg px-2.5 py-1 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="completed">Đã kết thúc</option>
            </select>
          </div>

          {/* Image Upload list */}
          <div className="space-y-2.5 pt-2">
            <Label>Hình ảnh sự kiện</Label>
            <div className="flex flex-wrap gap-3">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100 shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-white/95 rounded-full text-rose-600 hover:bg-white transition-colors shadow-sm"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors cursor-pointer shadow-sm">
                <Upload size={16} className="text-gray-500" />
                <span>Tải ảnh lên</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {mode === "add" ? "Thêm" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
