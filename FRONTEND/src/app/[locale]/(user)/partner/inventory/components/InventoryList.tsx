import { Button } from "@/src/components/ui/button";
import React from "react";

type InventoryItem = {
  id: string | number;
  name: string;
  stock?: number;
  points?: number;
};

type InventoryListProps = {
  items: InventoryItem[];
  loading: boolean;
  error: string;
  totalStock: number;
  onDelete: (id: string | number) => void;
  labels: {
    heading: string;
    description: string;
    noItems: string;
    loading: string;
    itemCountLabel: string;
    totalStockLabel: string;
    deleteBtn: string;
  };
};

export function InventoryList({
  items,
  loading,
  error,
  totalStock,
  onDelete,
  labels,
}: InventoryListProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {labels.heading}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {labels.description}
          </p>
        </div>
        <div className="space-y-1 text-right text-sm text-slate-500 dark:text-slate-400">
          <div>
            {items.length} {labels.itemCountLabel}
          </div>
          <div>
            {labels.totalStockLabel}: {totalStock}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
            {labels.loading}
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
            {labels.noItems}
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
                  {item.points} pts • Tồn kho {item.stock}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  {labels.deleteBtn}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </div>
    </section>
  );
}
