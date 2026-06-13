"use client";

import { UploadCloud, X } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

type EventFormLabels = {
  createTitle: string;
  createDescription: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  capacityLabel: string;
  coinsLabel: string;
  endSignLabel: string;
  startTimeLabel: string;
  endTimeLabel: string;
  createBtn: string;
  creating: string;
  clearBtn: string;
  updateBtn?: string;
  updating?: string;
  editTitle?: string;
  editDescription?: string;
  cancelBtn?: string;
  uploadImageLabel: string;
  clickToUpload: string;
  supportText: string;
};

type EventFormProps = {
  register: any;
  errors: any;
  saving: boolean;
  onSubmit: (e: any) => void;
  onReset: () => void;
  labels: EventFormLabels;
  isEditing?: boolean;
  selectedImages: File[];
  previewUrls: string[];
  onImagesChange: (files: File[]) => void;
  onRemoveImage: () => void;
};

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:focus-visible:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-800/30 dark:bg-gray-950 dark:text-gray-100 h-auto";

export function EventForm({
  register,
  errors,
  saving,
  onSubmit,
  onReset,
  labels,
  isEditing = false,
  selectedImages,
  previewUrls,
  onImagesChange,
  onRemoveImage,
}: EventFormProps) {
  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="mb-6 p-0">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {isEditing ? (labels.editTitle || "Edit event") : labels.createTitle}
        </CardTitle>
        <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
          {isEditing ? (labels.editDescription || "Modify event details and save changes.") : labels.createDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-0">
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.titleLabel} <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              placeholder={labels.titlePlaceholder}
              className={INPUT_CLASS}
              {...register("title")}
            />
            {errors.title?.message && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.descriptionLabel} <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <textarea
              placeholder={labels.descriptionPlaceholder}
              rows={3}
              className={`${INPUT_CLASS} resize-none`}
              {...register("description")}
            />
            {errors.description?.message && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.locationLabel} <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              placeholder={labels.locationPlaceholder}
              className={INPUT_CLASS}
              {...register("location")}
            />
            {errors.location?.message && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Capacity + Coins */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {labels.capacityLabel} <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                className={INPUT_CLASS}
                {...register("capacity", { valueAsNumber: true })}
              />
              {errors.capacity?.message && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.capacity.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {labels.coinsLabel} <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                className={INPUT_CLASS}
                {...register("coins", { valueAsNumber: true })}
              />
              {errors.coins?.message && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.coins.message}</p>
              )}
            </div>
          </div>

          {/* Registration Deadline */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.endSignLabel} <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              type="datetime-local"
              className={INPUT_CLASS}
              {...register("end_sign")}
            />
            {errors.end_sign?.message && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.end_sign.message}</p>
            )}
          </div>

          {/* Start + End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {labels.startTimeLabel} <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                type="datetime-local"
                className={INPUT_CLASS}
                {...register("start_time")}
              />
              {errors.start_time?.message && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.start_time.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {labels.endTimeLabel} <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                type="datetime-local"
                className={INPUT_CLASS}
                {...register("end_time")}
              />
              {errors.end_time?.message && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          {/* Event Image Upload Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.uploadImageLabel}
            </Label>
            <div className="relative mt-1 flex justify-center rounded-2xl border border-dashed border-emerald-250/50 bg-emerald-50/5 px-6 py-6 transition duration-200 hover:border-emerald-400 hover:bg-emerald-50/10 dark:border-emerald-800/30 dark:bg-zinc-950/20 dark:hover:border-emerald-600">
              {previewUrls && previewUrls.length > 0 ? (
                <div className="relative group w-full max-w-[150px] aspect-square rounded-2xl overflow-hidden border border-emerald-100 dark:border-zinc-800 shadow-xs bg-slate-50 dark:bg-zinc-950/20">
                  <img
                    src={previewUrls[0]}
                    alt="Preview"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Sleek Delete button at the top-right corner */}
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      type="button"
                      onClick={onRemoveImage}
                      className="rounded-full h-7 w-7 p-0 shadow-lg bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 hover:border-red-500/20 transition-all duration-200 hover:scale-110 flex items-center justify-center"
                      title="Xóa hình ảnh"
                    >
                      <X size={12} className="shrink-0" />
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 text-center w-full">
                  <UploadCloud className="h-8 w-8 text-emerald-500/70" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-slate-355">
                    {labels.clickToUpload}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                    {labels.supportText}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        onImagesChange(files);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="h-auto rounded-2xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md shadow-emerald-600/10 transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-600"
            >
              {saving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? (labels.updating || "Updating...") : labels.creating}
                </>
              ) : (
                isEditing ? (labels.updateBtn || "Update event") : labels.createBtn
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="h-auto rounded-2xl border-emerald-200 px-5 py-2.5 transition-all duration-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
            >
              {isEditing ? (labels.cancelBtn || "Cancel") : labels.clearBtn}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
