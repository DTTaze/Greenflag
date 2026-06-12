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
import { useAuthStore } from "@/src/store/auth/authStore";

export default function ItemForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const { user } = useAuthStore();
  const [isLimited, setIsLimited] = useState(false);
  const [formData, setFormData] = useState({
    owner_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    status: "",
    purchase_limit_per_day: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const limit = initialData?.purchase_limit_per_day ?? initialData?.purchaseLimitPerDay;
      const parsedLimit = (limit === "Không giới hạn" || limit === null || limit === undefined || limit === "") ? "" : limit;
      setIsLimited(parsedLimit !== "");
      setFormData({
        id: initialData?.id || null,
        owner_id: initialData?.owner_id || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        stock: initialData?.stock || "",
        weight: initialData?.weight || "",
        length: initialData?.length || "",
        width: initialData?.width || "",
        height: initialData?.height || "",
        status: initialData?.status || "",
        purchase_limit_per_day: parsedLimit,
      });
    } else {
      setIsLimited(false);
      setFormData({
        id: "",
        owner_id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        status: "",
        purchase_limit_per_day: "",
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

  const handleLimitToggle = (checked) => {
    setIsLimited(checked);
    setFormData((prev) => ({
      ...prev,
      purchase_limit_per_day: checked ? "1" : "",
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert("Phiên đăng nhập không hợp lệ, vui lòng tải lại trang.");
      return;
    }
    const payload = {
      ...formData,
      owner_id: formData.owner_id || user.id,
      purchase_limit_per_day: isLimited && formData.purchase_limit_per_day !== ""
        ? parseInt(formData.purchase_limit_per_day, 10)
        : null,
    };
    handleSubmit(payload, mode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-emerald-600/20 bg-white p-6 md:p-8 shadow-lg sm:max-w-[600px] dark:border-zinc-800 dark:bg-slate-900">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-zinc-100">
            {mode === "add" ? "Add New Item" : "Edit Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Tên vật phẩm</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tên sản phẩm..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả sản phẩm..."
              className="w-full resize-none rounded-lg border border-emerald-600/20 bg-transparent p-2.5 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-slate-800 dark:focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Giá trị (xu)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="100"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">Cân nặng (g)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                required
                placeholder="200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-emerald-600/20 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-slate-800 dark:focus:border-emerald-500"
              >
                <option value="">Chọn trạng thái</option>
                <option value="available">Sẵn hàng</option>
                <option value="pending">Chờ duyệt</option>
                <option value="sold_out">Hết hàng</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="length">Chiều dài (cm)</Label>
              <Input
                id="length"
                name="length"
                type="number"
                value={formData.length}
                onChange={handleChange}
                required
                placeholder="10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="width">Chiều rộng (cm)</Label>
              <Input
                id="width"
                name="width"
                type="number"
                value={formData.width}
                onChange={handleChange}
                required
                placeholder="10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="height">Chiều cao (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                required
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-emerald-600/20 p-3.5 dark:border-zinc-800/80">
            <div className="flex items-center justify-between">
              <Label htmlFor="limit_toggle" className="cursor-pointer font-medium text-gray-700 dark:text-slate-300">
                Giới hạn lượt mua/ngày
              </Label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  id="limit_toggle"
                  type="checkbox"
                  className="peer sr-only"
                  checked={isLimited}
                  onChange={(e) => handleLimitToggle(e.target.checked)}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-zinc-700"></div>
              </label>
            </div>
            {isLimited && (
              <div className="mt-2 flex flex-col gap-2">
                <Label htmlFor="purchase_limit_per_day">Số lượt mua tối đa trong ngày</Label>
                <Input
                  id="purchase_limit_per_day"
                  name="purchase_limit_per_day"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.purchase_limit_per_day}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số lượng..."
                  className="w-full"
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 border-t border-emerald-600/20 pt-4 dark:border-zinc-800/80">
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
