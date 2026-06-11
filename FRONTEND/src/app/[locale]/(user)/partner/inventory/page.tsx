"use client";

import { Archive, Package, Plus, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

import { Button } from "@/src/components/ui/button";
import { commerceServices } from "@/src/services/commerce";
import { UserService } from "@/src/services/user";

export default function PartnerInventoryPage() {
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
        weight: 1,
        length: 1,
        width: 1,
        height: 1,
      });
      setForm({ name: "", stock: 0, points: 0 });
      toast.success("Đã thêm vật phẩm mới vào kho!");
      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Không thể thêm vật phẩm. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vật phẩm này?")) return;
    try {
      await commerceServices.partnerDeleteItem(id);
      toast.success("Xóa vật phẩm thành công.");
      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Không thể xóa vật phẩm.");
    }
  }

  const totalStock = items.reduce(
    (sum: number, item: any) => sum + Number(item.stock || 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <Package size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Gift Inventory
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-zinc-400">
                Quản lý kho hàng quà tặng, số lượng tồn kho và điểm thưởng của
                đối tác.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100/30 bg-emerald-50/50 p-4 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
            <p className="text-sm text-xs font-semibold tracking-wider uppercase">
              Kho quà tặng
            </p>
            <p className="dark:text-zinc-350 mt-1 text-xs text-slate-700">
              Tối ưu tồn kho và giữ thông tin mặt hàng rõ ràng.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Create Form Section */}
        <section className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Thêm vật phẩm mới
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
              Bổ sung quà tặng mới và điều chỉnh điểm thưởng phù hợp.
            </p>
          </div>

          <form className="grid gap-5" onSubmit={handleAdd}>
            <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Tên vật phẩm
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ví dụ: Áo thun xanh tái chế"
                className="focus:border-emerald-450 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-100"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Tồn kho
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="focus:border-emerald-450 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-100"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Điểm thưởng (xu đổi)
                <input
                  type="number"
                  min={0}
                  value={form.points}
                  onChange={(e) =>
                    setForm({ ...form, points: Number(e.target.value) })
                  }
                  className="focus:border-emerald-450 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition duration-200 outline-none focus:ring-2 focus:ring-emerald-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-gray-100"
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
                onClick={() => setForm({ name: "", stock: 0, points: 0 })}
                className="w-full sm:w-auto"
              >
                Nhập lại
              </Button>
              <Button
                type="submit"
                className="bg-emerald-650 w-full font-semibold text-white hover:bg-emerald-700 sm:w-auto dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-600"
                disabled={saving}
              >
                <Plus className="mr-2 h-4 w-4" />
                {saving ? "Đang thêm..." : "Thêm vật phẩm"}
              </Button>
            </div>
          </form>
        </section>

        {/* Data Table Section */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Danh sách vật phẩm
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
                Quản lý số lượng, điểm thưởng và cập nhật kho quà.
              </p>
            </div>
            <div className="inline-flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-zinc-400">
              <div className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-zinc-800">
                {items.length} mặt hàng
              </div>
              <div className="dark:text-emerald-450 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 dark:bg-emerald-950/20">
                Tồn kho: {totalStock}
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-650 dark:text-zinc-450 bg-gray-100 text-xs font-bold tracking-wider uppercase dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-4">{/* Icon */}&nbsp;</th>
                    <th className="px-6 py-4">Tên vật phẩm</th>
                    <th className="px-6 py-4 text-center">Số lượng</th>
                    <th className="px-6 py-4 text-center">Điểm quy đổi</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-900">
                  {loading && (
                    <tr>
                      <td
                        colSpan={5}
                        className="animate-pulse py-8 text-center font-medium text-gray-500"
                      >
                        Đang tải kho hàng...
                      </td>
                    </tr>
                  )}
                  {!loading && items.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-gray-400 dark:text-zinc-500"
                      >
                        <Archive
                          size={40}
                          className="mx-auto mb-3 text-gray-300 dark:text-zinc-700"
                        />
                        Chưa có vật phẩm nào trong kho.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    items.map((item) => (
                      <tr
                        key={item.id}
                        className="group dark:hover:bg-zinc-850/30 transition-colors duration-150 even:bg-gray-50/50 hover:bg-gray-100/40 dark:even:bg-zinc-950/30"
                      >
                        <td className="px-6 py-4">
                          <Package className="group-hover:text-emerald-550 h-5 w-5 text-gray-400 transition-colors" />
                        </td>
                        <td className="max-w-[200px] truncate px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-center font-medium">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              item.stock > 10
                                ? "bg-emerald-100/50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
                                : item.stock > 0
                                  ? "bg-amber-100/50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                                  : "bg-red-100/50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            {item.stock}
                          </span>
                        </td>
                        <td className="text-emerald-650 dark:text-emerald-450 px-6 py-4 text-center font-bold">
                          {item.price} pts
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-gray-450 hover:text-red-650 rounded-lg p-2 transition hover:bg-red-50 dark:text-zinc-500 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
          )}
        </section>
      </div>
    </div>
  );
}
