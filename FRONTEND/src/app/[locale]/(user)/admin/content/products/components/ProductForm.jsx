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

export default function ProductForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
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
        seller_id: initialData?.seller_id || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        category: initialData?.category || "",
        product_status: initialData?.product_status || "",
        post_status: initialData?.post_status || "",
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
    handleSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả sản phẩm..."
              className="w-full resize-none rounded-lg border border-gray-200 bg-transparent p-2.5 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Danh mục</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-gray-200 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Chọn danh mục</option>
                <option value="recycled">Tái chế</option>
                <option value="handicraft">Thủ công</option>
                <option value="organic">Hữu cơ</option>
                <option value="plants">Cây trồng</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product_status">Tình trạng sản phẩm</Label>
              <select
                id="product_status"
                name="product_status"
                value={formData.product_status}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-gray-200 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Chọn tình trạng</option>
                <option value="new">Mới</option>
                <option value="used">Đã sử dụng</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post_status">Trạng thái bài đăng</Label>
              <select
                id="post_status"
                name="post_status"
                value={formData.post_status}
                onChange={handleChange}
                required
                className="h-8 w-full rounded-lg border border-gray-200 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Chọn trạng thái</option>
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
                <option value="pending">Chờ duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seller_id">Chủ sở hữu</Label>
            <Input
              id="seller_id"
              name="seller_id"
              value={formData.seller_id}
              onChange={handleChange}
              required
              placeholder="Seller ID..."
            />
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
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
