"use client";

import React from "react";
import { Upload, Trash } from "lucide-react";

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
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 p-1 bg-white/95 rounded-full text-rose-600 hover:bg-white transition-colors shadow-sm"
              >
                <Trash size={12} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors cursor-pointer shadow-sm">
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
