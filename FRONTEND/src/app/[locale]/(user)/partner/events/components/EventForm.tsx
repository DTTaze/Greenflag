import { FormEvent } from "react";
import React from "react";

import { Button } from "@/src/components/ui/button";

type EventFormProps = {
  eventName: string;
  setEventName: (name: string) => void;
  generating: boolean;
  error: string;
  onGenerate: () => Promise<void>;
  onClear: () => void;
  labels: {
    heading: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    generateBtn: string;
    generating: string;
    clearBtn: string;
  };
};

export function EventForm({
  eventName,
  setEventName,
  generating,
  error,
  onGenerate,
  onClear,
  labels,
}: EventFormProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {labels.heading}
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {labels.description}
      </p>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {labels.inputLabel}
          <input
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
            placeholder={labels.inputPlaceholder}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={onGenerate} disabled={generating}>
            {generating ? labels.generating : labels.generateBtn}
          </Button>
          <Button type="button" variant="outline" onClick={onClear}>
            {labels.clearBtn}
          </Button>
        </div>
      </div>
    </section>
  );
}
