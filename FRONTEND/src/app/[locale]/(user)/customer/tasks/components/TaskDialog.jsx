"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

const difficultyOptions = [
  { value: "easy", label: "Dễ" },
  { value: "medium", label: "Trung bình" },
  { value: "hard", label: "Khó" },
];

const statusOptions = [
  { value: "public", label: "Công khai" },
  { value: "pending", label: "Đang chờ" },
  { value: "private", label: "Riêng tư" },
];

export default function TaskDialog({ open, task, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coins: 0,
    difficulty: "easy",
    status: "public",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        coins: task.coins || 0,
        difficulty: task.difficulty || "easy",
        status: task.status || "public",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        coins: 0,
        difficulty: "easy",
        status: "public",
      });
    }
  }, [task]);

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      coins: Number(formData.coins),
      difficulty: formData.difficulty,
      status: formData.status,
    };
    onSave(payload, task?.id);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl rounded-3xl p-0">
        <DialogHeader className="rounded-t-3xl bg-emerald-600 px-6 py-5 text-white">
          <DialogTitle className="text-xl font-semibold">
            {task ? "Sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 dark:bg-slate-950"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              Tiêu đề nhiệm vụ
              <input
                value={formData.title}
                onChange={(event) => handleChange("title", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              Số xu thưởng
              <input
                type="number"
                min="0"
                value={formData.coins}
                onChange={(event) => handleChange("coins", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            Mô tả nhiệm vụ
            <textarea
              value={formData.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              rows={5}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              Mức độ
              <select
                value={formData.difficulty}
                onChange={(event) =>
                  handleChange("difficulty", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {difficultyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              Trạng thái nhiệm vụ
              <select
                value={formData.status}
                onChange={(event) => handleChange("status", event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="rounded-3xl px-5 py-3"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
            >
              {loading ? "Đang lưu..." : "Lưu nhiệm vụ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
