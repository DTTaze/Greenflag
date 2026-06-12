"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "react-toastify";

import { commerceServices } from "@/src/services/commerce";
import { UserService } from "@/src/services/user";

import { InventoryForm } from "./components/InventoryForm";
import { InventoryHeader } from "./components/InventoryHeader";
import { InventoryList } from "./components/InventoryList";

export default function PartnerInventoryPage() {
  const t = useTranslations("partner");

  const [items, setItems] = React.useState<any[]>([]);
  const [form, setForm] = React.useState({ name: "", stock: 0, points: 0 });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const res = await commerceServices.getAllItems();
      const data = res || [];
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

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await UserService.getProfile();
        if (!mounted) return;
        setUserId(profile?.id || null);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (userId !== null) loadItems();
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
      });
      setForm({ name: "", stock: 0, points: 0 });
      toast.success(t("inventory.validation.addSuccess"));
      await loadItems();
    } catch (err) {
      console.error(err);
      setError(t("inventory.validation.addFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("inventory.validation.deleteConfirm"))) return;
    try {
      await commerceServices.partnerDeleteItem(id);
      toast.success(t("inventory.validation.deleteSuccess"));
      await loadItems();
    } catch (err) {
      console.error(err);
      setError(t("inventory.validation.deleteFailed"));
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
        {/* Create Form Section */}
        <InventoryForm
          form={form}
          setForm={setForm}
          saving={saving}
          error={error}
          onSubmit={handleAdd}
          onReset={() => setForm({ name: "", stock: 0, points: 0 })}
        />

        {/* Data Table Section */}
        <InventoryList
          items={items}
          loading={loading}
          error={error}
          totalStock={totalStock}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
