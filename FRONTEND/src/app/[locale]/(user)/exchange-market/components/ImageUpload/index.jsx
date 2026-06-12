import { Upload, X, Plus, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function ImageUpload({
  images = [],
  onImagesChange,
  onRemoveImage,
  maxImages = 5,
}) {
  const t = useTranslations("exchangeMarket");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > maxImages) {
      alert(
        t("imageUpload.limitAlert", { max: maxImages }) ||
          `Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh!`
      );
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    onImagesChange(newPreviews, files);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
          {t("imageUpload.label") || "Hình ảnh sản phẩm"}
        </label>
        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500">
          ({images.length}/{maxImages})
        </span>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-150 bg-slate-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/20">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-xs bg-slate-100 dark:bg-zinc-900 flex items-center justify-center"
            >
              <img
                src={imgUrl}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Cover image label on index 0 */}
              {index === 0 && (
                <div className="absolute bottom-1.5 left-1.5 z-10">
                  <span className="inline-flex items-center rounded-md bg-emerald-600/95 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
                    Ảnh bìa
                  </span>
                </div>
              )}

              {/* Glassmorphic Delete button */}
              <div className="absolute top-1.5 right-1.5 z-10">
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="rounded-full h-6 w-6 p-0 shadow-md bg-black/60 hover:bg-red-650 text-white backdrop-blur-md border border-white/10 hover:border-red-500/20 transition-all duration-200 hover:scale-110 flex items-center justify-center"
                  title="Xóa hình ảnh"
                >
                  <X size={11} className="shrink-0" />
                </button>
              </div>
            </div>
          ))}

          {/* Dash Add Button Tile if below max */}
          {images.length < maxImages && (
            <label className="flex flex-col items-center justify-center cursor-pointer aspect-[4/3] rounded-xl border-2 border-dashed border-emerald-600/20 hover:border-emerald-500 bg-emerald-50/5 hover:bg-emerald-50/10 transition-all duration-200">
              <Plus className="h-6 w-6 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700 mt-1 dark:text-emerald-400">
                {t("imageUpload.uploadText") || "Tải ảnh"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      ) : (
        <div className="relative mt-1 flex justify-center rounded-2xl border border-dashed border-emerald-600/20 bg-emerald-50/5 px-6 py-6 transition duration-200 hover:border-emerald-500 hover:bg-emerald-50/10 dark:border-zinc-800 dark:bg-zinc-950/20 dark:hover:border-zinc-700">
          <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 text-center w-full">
            <Upload className="h-8 w-8 text-emerald-500/70" />
            <span className="text-xs font-semibold text-gray-600 dark:text-slate-350">
              {t("imageUpload.chooseBtn") || "Chọn ảnh sản phẩm"}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
              {t("imageUpload.hint") || "Hỗ trợ định dạng PNG, JPG lên tới 5MB"}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
