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

export default function UserForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    role_id: "",
    role_name: "",
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
    coins: "",
    password: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        role_id: initialData?.role_id || null,
        role_name: initialData?.roles?.name || "",
        full_name: initialData?.full_name || "",
        username: initialData?.username || "",
        email: initialData?.email || "",
        phone_number: initialData?.phone_number || "",
        coins: initialData?.coins?.amount || "",
        password: "",
      });
    } else {
      setFormData({
        id: "",
        role_id: "",
        role_name: "",
        full_name: "",
        username: "",
        email: "",
        phone_number: "",
        coins: "",
        password: "",
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
      <DialogContent className="rounded-xl border border-emerald-200 bg-white p-6 shadow-lg sm:max-w-[500px] dark:border-emerald-500/15 dark:bg-slate-900">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {mode === "add" ? "Add New User" : "Edit User"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">Họ tên</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Tên người dùng</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="nguyenvana"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
              />
            </div>

            {mode === "add" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone_number">Số điện thoại</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="0987654321"
              />
            </div>

            {mode === "edit" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="coins">Số xu</Label>
                  <Input
                    id="coins"
                    name="coins"
                    value={formData.coins}
                    disabled
                    className="border-emerald-200/60 bg-gray-50/50 dark:border-emerald-500/15 dark:bg-slate-800/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="role_name">Vai trò</Label>
                  <Input
                    id="role_name"
                    name="role_name"
                    value={formData.role_name}
                    disabled
                    className="border-emerald-200/60 bg-gray-50/50 dark:border-emerald-500/15 dark:bg-slate-800/50"
                  />
                </div>
              </div>
            )}
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
