"use client";

import { ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";

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
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";

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
  const t = useTranslations("partner");

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
      setError(t("tasks.errors.titleRequired"));
      return;
    }
    if (!form.description.trim()) {
      setError(t("tasks.errors.descriptionRequired"));
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
      setError(t("tasks.errors.createFailed"));
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
      setError(t("tasks.errors.updateStatusFailed"));
    }
  }

  const taskFormLabels = {
    panelTitle: t("tasks.panelTitle"),
    panelDesc: t("tasks.panelDesc"),
    newTag: t("tasks.newTag"),
    titleLabel: t("tasks.titleLabel"),
    titlePlaceholder: t("tasks.titlePlaceholder"),
    difficultyLabel: t("tasks.difficultyLabel"),
    difficultyEasy: t("tasks.difficulty.easy"),
    difficultyMedium: t("tasks.difficulty.medium"),
    difficultyHard: t("tasks.difficulty.hard"),
    descriptionLabel: t("tasks.descriptionLabel"),
    descriptionPlaceholder: t("tasks.descriptionPlaceholder"),
    rewardLabel: t("tasks.rewardLabel"),
    resetBtn: t("tasks.resetBtn"),
    saveBtn: t("tasks.saveBtn"),
    saving: t("tasks.saving"),
  };

  const taskListLabels = {
    listTitle: t("tasks.listTitle"),
    listDescription: t("tasks.listDescription"),
    taskCount: t("tasks.taskCount"),
    loadingTasks: t("tasks.loadingTasks"),
    noTasks: t("tasks.noTasks"),
    rewardLabel: t("tasks.rewardLabel"),
    showTask: t("tasks.showTask"),
    hideTask: t("tasks.hideTask"),
  };

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
                {t("tasks.headline")}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                {t("tasks.subtitle")}
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase">
              {t("tasks.panelTag")}
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {t("tasks.panelDescription")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.95fr]">
        <TaskForm
          form={form}
          setForm={setForm}
          error={error}
          saving={saving}
          onSubmit={handleCreate}
          onReset={() =>
            setForm({
              title: "",
              description: "",
              coins: 10,
              difficulty: TaskDifficulty.EASY,
            })
          }
          labels={taskFormLabels}
        />
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggleVisibility={toggleVisibility}
          labels={taskListLabels}
        />
      </div>
    </div>
  );
}
