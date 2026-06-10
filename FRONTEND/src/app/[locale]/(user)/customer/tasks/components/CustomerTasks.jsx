"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  partnerCreateTask,
  partnerDeleteTask,
  partnerGetMyTasks,
  partnerUpdateTask,
} from "@/src/services/task";

import TaskDialog from "./TaskDialog.jsx";

export default function CustomerTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await partnerGetMyTasks();
      setTasks(response.data || []);
    } catch (err) {
      setError("Không thể tải danh sách nhiệm vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getTaskId = (task) => task.id || task._id;

  const handleCreate = () => {
    setEditTask(null);
    setDialogOpen(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm("Xóa nhiệm vụ này?");
    if (!confirmed) return;
    setSaving(true);
    try {
      await partnerDeleteTask(taskId);
      setTasks((current) =>
        current.filter((task) => getTaskId(task) !== taskId),
      );
    } catch (err) {
      window.alert("Xóa nhiệm vụ thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (payload, taskId) => {
    setSaving(true);
    try {
      if (taskId) {
        const response = await partnerUpdateTask(taskId, payload);
        setTasks((current) =>
          current.map((task) =>
            getTaskId(task) === taskId ? response.data : task,
          ),
        );
      } else {
        const response = await partnerCreateTask(payload);
        setTasks((current) => [response.data, ...current]);
      }
      setDialogOpen(false);
      setEditTask(null);
    } catch (err) {
      window.alert(
        "Lưu nhiệm vụ thất bại. Vui lòng kiểm tra dữ liệu và thử lại.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-slate-100">
              Quản lý nhiệm vụ đối tác
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Tạo, cập nhật và theo dõi các nhiệm vụ xanh do đối tác cung cấp.
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tạo nhiệm vụ mới
          </Button>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">Đang tải nhiệm vụ...</p>
        )}
        {error && <p className="text-sm text-rose-600">{error}</p>}

        {!loading && !tasks.length && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300">
            Không tìm thấy nhiệm vụ nào. Bắt đầu bằng cách tạo nhiệm vụ mới.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={getTaskId(task)}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
                    {task.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {task.description || "Không có mô tả."}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-emerald-700 uppercase dark:bg-emerald-900 dark:text-emerald-300">
                  {task.difficulty ||
                    "Khó"
                      .toString()
                      .replace(/easy/i, "Dễ")
                      .replace(/medium/i, "Trung bình")
                      .replace(/hard/i, "Khó")}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span>Reward: {task.coins ?? 0} xu</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 dark:bg-slate-800">
                  Trạng thái: {task.status || "public"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={() => handleEdit(task)}
                  variant="secondary"
                  className="inline-flex items-center gap-2 rounded-3xl px-4 py-2"
                >
                  <Pencil className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button
                  onClick={() => handleDelete(getTaskId(task))}
                  variant="destructive"
                  className="inline-flex items-center gap-2 rounded-3xl px-4 py-2"
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskDialog
        open={dialogOpen}
        task={editTask}
        onClose={() => {
          setDialogOpen(false);
          setEditTask(null);
        }}
        onSave={handleSave}
        loading={saving}
      />
    </div>
  );
}
