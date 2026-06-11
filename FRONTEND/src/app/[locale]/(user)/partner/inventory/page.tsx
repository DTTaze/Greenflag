"use client";

import { Package } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import { commerceServices } from "@/src/services/commerce";
import { UserService } from "@/src/services/user";

export default function PartnerInventoryPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [form, setForm] = React.useState({ name: "", stock: 0, points: 0 });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
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
      setError("Không thể tải kho hàng. Vui lòng thử lại.");
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
      setError("Tên vật phẩm là bắt buộc.");
      setSaving(false);
      return;
    }

    try {
      await commerceServices.partnerCreateItem({
        name: form.name,
        stock: Number(form.stock),
        price: Number(form.points),
        weight: 100,
        length: 10,
        width: 10,
        height: 10,
      });
      setForm({ name: "", stock: 0, points: 0 });
      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Không thể thêm vật phẩm. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: any) {
    try {
      await commerceServices.partnerDeleteItem(id);
      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Không thể xóa vật phẩm.");
    }
  }

  const totalStock = items.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0,
  );

  return (
    <div className="p-6">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <Package size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Gift Inventory
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                Quản lý kho hàng quà tặng, số lượng tồn kho và điểm thưởng cho
                đối tác.
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase">
              Kho quà
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              Tối ưu tồn kho và giữ thông tin mặt hàng rõ ràng.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Thêm vật phẩm mới
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Bổ sung quà tặng mới và điều chỉnh điểm thưởng phù hợp.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
              Kho hiện tại
            </span>
          </div>

          <form className="grid gap-4" onSubmit={handleAdd}>
            <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Tên vật phẩm
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ví dụ: Áo thun xanh"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Tồn kho
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Điểm thưởng
                <input
                  type="number"
                  min={0}
                  value={form.points}
                  onChange={(e) =>
                    setForm({ ...form, points: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm({ name: "", stock: 0, points: 0 })}
                className="w-full sm:w-auto"
              >
                Xóa
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={saving}
              >
                {saving ? "Đang thêm..." : "Thêm vật phẩm"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Danh sách vật phẩm
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Quản lý số lượng, điểm thưởng và xóa mặt hàng không dùng nữa.
              </p>
            </div>
            <div className="space-y-1 text-right text-sm text-slate-500 dark:text-slate-400">
              <div>{items.length} mặt hàng</div>
              <div>Tổng tồn kho: {totalStock}</div>
            </div>
          </div>

          <div className="space-y-4">
            {loading && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                Đang tải kho hàng...
              </div>
            )}
            {!loading && items.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                Chưa có vật phẩm nào. Hãy tạo mặt hàng đầu tiên.
              </div>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {item.price} pts • Tồn kho {item.stock}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        </section>
      </div>
    </div>
  );
}
