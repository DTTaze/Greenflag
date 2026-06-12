import { useTranslations } from "next-intl";
import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

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
  const t = useTranslations("partner");

  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {t("profile.partnerSection")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-5">
        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          {t("profile.organization")}
          <Input
            value={partnerMeta.organization}
            onChange={(event) =>
              onPartnerMetaChange("organization", event.target.value)
            }
            className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-500/20 dark:bg-gray-950 dark:text-gray-100 h-auto"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          {t("profile.contactName")}
          <Input
            value={partnerMeta.contactName}
            onChange={(event) =>
              onPartnerMetaChange("contactName", event.target.value)
            }
            className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-500/20 dark:bg-gray-950 dark:text-gray-100 h-auto"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          {t("profile.address")}
          <Input
            value={partnerMeta.address}
            onChange={(event) =>
              onPartnerMetaChange("address", event.target.value)
            }
            className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-500/20 dark:bg-gray-950 dark:text-gray-100 h-auto"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          {t("profile.description")}
          <textarea
            rows={4}
            value={partnerMeta.description}
            onChange={(event) =>
              onPartnerMetaChange("description", event.target.value)
            }
            className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-500/20 dark:bg-gray-950 dark:text-gray-100 min-h-[120px] resize-y"
          />
        </label>
      </CardContent>
    </Card>
  );
}
