import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
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

type InventoryFormValues = {
  name: string;
  stock: number;
  points: number;
};

type InventoryFormProps = {
  form: InventoryFormValues;
  setForm: React.Dispatch<React.SetStateAction<InventoryFormValues>>;
  saving: boolean;
  error: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

export function InventoryForm({
  form,
  setForm,
  saving,
  error,
  onSubmit,
  onReset,
}: InventoryFormProps) {
  const t = useTranslations("partner");

  return (
    <Card className="h-fit rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {t("inventory.panelTitle")}
        </CardTitle>
        <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
          {t("inventory.panelDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form className="grid gap-5" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
            {t("inventory.itemNameLabel")}
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("inventory.namePlaceholder")}
              className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-850/30 dark:bg-gray-950 dark:text-gray-100 h-auto"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
              {t("inventory.stockLabel")}
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-855/30 dark:bg-gray-950 dark:text-gray-100 h-auto"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
              {t("inventory.pointsLabel")}
              <Input
                type="number"
                min={0}
                value={form.points}
                onChange={(e) =>
                  setForm({ ...form, points: Number(e.target.value) })
                }
                className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-855/30 dark:bg-gray-950 dark:text-gray-100 h-auto"
              />
            </label>
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-500">{error}</p>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full sm:w-auto rounded-2xl border-emerald-250 hover:bg-emerald-50 hover:text-emerald-855 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/20 px-5 py-2.5 h-auto transition-all duration-300 font-bold"
            >
              {t("inventory.clearBtn")}
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-2xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-600 transition-all duration-300 px-5 py-2.5 h-auto"
              disabled={saving}
            >
              <Plus className="mr-2 h-4 w-4" />
              {saving ? t("inventory.adding") : t("inventory.addBtn")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
