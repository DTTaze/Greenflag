import { Archive, Package, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  price: number;
};

type InventoryListProps = {
  items: InventoryItem[];
  loading: boolean;
  error: string;
  totalStock: number;
  onDelete: (id: string) => void;
};

export function InventoryList({
  items,
  loading,
  error,
  totalStock,
  onDelete,
}: InventoryListProps) {
  const t = useTranslations("partner");

  return (
    <Card className="rounded-[1.75rem] border border-emerald-200/50 bg-white/85 p-6 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md dark:border-emerald-500/20 dark:bg-slate-900/80">
      <CardHeader className="p-0 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white">
            {t("inventory.listTitle")}
          </CardTitle>
          <CardDescription className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
            {t("inventory.listDesc")}
          </CardDescription>
        </div>
        <div className="inline-flex items-center gap-3 text-xs font-bold">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-zinc-800 text-gray-600 dark:text-slate-350">
            {t("inventory.itemsCount", { count: items.length })}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            {t("inventory.stockCount", { count: totalStock })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <div className="w-full overflow-hidden rounded-2xl border border-emerald-200/30 dark:border-emerald-500/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-emerald-50/20 hover:bg-emerald-50/20 dark:bg-slate-950/20 dark:hover:bg-slate-950/20 border-b border-emerald-100 dark:border-emerald-950/45">
                <TableHead className="w-12 text-center pl-4">&nbsp;</TableHead>
                <TableHead className="text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                  {t("inventory.tableTitle")}
                </TableHead>
                <TableHead className="text-center text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                  {t("inventory.tableStock")}
                </TableHead>
                <TableHead className="text-center text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                  {t("inventory.tablePoints")}
                </TableHead>
                <TableHead className="text-right pr-6 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500">
                  {t("inventory.tableActions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm font-semibold text-gray-500 dark:text-slate-400"
                  >
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mr-2 align-middle" />
                    {t("inventory.loading")}
                  </TableCell>
                </TableRow>
              )}
              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-16 text-center text-sm font-medium text-gray-400 dark:text-zinc-550"
                  >
                    <Archive
                      size={40}
                      className="mx-auto mb-3 text-emerald-600/30 dark:text-emerald-400/20"
                    />
                    {t("inventory.noItems")}
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-emerald-50/30 dark:border-emerald-950/20 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-colors"
                  >
                    <TableCell className="text-center py-4 pl-4">
                      <Package className="mx-auto h-5 w-5 text-emerald-600/40 dark:text-emerald-400/30" />
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate py-4 font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge
                        className={
                          item.stock > 10
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-250 dark:bg-emerald-900/30 dark:text-emerald-400 border-none shadow-none"
                            : item.stock > 0
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-250 dark:bg-amber-900/30 dark:text-emerald-400 border-none shadow-none"
                              : "bg-red-100 text-red-800 hover:bg-red-250 dark:bg-red-900/30 dark:text-red-400 border-none shadow-none"
                        }
                      >
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-emerald-700 dark:text-emerald-400 py-4 text-center font-bold">
                      {item.price} pts
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="text-gray-400 hover:text-red-600 rounded-lg p-2 transition hover:bg-red-50 dark:text-zinc-500 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
