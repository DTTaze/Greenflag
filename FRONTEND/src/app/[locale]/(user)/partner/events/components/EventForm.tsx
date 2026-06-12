"use client";

import React from "react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { CreateEventPayload } from "@/src/types/event/event.payload";

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
};

type EventFormProps = {
  form: CreateEventPayload;
  onFieldChange: (field: keyof CreateEventPayload, value: string | number) => void;
  saving: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  labels: EventFormLabels;
  isEditing?: boolean;
};

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-800/30 dark:bg-gray-950 dark:text-gray-100";

export function EventForm({
  form,
  onFieldChange,
  saving,
  error,
  onSubmit,
  onReset,
  labels,
  isEditing = false,
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
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            {labels.titleLabel}
            <input
              value={form.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
              placeholder={labels.titlePlaceholder}
              className={INPUT_CLASS}
            />
          </label>

          {/* Description */}
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            {labels.descriptionLabel}
            <textarea
              value={form.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder={labels.descriptionPlaceholder}
              rows={3}
              className={`${INPUT_CLASS} resize-none`}
            />
          </label>

          {/* Location */}
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            {labels.locationLabel}
            <input
              value={form.location}
              onChange={(e) => onFieldChange("location", e.target.value)}
              placeholder={labels.locationPlaceholder}
              className={INPUT_CLASS}
            />
          </label>

          {/* Capacity + Coins */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.capacityLabel}
              <input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => onFieldChange("capacity", Number(e.target.value))}
                className={INPUT_CLASS}
              />
            </label>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.coinsLabel}
              <input
                type="number"
                min={0}
                value={form.coins}
                onChange={(e) => onFieldChange("coins", Number(e.target.value))}
                className={INPUT_CLASS}
              />
            </label>
          </div>

          {/* Registration Deadline */}
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            {labels.endSignLabel}
            <input
              type="datetime-local"
              value={form.end_sign}
              onChange={(e) => onFieldChange("end_sign", e.target.value)}
              className={INPUT_CLASS}
            />
          </label>

          {/* Start + End Time */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.startTimeLabel}
              <input
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => onFieldChange("start_time", e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {labels.endTimeLabel}
              <input
                type="datetime-local"
                value={form.end_time}
                onChange={(e) => onFieldChange("end_time", e.target.value)}
                className={INPUT_CLASS}
              />
            </label>
          </div>

          {error && (
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          )}

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
