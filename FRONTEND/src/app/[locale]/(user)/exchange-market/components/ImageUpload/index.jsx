import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function ImageUpload({ image, onImageChange, onRemoveImage }) {
  const t = useTranslations("exchangeMarket");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl, file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-300">
        {t("imageUpload.label")}
      </label>
      <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/20 p-4">
        {image ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-800 shadow-md">
            <img
              src={image}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-slate-300 transition-colors hover:bg-black/90 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-800 bg-slate-950/40 text-slate-500 transition-all duration-200 hover:border-emerald-500/40 hover:text-emerald-400"
          >
            <Upload className="mb-1 h-5 w-5" />
            <span className="text-[10px] font-medium">
              {t("imageUpload.uploadText")}
            </span>
          </label>
        )}
        <div className="flex-grow space-y-1.5">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="inline-block cursor-pointer rounded-lg border border-slate-700/50 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-all duration-150 hover:bg-slate-700"
          >
            {t("imageUpload.chooseBtn")}
          </label>
          <p className="text-[11px] text-slate-500">{t("imageUpload.hint")}</p>
        </div>
      </div>
    </div>
  );
}
