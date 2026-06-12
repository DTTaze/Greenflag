"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { commerceServices } from "@/src/services/commerce";
import { UserService } from "@/src/services/user";

import { InventoryForm } from "./components/InventoryForm";
import { InventoryHeader } from "./components/InventoryHeader";
import { InventoryList } from "./components/InventoryList";

type FormState = {
  name: string;
  stock: number;
  points: number;
  images?: string[];
};

export default function PartnerInventoryPage() {
  const t = useTranslations("partner");

  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    stock: 0,
    points: 0,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const res = await commerceServices.getAllItems();
      const data = res.data || [];
      const myItems = userId
        ? data.filter((it: any) => it.creator?.id === userId)
        : data;
      setItems(myItems);
    } catch (err) {
      console.error(err);
      setError(t("inventory.errorLoading"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await UserService.getProfile();
        if (!mounted) return;
        const profileId = profile?.id ?? profile?.data?.id ?? null;
        setUserId(profileId);
      } catch (err) {
        console.error(err);
      }
      if (mounted) await loadItems();
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    if (!form.name.trim()) {
      setError(t("inventory.validation.nameRequired"));
      setSaving(false);
      return;
    }

    try {
      await commerceServices.partnerCreateItem({
        name: form.name,
        stock: Number(form.stock),
        price: Number(form.points),
        weight: 1,
        length: 1,
        width: 1,
        height: 1,
        images: form.images || [],
      });
      setForm({ name: "", stock: 0, points: 0, images: [] });
      toast.success(t("inventory.validation.addSuccess"));
      await loadItems();
    } catch (err) {
      console.error(err);
      setError(t("inventory.validation.addFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItemId) return;
    setSaving(true);
    setError("");
    if (!form.name.trim()) {
      setError(t("inventory.validation.nameRequired"));
      setSaving(false);
      return;
    }

    try {
      await commerceServices.partnerUpdateItem(editingItemId, {
        name: form.name,
        stock: Number(form.stock),
        price: Number(form.points),
        images: form.images || [],
      });
      setForm({ name: "", stock: 0, points: 0, images: [] });
      setEditingItemId(null);
      toast.success(t("inventory.validation.editSuccess"));
      await loadItems();
    } catch (err) {
      console.error(err);
      setError(t("inventory.validation.editFailed"));
    } finally {
      setSaving(false);
    }
  }

  function handleEditSelect(item: any) {
    setEditingItemId(item.id);
    setForm({
      name: item.name || "",
      stock: item.stock || 0,
      points: item.price || 0,
      images: item.images || [],
    });
    setError("");
  }

  function handleReset() {
    setForm({ name: "", stock: 0, points: 0, images: [] });
    setEditingItemId(null);
    setError("");
  }

  async function handleConfirmDelete() {
    if (!itemToDeleteId) return;
    setDeleting(true);
    try {
      await commerceServices.partnerDeleteItem(itemToDeleteId);
      toast.success(t("inventory.validation.deleteSuccess"));
      if (editingItemId === itemToDeleteId) {
        handleReset();
      }
      setItemToDeleteId(null);
      await loadItems();
    } catch (err) {
      console.error(err);
      toast.error(t("inventory.validation.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  }

  const totalStock = items.reduce(
    (sum: number, item: any) => sum + Number(item.stock || 0),
    0,
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header Panel */}
      <InventoryHeader />

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Create / Edit Form Section */}
        <InventoryForm
          form={form}
          setForm={setForm}
          saving={saving}
          error={error}
          onSubmit={editingItemId ? handleUpdate : handleAdd}
          onReset={handleReset}
          isEditing={!!editingItemId}
        />

        {/* Data Table Section */}
        <InventoryList
          items={items}
          loading={loading}
          error={error}
          totalStock={totalStock}
          onDelete={setItemToDeleteId}
          onEdit={handleEditSelect}
          editingItemId={editingItemId}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!itemToDeleteId} onOpenChange={(open) => { if (!open) setItemToDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              {t("inventory.validation.deleteTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-slate-400 mt-2">
              {t("inventory.validation.deleteConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setItemToDeleteId(null)}
              disabled={deleting}
              className="w-full sm:w-auto rounded-xl"
            >
              {t("inventory.validation.cancelDelete")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-750 text-white rounded-xl"
            >
              {deleting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                t("inventory.validation.confirmDelete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
