import { Upload, X } from "lucide-react";
import React from "react";

export default function ImageUpload({ image, onImageChange, onRemoveImage }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    }
  };

  return (
    <div className="mb-5">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Hình ảnh sản phẩm
      </label>
      <div className="flex items-center gap-4">
        {image ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
            <img
              src={image}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
            <Upload className="mb-1 h-6 w-6" />
            <span className="text-xs">Tải ảnh</span>
          </div>
        )}
        <div className="flex-grow">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="inline-block cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Chọn ảnh
          </label>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG lên tới 5MB</p>
        </div>
      </div>
    </div>
  );
}
