import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import MultiImageUpload from "@/src/components/common/MultiImageUpload";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

const INITIAL_FORM_STATE = {
  name: "",
  price: "",
  stock: "",
  description: "",
  status: "",
  purchase_limit_per_day: 1,
  weight: "",
  length: "",
  width: "",
  height: "",
};

const ItemDialog = ({ open, onClose, onSave, item, isSubmitting }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setImages([]);
    setPreviewImages([]);
    setErrors({});
  };

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        stock: item.stock || "",
        description: item.description || "",
        status: item.status || "",
        purchase_limit_per_day: item.purchase_limit_per_day || 1,
        weight: item.weight || "",
        length: item.length || "",
        width: item.width || "",
        height: item.height || "",
      });
      setPreviewImages(item.images || []);
    } else {
      resetForm();
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImagesSelected = (files) => {
    setImages((prev) => [...prev, ...files]);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "Stock must be 0 or greater";
    if (
      !formData.purchase_limit_per_day ||
      formData.purchase_limit_per_day < 1
    ) {
      newErrors.purchase_limit_per_day = "Daily limit must be at least 1";
    }
    if (!formData.weight || formData.weight <= 0)
      newErrors.weight = "Weight must be greater than 0";
    if (!formData.length || formData.length <= 0)
      newErrors.length = "Length must be greater than 0";
    if (!formData.width || formData.width <= 0)
      newErrors.width = "Width must be greater than 0";
    if (!formData.height || formData.height <= 0)
      newErrors.height = "Height must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData, images);
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-h-[90vh] w-full overflow-y-auto p-6 sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {item ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
              placeholder="Item Name"
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 select-none">
                $
              </span>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className={`pl-8 ${errors.price ? "border-red-500" : ""}`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.price}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Stock <span className="text-red-500">*</span>
            </label>
            <Input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className={errors.stock ? "border-red-500" : ""}
              placeholder="Available inventory"
            />
            {errors.stock && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.stock}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Weight (g) <span className="text-red-500">*</span>
            </label>
            <Input
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              className={errors.weight ? "border-red-500" : ""}
              placeholder="Weight in grams"
            />
            {errors.weight && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.weight}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Length (cm) <span className="text-red-500">*</span>
            </label>
            <Input
              name="length"
              type="number"
              value={formData.length}
              onChange={handleChange}
              className={errors.length ? "border-red-500" : ""}
              placeholder="Length in cm"
            />
            {errors.length && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.length}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Width (cm) <span className="text-red-500">*</span>
            </label>
            <Input
              name="width"
              type="number"
              value={formData.width}
              onChange={handleChange}
              className={errors.width ? "border-red-500" : ""}
              placeholder="Width in cm"
            />
            {errors.width && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.width}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Height (cm) <span className="text-red-500">*</span>
            </label>
            <Input
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              className={errors.height ? "border-red-500" : ""}
              placeholder="Height in cm"
            />
            {errors.height && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.height}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Daily Purchase Limit <span className="text-red-500">*</span>
            </label>
            <Input
              name="purchase_limit_per_day"
              type="number"
              value={formData.purchase_limit_per_day}
              onChange={handleChange}
              className={errors.purchase_limit_per_day ? "border-red-500" : ""}
            />
            {errors.purchase_limit_per_day && (
              <span className="mt-1 block text-xs text-red-500">
                {errors.purchase_limit_per_day}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="available">Available</option>
              <option value="sold_out">Sold Out</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe the item..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Item Images
            </label>
            <MultiImageUpload
              previewImages={previewImages}
              onImageChange={handleImagesSelected}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t pt-4 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : item ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
