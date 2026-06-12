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

export default function RoleForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        name: initialData?.name || "",
        description: initialData?.description || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
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
      <DialogContent className="rounded-xl border border-emerald-600/20 bg-white p-6 md:p-8 shadow-lg sm:max-w-[450px] dark:border-zinc-800 dark:bg-slate-900">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-zinc-100">
            {mode === "add" ? "Add New Role" : "Edit Role"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Tên vai trò</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Administrator, User, Manager"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Quản lý toàn bộ hệ thống"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
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
