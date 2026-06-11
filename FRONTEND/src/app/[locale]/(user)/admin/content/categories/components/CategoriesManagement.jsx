"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";

const initialCategories = [
  {
    id: "cat-1",
    name: "Thiết bị tái chế",
    description: "Các loại thiết bị, pin và linh kiện điện tử.",
    createdAt: "2025-01-12",
  },
  {
    id: "cat-2",
    name: "Chất thải hữu cơ",
    description: "Thực phẩm, vỏ rau quả và rác hữu cơ.",
    createdAt: "2025-02-05",
  },
];

export default function CategoriesManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);

  const openEdit = (category) => {
    setEditing(category);
    setName(category.name);
    setDescription(category.description);
  };

  const resetForm = () => {
    setEditing(null);
    setName("");
    setDescription("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) return;

    if (editing) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editing.id
            ? {
                ...category,
                name: name.trim(),
                description: description.trim(),
              }
            : category,
        ),
      );
    } else {
      setCategories((current) => [
        ...current,
        {
          id: `cat-${Date.now()}`,
          name: name.trim(),
          description: description.trim(),
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    resetForm();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (categoryId) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa danh mục này không?",
    );
    if (!confirmed) return;
    setCategories((current) =>
      current.filter((category) => category.id !== categoryId),
    );
  };

  const categoryCount = useMemo(() => categories.length, [categories]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl border border-emerald-200/60 bg-white p-8 shadow-lg shadow-emerald-100/55 dark:border-emerald-500/15 dark:bg-slate-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-slate-100">
              Quản lý danh mục
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Thêm, sửa hoặc xóa danh mục nội dung hiển thị cho người dùng.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-950/70 dark:text-slate-200">
            Tổng cộng: {categoryCount} danh mục
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr,0.9fr]">
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-3xl border border-emerald-200/60 bg-slate-50 p-6 shadow-sm dark:border-emerald-500/15 dark:bg-slate-950/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {category.description}
                    </p>
                  </div>
                  <span className="text-xs tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                    {category.createdAt}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    onClick={() => openEdit(category)}
                    variant="secondary"
                    className="inline-flex items-center gap-2 rounded-3xl px-4 py-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    onClick={() => handleDelete(category.id)}
                    variant="destructive"
                    className="inline-flex items-center gap-2 rounded-3xl px-4 py-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-emerald-200/60 bg-slate-50 p-6 shadow-sm dark:border-emerald-500/15 dark:bg-slate-950/60">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">
                  {editing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Thiết lập tên và mô tả cho danh mục.
                </p>
              </div>
              <Button
                onClick={resetForm}
                variant="ghost"
                className="rounded-full px-4 py-2 text-slate-700 dark:text-slate-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tên danh mục
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-emerald-500/30 dark:border-emerald-500/15 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Ví dụ: Nhóm sản phẩm tái chế"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mô tả
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  required
                  className="mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-emerald-500 focus:ring-emerald-500/30 dark:border-emerald-500/15 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Mô tả nội dung và cách sử dụng danh mục"
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="submit"
                  className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  {editing ? "Cập nhật danh mục" : "Thêm danh mục"}
                </Button>
                {saved && (
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Lưu thành công
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
