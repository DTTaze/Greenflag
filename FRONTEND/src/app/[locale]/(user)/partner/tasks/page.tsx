"use client";

import { ClipboardList } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  partnerChangeTaskStatus,
  partnerCreateTask,
  partnerGetMyTasks,
} from "@/src/services/task";
import {
  TaskDifficulty,
  TaskType,
  TaskVisibility,
} from "@/src/types/task/task.type";

const statusStyles: Record<TaskVisibility, string> = {
  [TaskVisibility.PUBLIC]:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  [TaskVisibility.PRIVATE]:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function PartnerTasksPage() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    coins: 10,
    difficulty: TaskDifficulty.EASY,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const res = await partnerGetMyTasks();
      if (res.success) {
        setTasks(res.data || []);
      } else {
        console.error(res.message);
        setError(res.message || "Không thể tải danh sách nhiệm vụ.");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách nhiệm vụ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Tiêu đề nhiệm vụ là bắt buộc.");
      return;
    }
    if (!form.description.trim()) {
      setError("Mô tả nhiệm vụ là bắt buộc.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await partnerCreateTask({
        title: form.title,
        description: form.description,
        coins: Number(form.coins),
        difficulty: form.difficulty,
      });
      setForm({
        title: "",
        description: "",
        coins: 10,
        difficulty: TaskDifficulty.EASY,
      });
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Không thể tạo nhiệm vụ. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(task: TaskType) {
    try {
      const nextStatus =
        task.status === TaskVisibility.PUBLIC
          ? TaskVisibility.PRIVATE
          : TaskVisibility.PUBLIC;
      await partnerChangeTaskStatus(task.id, { status: nextStatus });
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật trạng thái nhiệm vụ.");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-emerald-600 p-4 text-white shadow-sm">
              <ClipboardList size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                Partner Tasks
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                Tạo nhiệm vụ cộng đồng, phân bổ điểm thưởng và cập nhật trạng
                thái một cách trực quan.
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase">
              Quản lý nhiệm vụ
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              Thiết lập nhiệm vụ nhanh chóng, rõ ràng và dễ theo dõi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.95fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Tạo nhiệm vụ mới
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Điền thông tin nhiệm vụ để thành viên biết chính xác yêu cầu và
                phần thưởng.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase dark:bg-emerald-900/40 dark:text-emerald-200">
              Mới
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleCreate}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Tiêu đề nhiệm vụ
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nhập tiêu đề..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Độ khó
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      difficulty: e.target.value as TaskDifficulty,
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                >
                  <option value={TaskDifficulty.EASY}>Easy</option>
                  <option value={TaskDifficulty.MEDIUM}>Medium</option>
                  <option value={TaskDifficulty.HARD}>Hard</option>
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Mô tả nhiệm vụ
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Nhập mô tả chi tiết..."
                rows={4}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Điểm thưởng
                <input
                  type="number"
                  min={0}
                  value={form.coins}
                  onChange={(e) =>
                    setForm({ ...form, coins: Number(e.target.value) })
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <div className="flex items-end justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setForm({
                      title: "",
                      description: "",
                      coins: 10,
                      difficulty: TaskDifficulty.EASY,
                    })
                  }
                  className="w-full sm:w-auto"
                >
                  Xóa
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={saving}
                >
                  {saving ? "Đang tạo..." : "Tạo nhiệm vụ"}
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}
          </form>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Danh sách nhiệm vụ
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Duyệt nhanh trạng thái và cập nhật nhiệm vụ ngay lập tức.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
              {tasks.length} nhiệm vụ
            </span>
          </div>

          <div className="space-y-4">
            {loading && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                Đang tải nhiệm vụ...
              </div>
            )}
            {!loading && tasks.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                Chưa có nhiệm vụ. Bắt đầu bằng cách tạo nhiệm vụ mới.
              </div>
            )}
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {task.title}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${statusStyles[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {task.description}
                    </p>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Điểm thưởng:{" "}
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {task.coins} pts
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(task)}
                    >
                      {task.status === TaskVisibility.PUBLIC
                        ? "Ẩn nhiệm vụ"
                        : "Hiển thị nhiệm vụ"}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        </section>
      </div>
    </div>
  );
}
