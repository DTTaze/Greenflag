import React from "react";

type ProfileContactFormProps = {
  profile: { full_name?: string; email?: string; phone_number?: string } | null;
  onProfileChange: (field: string, value: string) => void;
};

export function ProfileContactForm({
  profile,
  onProfileChange,
}: ProfileContactFormProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Thông tin liên hệ
      </h2>
      <div className="mt-6 grid gap-4">
        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Full name
          <input
            value={profile?.full_name || ""}
            onChange={(event) =>
              onProfileChange("full_name", event.target.value)
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Email
          <input
            value={profile?.email || ""}
            onChange={(event) => onProfileChange("email", event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Phone
          <input
            value={profile?.phone_number || ""}
            onChange={(event) =>
              onProfileChange("phone_number", event.target.value)
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
          />
        </label>
      </div>
    </section>
  );
}
