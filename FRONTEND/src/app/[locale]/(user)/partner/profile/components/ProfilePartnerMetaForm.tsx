import React from "react";

type PartnerMeta = {
  organization: string;
  contactName: string;
  address: string;
  description: string;
};

type ProfilePartnerMetaFormProps = {
  partnerMeta: PartnerMeta;
  onPartnerMetaChange: (field: keyof PartnerMeta, value: string) => void;
};

export function ProfilePartnerMetaForm({
  partnerMeta,
  onPartnerMetaChange,
}: ProfilePartnerMetaFormProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Hồ sơ đối tác
      </h2>
      <div className="mt-6 grid gap-4">
        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Organization
          <input
            value={partnerMeta.organization}
            onChange={(event) =>
              onPartnerMetaChange("organization", event.target.value)
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Contact name
          <input
            value={partnerMeta.contactName}
            onChange={(event) =>
              onPartnerMetaChange("contactName", event.target.value)
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Address
          <input
            value={partnerMeta.address}
            onChange={(event) =>
              onPartnerMetaChange("address", event.target.value)
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
          <textarea
            rows={4}
            value={partnerMeta.description}
            onChange={(event) =>
              onPartnerMetaChange("description", event.target.value)
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>
      </div>
    </section>
  );
}
