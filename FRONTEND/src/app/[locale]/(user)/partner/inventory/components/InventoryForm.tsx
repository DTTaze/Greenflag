import { Check, Loader2, Plus, UploadCloud, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

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
import mediaServices from "@/src/services/media";

type InventoryFormValues = {
  name: string;
  stock: number;
  points: number;
  images?: string[];
};

type InventoryFormProps = {
  form: InventoryFormValues;
  setForm: React.Dispatch<React.SetStateAction<InventoryFormValues>>;
  saving: boolean;
  error: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  isEditing?: boolean;
};

export function InventoryForm({
  form,
  setForm,
  saving,
  error,
  onSubmit,
  onReset,
  isEditing = false,
}: InventoryFormProps) {
  const t = useTranslations("partner");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await mediaServices.uploadFile(file);
      const url = res.data?.secureUrl || res.data?.secure_url || "";
      if (url) {
        setForm((prev) => ({ ...prev, images: [url] }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="h-fit rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
          {isEditing ? t("inventory.panelTitleEdit") : t("inventory.panelTitle")}
        </CardTitle>
        <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
          {isEditing ? t("inventory.panelDescEdit") : t("inventory.panelDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form className="grid gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              {t("inventory.itemNameLabel")} <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("inventory.namePlaceholder")}
              className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-850/30 dark:bg-gray-950 dark:text-gray-100 h-auto"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                {t("inventory.stockLabel")} <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-855/30 dark:bg-gray-950 dark:text-gray-100 h-auto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                {t("inventory.pointsLabel")} <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                value={form.points}
                onChange={(e) =>
                  setForm({ ...form, points: Number(e.target.value) })
                }
                className="w-full rounded-2xl border border-emerald-200/40 bg-emerald-50/10 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 dark:border-emerald-855/30 dark:bg-gray-950 dark:text-gray-100 h-auto"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              {t("inventory.uploadImageLabel")}
            </Label>
            <div className="relative mt-1 flex justify-center rounded-2xl border border-dashed border-emerald-250/50 bg-emerald-50/5 px-6 py-6 transition duration-200 hover:border-emerald-400 hover:bg-emerald-50/10 dark:border-emerald-800/30 dark:bg-zinc-950/20 dark:hover:border-emerald-600">
              {form.images && form.images.length > 0 ? (
                <div className="relative group w-full max-w-[150px] aspect-square rounded-2xl overflow-hidden border border-emerald-100 dark:border-zinc-800 shadow-xs bg-slate-50 dark:bg-zinc-950/20">
                  <img
                    src={form.images[0]}
                    alt="Preview"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Sleek Delete button at the top-right corner */}
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, images: [] }))}
                      className="rounded-full h-7 w-7 p-0 shadow-lg bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 hover:border-red-500/20 transition-all duration-200 hover:scale-110 flex items-center justify-center"
                      title="Xóa hình ảnh"
                    >
                      <X size={12} className="shrink-0" />
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 text-center w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-500" />
                      <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                        {t("inventory.uploadingImage")}
                      </span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 text-emerald-500/70" />
                      <span className="text-xs font-semibold text-gray-600 dark:text-slate-350">
                        Nhấp hoặc kéo thả để tải ảnh vật phẩm
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                        Hỗ trợ PNG, JPG, WEBP lên đến 5MB
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
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
              {isEditing ? t("inventory.cancelEditBtn") : t("inventory.clearBtn")}
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto rounded-2xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-600 transition-all duration-300 px-5 py-2.5 h-auto"
              disabled={saving || uploading}
            >
              {isEditing ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {saving ? t("inventory.saving") : t("inventory.editBtn")}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {saving ? t("inventory.adding") : t("inventory.addBtn")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
