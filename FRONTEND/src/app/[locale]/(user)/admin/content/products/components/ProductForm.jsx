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
import { Loader2, UploadCloud, X, Plus, Trash2 } from "lucide-react";
import mediaServices from "@/src/services/media";

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
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    seller_id: "",
    name: "",
    description: "",
    price: "",
    stock: 1,
    category: "",
    product_status: "",
    post_status: "",
    images: [],
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || null,
        seller_id: initialData?.seller_id || initialData?.sellerId || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        stock: initialData?.stock || 0,
        category: initialData?.category || "",
        product_status: initialData?.product_status || initialData?.productStatus || "",
        post_status: initialData?.post_status || initialData?.postStatus || "",
        images: initialData?.images || (initialData?.image ? [initialData.image] : []),
      });
    } else {
      setFormData({
        id: "",
        seller_id: "",
        name: "",
        description: "",
        price: "",
        stock: 1,
        category: "",
        product_status: "",
        post_status: "",
        images: [],
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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await mediaServices.uploadFile(file);
      const url = res.data?.secureUrl || res.data?.secure_url || "";
      if (url) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), url],
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Tải ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert("Phiên đăng nhập không hợp lệ, vui lòng tải lại trang.");
      return;
    }
    const payload = {
      ...formData,
      price: formData.price ? parseInt(String(formData.price), 10) : undefined,
      stock: formData.stock ? parseInt(String(formData.stock), 10) : 0,
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

          {/* Image Upload Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-zinc-350">Hình ảnh sản phẩm (Có thể tải lên nhiều ảnh)</Label>
            {formData.images && formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-150 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/20">
                {formData.images.map((imgUrl, index) => (
                  <div key={index} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-slate-250 dark:border-zinc-850 shadow-sm bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                    <img
                      src={imgUrl}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Sleek Delete button at the top-right corner */}
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== index),
                          }))
                        }
                        className="rounded-full h-7 w-7 p-0 shadow-lg bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 hover:border-red-500/20 transition-all duration-200 hover:scale-110 flex items-center justify-center"
                        title="Xóa hình ảnh"
                      >
                        <X size={12} className="shrink-0" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Large Add Image Card matching the aspect ratio */}
                <label className="flex flex-col items-center justify-center cursor-pointer aspect-[4/3] rounded-xl border-2 border-dashed border-emerald-600/20 hover:border-emerald-500 bg-emerald-50/5 hover:bg-emerald-50/10 transition-all duration-200">
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  ) : (
                    <>
                      <Plus className="h-7 w-7 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-700 mt-1.5 dark:text-emerald-400">Thêm ảnh</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <div className="relative mt-1 flex justify-center rounded-2xl border border-dashed border-emerald-600/20 bg-emerald-50/5 px-6 py-6 transition duration-200 hover:border-emerald-500 hover:bg-emerald-50/10 dark:border-zinc-800 dark:bg-zinc-950/20 dark:hover:border-zinc-700">
                <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 text-center w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-500" />
                      <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                        Đang tải ảnh lên...
                      </span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-emerald-500/70" />
                      <span className="text-xs font-semibold text-gray-600 dark:text-slate-350">
                        Nhấp để tải ảnh sản phẩm
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                        Hỗ trợ PNG, JPG, WEBP lên đến 5MB
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            )}
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
              <Label htmlFor="stock">Số lượng tồn kho</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
