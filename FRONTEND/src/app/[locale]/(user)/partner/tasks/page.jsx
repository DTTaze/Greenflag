"use client";

import { ClipboardList } from "lucide-react";
import React from "react";

import {
  partnerChangeTaskStatus,
  partnerCreateTask,
  partnerGetMyTasks,
} from "@/src/services/task";

export default function PartnerTasksPage() {
  const [tasks, setTasks] = React.useState([]);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    coins: 10,
    difficulty: "easy",
  });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await partnerGetMyTasks();
      setTasks(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await partnerCreateTask({
        title: form.title,
        description: form.description,
        coins: Number(form.coins),
        difficulty: form.difficulty,
      });
      setForm({ title: "", description: "", coins: 10, difficulty: "easy" });
      await loadTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(task) {
    try {
      const nextStatus = task.status === "public" ? "private" : "public";
      await partnerChangeTaskStatus(task.id, { status: nextStatus });
      await loadTasks();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-md bg-emerald-600 p-3 text-white">
          <ClipboardList />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Partner Tasks
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Create and manage green tasks with approval rules and reward points.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="mb-6 grid gap-3 md:grid-cols-3">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Task title"
          className="rounded-md border px-3 py-2"
        />
        <input
          value={form.coins}
          onChange={(e) => setForm({ ...form, coins: e.target.value })}
          type="number"
          className="rounded-md border px-3 py-2"
        />
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="rounded-md border px-3 py-2"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="col-span-3 rounded-md border px-3 py-2"
        />
        <div className="col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-emerald-600 px-3 py-2 text-white"
          >
            {saving ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {loading && (
          <div className="text-sm text-gray-500">Loading tasks...</div>
        )}
        {!loading && tasks.length === 0 && (
          <div className="text-sm text-gray-500">No tasks yet.</div>
        )}
        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div>
              <div className="font-semibold">
                {t.title}{" "}
                <span className="ml-2 text-xs text-gray-500">
                  {t.coins} pts
                </span>
              </div>
              <div className="text-sm text-gray-600">{t.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`text-sm font-medium ${t.status === "public" ? "text-emerald-600" : "text-gray-600"}`}
              >
                {t.status}
              </div>
              <button
                onClick={() => toggleVisibility(t)}
                className="rounded-md bg-emerald-600 px-3 py-1 text-white"
              >
                Toggle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
