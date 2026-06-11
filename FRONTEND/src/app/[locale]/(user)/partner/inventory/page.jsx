"use client";

import { Package } from "lucide-react";
import React from "react";

import { commerceServices } from "@/src/services/commerce";
import { UserService } from "@/src/services/user";

export default function PartnerInventoryPage() {
  const [items, setItems] = React.useState([]);
  const [form, setForm] = React.useState({ name: "", stock: 0, points: 0 });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [userId, setUserId] = React.useState(null);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await commerceServices.getAllItems();
      const data = res || [];
      // If backend doesn't provide partner-only list, filter by creator id
      const myItems = userId
        ? data.filter((it) => it.creator?.id === userId)
        : data;
      setItems(myItems);
    } catch (err) {
      console.error(err);
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
    return () => (mounted = false);
  }, []);

  React.useEffect(() => {
    // reload when we know userId
    if (userId !== null) loadItems();
  }, [userId]);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await commerceServices.partnerCreateItem({
        name: form.name,
        stock: Number(form.stock),
        points: Number(form.points),
      });
      setForm({ name: "", stock: 0, points: 0 });
      await loadItems();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await commerceServices.partnerDeleteItem(id);
      await loadItems();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-md bg-emerald-600 p-3 text-white">
          <Package />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Gift Inventory
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Manage reward items, vouchers and stock levels.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Item name"
          className="rounded-md border px-3 py-2"
        />
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="w-24 rounded-md border px-3 py-2"
          placeholder="Stock"
        />
        <input
          type="number"
          value={form.points}
          onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
          className="w-24 rounded-md border px-3 py-2"
          placeholder="Points"
        />
        <button
          className="rounded-md bg-emerald-600 px-3 py-2 text-white"
          disabled={saving}
        >
          {saving ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="space-y-2">
        {loading && (
          <div className="text-sm text-gray-500">Loading items...</div>
        )}
        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-500">No items yet.</div>
        )}
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div>
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-gray-600">
                Stock: {it.stock} • {it.points} pts
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDelete(it.id)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
