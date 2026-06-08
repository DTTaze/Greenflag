"use client";

import React, { useEffect, useState } from "react";
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

export default function ItemForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
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
        purchase_limit_per_day:
          initialData?.purchase_limit_per_day || "Không giới hạn",
      });
    } else {
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

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {mode === "add" ? "Add New Item" : "Edit Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả sản phẩm..."
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Trạng thái</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full h-8 border border-gray-200 rounded-lg px-2.5 py-1 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Chọn trạng thái</option>
                <option value="available">Sẵn hàng</option>
                <option value="pending">Chờ duyệt</option>
                <option value="sold_out">Hết hàng</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-col gap-1.5">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="owner_id">Chủ sở hữu</Label>
              <Input
                id="owner_id"
                name="owner_id"
                value={formData.owner_id}
                onChange={handleChange}
                required
                placeholder="Owner ID..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="purchase_limit_per_day">Giới hạn lượt mua/ngày</Label>
              <Input
                id="purchase_limit_per_day"
                name="purchase_limit_per_day"
                value={formData.purchase_limit_per_day}
                onChange={handleChange}
                placeholder="Không giới hạn"
              />
            </div>
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {mode === "add" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
