import { useTranslations } from "next-intl";
import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

type ProfileContactFormProps = {
  profile: { full_name?: string; email?: string; phone_number?: string } | null;
  onProfileChange: (field: string, value: string) => void;
};

export function ProfileContactForm({
  profile,
  onProfileChange,
}: ProfileContactFormProps) {
  const t = useTranslations("partner");

  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {t("profile.contactSection")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-5">
        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          {t("profile.fullName")}
          <Input
            value={profile?.full_name || ""}
            onChange={(e) => onProfileChange("full_name", e.target.value)}
            className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-500/20 dark:bg-gray-950 dark:text-gray-100 h-auto"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          {t("profile.email")}
          <Input
            value={profile?.email || ""}
            onChange={(e) => onProfileChange("email", e.target.value)}
            className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-500/20 dark:bg-gray-950 dark:text-gray-100 h-auto"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          {t("profile.phone")}
          <Input
            value={profile?.phone_number || ""}
            onChange={(e) => onProfileChange("phone_number", e.target.value)}
            className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-500/20 dark:bg-gray-950 dark:text-gray-100 h-auto"
          />
        </label>
      </CardContent>
    </Card>
  );
}
