"use client";

import { Trash, Upload } from "lucide-react";
import React from "react";

export default function MultiImageUpload({
  previewImages = [],
  onImageChange,
  onRemoveImage,
  maxImages = 5,
}) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }
    onImageChange(files);
  };

  return (
    <div className="mb-4 space-y-3">
      <div className="text-sm font-semibold text-gray-700">
        Images (up to {maxImages})
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          {previewImages.map((url, index) => (
            <div
              key={index}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 shadow-sm"
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 rounded-full bg-white/95 p-1 text-rose-600 shadow-sm transition-colors hover:bg-white"
              >
                <Trash size={12} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
            <Upload size={16} className="text-gray-500" />
            <span>Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
