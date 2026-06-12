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

export default function ProductForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
  categories = [],
}) {
  const { user } = useAuthStore();
  const categoryOptions = categories && categories.length > 0
    ? categories.map(cat => ({ value: cat.id, label: cat.name }))
    : [
        { value: "recycled", label: "Tái chế" },
        { value: "handicraft", label: "Thủ công" },
        { value: "organic", label: "Hữu cơ" },
        { value: "plants", label: "Cây trồng" },
        { value: "other", label: "Khác" },
      ];
  const [formData, setFormData] = useState({
    seller_id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    product_status: "",
    post_status: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        seller_id: initialData?.seller_id || initialData?.sellerId || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        category: initialData?.category || "",
        product_status: initialData?.product_status || initialData?.productStatus || "",
        post_status: initialData?.post_status || initialData?.postStatus || "",
      });
    } else {
      setFormData({
        id: "",
        seller_id: "",
        name: "",
        description: "",
        price: "",
        category: "",
        product_status: "",
        post_status: "",
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
    if (!user?.id) {
      alert("Phiên đăng nhập không hợp lệ, vui lòng tải lại trang.");
      return;
    }
    const payload = {
      ...formData,
      seller_id: formData.seller_id || user.id,
    };
    handleSubmit(payload, mode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-emerald-600/20 bg-white p-6 md:p-8 shadow-lg sm:max-w-[500px] dark:border-zinc-800 dark:bg-slate-900">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-zinc-100">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Tên sản phẩm</Label>
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
              <Label htmlFor="price">Giá trị (VNĐ)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="100000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Danh mục</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-emerald-600/20 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-slate-800 dark:focus:border-emerald-500"
              >
                <option value="">Chọn danh mục</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="product_status">Tình trạng sản phẩm</Label>
              <select
                id="product_status"
                name="product_status"
                value={formData.product_status}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-emerald-600/20 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-slate-800 dark:focus:border-emerald-500"
              >
                <option value="">Chọn tình trạng</option>
                <option value="new">Mới</option>
                <option value="used">Đã sử dụng</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="post_status">Trạng thái bài đăng</Label>
              <select
                id="post_status"
                name="post_status"
                value={formData.post_status}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-emerald-600/20 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-slate-800 dark:focus:border-emerald-500"
              >
                <option value="">Chọn trạng thái</option>
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
                <option value="pending">Chờ duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
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
