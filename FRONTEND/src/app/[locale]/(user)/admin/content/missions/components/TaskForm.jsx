"use client";

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

const typeNames = {
  daily: "Nhiệm vụ Hàng ngày",
  weekly: "Nhiệm vụ Hàng tuần",
  event: "Sự kiện",
  others: "Nhiệm vụ Khác",
};

export default function TaskForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coins: "",
    difficulty: "",
    total: "",
    type: "others",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        title: initialData?.title || "",
        description: initialData?.description || "",
        coins: initialData?.coins || "",
        difficulty: initialData?.difficulty || "",
        total: initialData?.total || "",
        type: initialData?.taskTypes?.[0]?.type?.type || "others",
      });
    } else {
      setFormData({
        id: "",
        title: "",
        description: "",
        coins: "",
        difficulty: "",
        total: "",
        type: "others",
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="rounded-xl border border-emerald-200 bg-white p-6 shadow-lg sm:max-w-[450px] dark:border-emerald-500/15 dark:bg-slate-900">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {mode === "add" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Nhặt chai nhựa tái chế"
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
              rows={3}
              placeholder="Mô tả chi tiết nhiệm vụ..."
              className="w-full resize-none rounded-lg border border-emerald-200 bg-transparent p-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-emerald-500/15 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="coins">Số xu thưởng</Label>
              <Input
                id="coins"
                name="coins"
                type="number"
                value={formData.coins}
                onChange={handleChange}
                required
                placeholder="10"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="difficulty">Độ khó</Label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-emerald-200 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-emerald-500/15 dark:bg-slate-800"
              >
                <option value="">Chọn độ khó</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="total">Tổng tiến trình</Label>
              <Input
                id="total"
                name="total"
                type="number"
                value={formData.total}
                onChange={handleChange}
                placeholder="e.g. 5"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Phân loại nhiệm vụ</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-emerald-200 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-emerald-500/15 dark:bg-slate-800"
              >
                <option value="daily">Nhiệm vụ Hàng ngày</option>
                <option value="others">Nhiệm vụ Khác</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6 border-t border-emerald-100 pt-4 dark:border-emerald-500/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {mode === "add" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
