"use client";

import {
  Check,
  ClipboardCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  useAdminCreateTaskMutation,
  useAdminDeleteTaskMutation,
  useAdminHandleDecisionMutation,
  useAdminPendingTaskSubmissionsCountQuery,
  useAdminTaskSubmissionsQuery,
  useAdminTasksQuery,
  useAdminUpdateTaskMutation,
} from "@/src/queries/task/useTaskQueries";
import { TaskSubmitStatus } from "@/src/types/task/task.type";

import DataTable from "../../../components/DataTable";
import { taskColumns } from "../../../components/HeaderColumn";
import TaskForm from "./TaskForm";

const getSubmissionStatusClasses = (status) => {
  switch (status) {
    case TaskSubmitStatus.APPROVED:
      return "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400";
    case TaskSubmitStatus.REJECTED:
      return "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400";
    default:
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
  }
};

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getAvatarBgColor = (name) => {
  if (!name) return "bg-emerald-500 text-white";
  const colors = [
    "bg-red-500 text-white",
    "bg-orange-500 text-white",
    "bg-amber-500 text-white",
    "bg-emerald-500 text-white",
    "bg-teal-500 text-white",
    "bg-blue-500 text-white",
    "bg-sky-500 text-white",
    "bg-slate-500 text-white",
    "bg-zinc-500 text-white",
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length];
};

function TasksManagementContent() {
  const t = useTranslations("admin.tasks");
  const tCommon = useTranslations("admin.common");
  const tSidebar = useTranslations("admin.sidebar");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state synchronization for active tab (deep linking support)
  const activeTab = searchParams.get("tab") === "submissions" ? "submissions" : "tasks";

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const [showDeleted, setShowDeleted] = useState(false);
  
  // Queries
  const { data: tasks = [], isLoading: loading } = useAdminTasksQuery(showDeleted);
  
  // Submissions lists query (with lazy fetching enabled only on submissions tab)
  const {
    data: submissions = [],
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useAdminTaskSubmissionsQuery("all", {
    enabled: activeTab === "submissions",
  });

  // Lightweight pending count query for the badge (polls every 30 seconds)
  const {
    data: pendingCount = 0,
    refetch: refetchPendingCount,
  } = useAdminPendingTaskSubmissionsCountQuery({
    refetchInterval: 30000,
  });

  const createTaskMutation = useAdminCreateTaskMutation();
  const updateTaskMutation = useAdminUpdateTaskMutation();
  const deleteTaskMutation = useAdminDeleteTaskMutation();
  const decisionMutation = useAdminHandleDecisionMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [submissionFilter, setSubmissionFilter] = useState(TaskSubmitStatus.PENDING);
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Lightbox & Confirm Modal States
  const [lightboxImage, setLightboxImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "",
    cancelText: "",
    type: "danger",
  });

  // Esc Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (lightboxImage) {
          setLightboxImage(null);
          setZoomLevel(1);
        } else if (confirmModal.isOpen) {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage, confirmModal.isOpen]);

  const showConfirm = ({ title, message, type = "danger", confirmText, cancelText, onConfirm }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      confirmText: confirmText || tCommon("confirm"),
      cancelText: cancelText || tCommon("cancel"),
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const getSubmissionStatusLabel = (status) => {
    switch (status) {
      case TaskSubmitStatus.APPROVED:
        return t("statusApproved");
      case TaskSubmitStatus.REJECTED:
        return t("statusRejected");
      default:
        return t("statusPending");
    }
  };

  const submissionFilters = useMemo(() => [
    { id: "all", label: t("filterAll") },
    { id: TaskSubmitStatus.PENDING, label: t("statusPending") },
    { id: TaskSubmitStatus.APPROVED, label: t("statusApproved") },
    { id: TaskSubmitStatus.REJECTED, label: t("statusRejected") },
  ], [t]);

  const coinSuffix = useMemo(() => {
    return t("colUser") === "Người dùng" ? "xu" : "coins";
  }, [t]);

  const filteredSubmissions = useMemo(() => {
    const keyword = submissionSearch.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesFilter =
        submissionFilter === "all" || submission.status === submissionFilter;

      if (!matchesFilter) return false;
      if (!keyword) return true;

      const fullName = submission.task_user?.user?.profile?.fullName || "";
      const username = submission.task_user?.user?.username || "";
      const email = submission.task_user?.user?.email || "";
      const taskTitle = submission.task_user?.task?.title || "";
      const description = submission.description || "";

      return [fullName, username, email, taskTitle, description].some((value) =>
        value.toLowerCase().includes(keyword),
      );
    });
  }, [submissionFilter, submissionSearch, submissions]);

  const summary = useMemo(() => {
    return submissions.reduce(
      (acc, submission) => {
        acc.total += 1;
        if (submission.status === TaskSubmitStatus.PENDING) acc.pending += 1;
        if (submission.status === TaskSubmitStatus.APPROVED) acc.approved += 1;
        if (submission.status === TaskSubmitStatus.REJECTED) acc.rejected += 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 },
    );
  }, [submissions]);

  const handleAddTask = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setFormMode("edit");
    setEditData(task);
    setFormOpen(true);
  };

  const handleDeleteTask = async (task) => {
    showConfirm({
      title: tCommon("delete"),
      message: tCommon("confirmBulkDelete").replace("{count}", "1"),
      type: "danger",
      confirmText: tCommon("delete"),
      onConfirm: async () => {
        try {
          await deleteTaskMutation.mutateAsync(task.id);
          toast.success("Xóa nhiệm vụ thành công!");
        } catch (e) {
          console.error(e);
          toast.error(e.message || "Xóa nhiệm vụ thất bại!");
        }
      },
    });
  };

  const handleBulkDeleteTasks = async (ids) => {
    showConfirm({
      title: tCommon("deleteSelected"),
      message: tCommon("confirmBulkDelete").replace("{count}", ids.length.toString()),
      type: "danger",
      confirmText: tCommon("delete"),
      onConfirm: async () => {
        try {
          const results = await Promise.allSettled(
            ids.map((id) => deleteTaskMutation.mutateAsync(id)),
          );

          const successful = results.filter((r) => r.status === "fulfilled");
          const failed = results.filter((r) => r.status === "rejected");

          if (failed.length === 0) {
            toast.success(`Đã xóa thành công ${successful.length} nhiệm vụ.`);
          } else {
            const sampleError =
              failed[0].reason?.response?.data?.message ||
              failed[0].reason?.message ||
              "Dữ liệu đang được sử dụng hoặc bị ràng buộc khóa ngoại";
            toast.warning(
              `Xóa thành công ${successful.length}/${ids.length} nhiệm vụ. Thất bại ${failed.length} nhiệm vụ (${sampleError}).`,
            );
          }
        } catch (e) {
          console.error(e);
          toast.error("Đã xảy ra lỗi hệ thống khi thực hiện xóa hàng loạt.");
        }
      },
    });
  };

  const handleSubmitTask = async (data, mode) => {
    const payload = {
      title: data.title,
      description: data.description,
      coins: data.coins ? Number(data.coins) : 0,
      difficulty: data.difficulty,
      total: data.total ? Number(data.total) : undefined,
      type: data.type,
    };

    if (mode === "add") {
      try {
        await createTaskMutation.mutateAsync(payload);
        toast.success("Thêm nhiệm vụ thành công!");
      } catch (e) {
        toast.error(e.message || "Thêm nhiệm vụ thất bại!");
      }
    } else if (mode === "edit") {
      try {
        await updateTaskMutation.mutateAsync({ id: data.id, payload });
        toast.success("Cập nhật nhiệm vụ thành công!");
      } catch (e) {
        toast.error(e.message || "Cập nhật nhiệm vụ thất bại!");
      }
    }
    setFormOpen(false);
  };

  const handleDecision = async (submission, decision) => {
    if (!submission?.id) return;

    if (decision === TaskSubmitStatus.REJECTED) {
      showConfirm({
        title: t("confirmReject"),
        message: t("msgConfirmReject"),
        type: "danger",
        confirmText: t("btnReject"),
        onConfirm: async () => {
          try {
            await decisionMutation.mutateAsync({
              id: submission.id,
              payload: { decision },
            });
            toast.success(t("msgRejectSuccess"));
            setSelectedSubmission(null);
            refetchSubmissions();
            refetchPendingCount();
          } catch (error) {
            console.error(error);
            toast.error(error.message || t("msgProcessFailed"));
          }
        },
      });
    } else {
      showConfirm({
        title: t("confirmApprove"),
        message: t("confirmApprove"),
        type: "success",
        confirmText: t("btnApprove"),
        onConfirm: async () => {
          try {
            await decisionMutation.mutateAsync({
              id: submission.id,
              payload: { decision },
            });
            toast.success(t("msgApproveSuccess"));
            setSelectedSubmission(null);
            refetchSubmissions();
            refetchPendingCount();
          } catch (error) {
            console.error(error);
            toast.error(error.message || t("msgProcessFailed"));
          }
        },
      });
    }
  };

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Segmented Control Tabs */}
      <div className="flex justify-center sm:justify-start">
        <div className="inline-flex rounded-xl bg-gray-100/80 p-1 backdrop-blur-md dark:bg-zinc-900/85 border border-gray-200/50 dark:border-zinc-800/60 shadow-inner">
          <button
            onClick={() => handleTabChange("tasks")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "tasks"
                ? "bg-white text-emerald-600 shadow-sm dark:bg-zinc-800 dark:text-emerald-400"
                : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <FileText size={16} />
            Danh sách nhiệm vụ
          </button>
          
          <button
            onClick={() => handleTabChange("submissions")}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "submissions"
                ? "bg-white text-emerald-600 shadow-sm dark:bg-zinc-800 dark:text-emerald-400"
                : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <ShieldCheck size={16} />
            Duyệt bài nộp
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "tasks" ? (
        <DataTable
          title={tSidebar("missions")}
          columns={taskColumns}
          rows={tasks}
          onAdd={handleAddTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onBulkDelete={handleBulkDeleteTasks}
          loading={loading}
          showDeleted={showDeleted}
          onToggleShowDeleted={setShowDeleted}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-emerald-200/60 bg-white shadow-sm dark:border-emerald-500/15 dark:bg-zinc-950 transition-all duration-300 animate-in fade-in">
          <div className="flex flex-col gap-4 border-b border-emerald-100 p-6 dark:border-emerald-500/10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-zinc-100">
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                {t("review")}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                {t("subtitle")}
              </p>
            </div>
            <button
              onClick={() => {
                refetchSubmissions();
                refetchPendingCount();
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RefreshCw size={14} />
              {t("refresh")}
            </button>
          </div>

          {/* Stats Cards Section */}
          <div className="grid gap-4 border-b border-emerald-100 bg-emerald-50/10 p-6 sm:grid-cols-2 xl:grid-cols-4 dark:border-emerald-500/10 dark:bg-zinc-900/20">
            <div className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-5 shadow-sm transition-all duration-350 hover:-translate-y-1 hover:shadow-md dark:border-amber-500/15 dark:from-amber-950/10 dark:to-orange-950/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400/80">
                    {t("statsPending")}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-amber-700 dark:text-amber-400">
                    {summary.pending}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600 transition-colors group-hover:bg-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400">
                  <Clock size={24} className="animate-pulse" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-amber-500/5 transition-all duration-300 group-hover:scale-150" />
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-5 shadow-sm transition-all duration-350 hover:-translate-y-1 hover:shadow-md dark:border-emerald-500/15 dark:from-emerald-950/10 dark:to-teal-950/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400/80">
                    {t("statsApproved")}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
                    {summary.approved}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-500/20 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-emerald-500/5 transition-all duration-300 group-hover:scale-150" />
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50/50 to-rose-50/30 p-5 shadow-sm transition-all duration-350 hover:-translate-y-1 hover:shadow-md dark:border-red-500/15 dark:from-red-950/10 dark:to-rose-950/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400/80">
                    {t("statsRejected")}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-red-700 dark:text-red-400">
                    {summary.rejected}
                  </p>
                </div>
                <div className="rounded-xl bg-red-500/10 p-3 text-red-600 transition-colors group-hover:bg-red-500/20 dark:bg-red-400/10 dark:text-red-400">
                  <XCircle size={24} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-red-500/5 transition-all duration-300 group-hover:scale-150" />
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-zinc-50 p-5 shadow-sm transition-all duration-350 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:from-zinc-900/60 dark:to-zinc-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400/80">
                    {t("statsTotal")}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-800 dark:text-zinc-100">
                    {summary.total}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-500/10 p-3 text-slate-600 transition-colors group-hover:bg-slate-500/20 dark:bg-zinc-800 dark:text-zinc-400">
                  <FileText size={24} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-slate-500/5 transition-all duration-300 group-hover:scale-150" />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-6 p-6 xl:flex-row">
            <div className={`space-y-4 ${selectedSubmission ? "xl:w-3/5" : "w-full"}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {submissionFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSubmissionFilter(filter.id)}
                      className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                        submissionFilter === filter.id
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-900/60">
                      <tr className="border-b border-gray-200 dark:border-zinc-800">
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                          {t("colUser")}
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                          {t("colTask")}
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                          {t("colStatus")}
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                          {t("colSubmittedAt")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {submissionsLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 py-6 text-gray-500 dark:text-zinc-400">
                              <RefreshCw size={24} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                              <span className="text-sm font-semibold">{t("msgLoadingSubmissions")}</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((submission) => {
                          const fullName =
                            submission.task_user?.user?.profile?.fullName ||
                            submission.task_user?.user?.username ||
                            submission.task_user?.user?.email ||
                            "Người dùng";

                          return (
                            <tr
                              key={submission.id}
                              onClick={() => handleSelectSubmission(submission)}
                              className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-zinc-900/60 ${
                                selectedSubmission?.id === submission.id
                                  ? "bg-emerald-50/70 dark:bg-emerald-950/15"
                                  : ""
                              }`}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-sm ${getAvatarBgColor(fullName)}`}>
                                    {getInitials(fullName)}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900 dark:text-zinc-100">
                                      {fullName}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                                      @{submission.task_user?.user?.username || "unknown"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-gray-900 dark:text-zinc-100">
                                  {submission.task_user?.task?.title || "Nhiệm vụ"}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400">
                                  {submission.task_user?.task?.difficulty || "--"} •{" "}
                                  {submission.task_user?.task?.coins || 0} {coinSuffix}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${getSubmissionStatusClasses(submission.status)}`}
                                >
                                  {getSubmissionStatusLabel(submission.status)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500 dark:text-zinc-400">
                                {formatDateTime(submission.submittedAt || submission.createdAt)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-10 text-center">
                            <div className="flex flex-col items-center justify-center gap-3 py-10">
                              <div className="rounded-full bg-emerald-50 p-4 dark:bg-emerald-950/20">
                                <ShieldCheck size={36} className="text-emerald-600/60 dark:text-emerald-400/50" />
                              </div>
                              <h4 className="text-sm font-bold text-gray-800 dark:text-zinc-200">
                                {t("msgNoSubmissions")}
                              </h4>
                              <p className="max-w-xs text-xs text-gray-400 dark:text-zinc-500">
                                {t("noSubmissions")}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {selectedSubmission && (
              <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:w-2/5 dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300 animate-in fade-in slide-in-from-right-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                      {t("detailTitle")}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                      {t("labelUser")}
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-zinc-100">
                      {selectedSubmission.task_user?.user?.profile?.fullName ||
                        selectedSubmission.task_user?.user?.username ||
                        selectedSubmission.task_user?.user?.email ||
                        "Người dùng"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {selectedSubmission.task_user?.user?.email || "--"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                      {t("labelTask")}
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-zinc-100">
                      {selectedSubmission.task_user?.task?.title || "Nhiệm vụ"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {selectedSubmission.task_user?.task?.description || "--"}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                        {t("labelProgress")}
                      </p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-zinc-100">
                        {selectedSubmission.task_user?.progress_count || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                        {t("labelSubmittedAt")}
                      </p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-zinc-100">
                        {formatDateTime(
                          selectedSubmission.submittedAt ||
                            selectedSubmission.createdAt,
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                      {t("labelEvidenceDesc")}
                    </p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                      {selectedSubmission.description || t("noDescription")}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                      {t("labelEvidenceImages")}
                    </p>
                    {Array.isArray(selectedSubmission.images) &&
                    selectedSubmission.images.length > 0 ? (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {selectedSubmission.images.map((imageUrl, index) => (
                          <div
                            key={`${selectedSubmission.id}-${index}`}
                            onClick={() => {
                              setLightboxImage(imageUrl);
                              setZoomLevel(1);
                            }}
                            className="group relative cursor-zoom-in overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                          >
                            <img
                              src={imageUrl}
                              alt={`evidence-${index + 1}`}
                              className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <ZoomIn size={20} className="text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                        {t("noImages")}
                      </p>
                    )}
                  </div>

                  {selectedSubmission.status === TaskSubmitStatus.PENDING ? (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() =>
                          handleDecision(
                            selectedSubmission,
                            TaskSubmitStatus.APPROVED,
                          )
                        }
                        disabled={decisionMutation.isPending}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Check size={16} />
                        {t("btnApprove")}
                      </button>
                      <button
                        onClick={() =>
                          handleDecision(
                            selectedSubmission,
                            TaskSubmitStatus.REJECTED,
                          )
                        }
                        disabled={decisionMutation.isPending}
                        className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X size={16} />
                        {t("btnReject")}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
                      {t("msgProcessed")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitTask}
        initialData={editData}
        mode={formMode}
      />

      {/* Lightbox Component */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
          {/* Lightbox Header */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 3))}
              className="rounded-full bg-zinc-800/80 p-2.5 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              title={t("zoomIn")}
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))}
              className="rounded-full bg-zinc-800/80 p-2.5 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              title={t("zoomOut")}
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={() => {
                setLightboxImage(null);
                setZoomLevel(1);
              }}
              className="rounded-full bg-zinc-800/80 p-2.5 text-zinc-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Lightbox Body / Image */}
          <div 
            className="relative flex h-full w-full items-center justify-center overflow-auto"
            onClick={() => {
              setLightboxImage(null);
              setZoomLevel(1);
            }}
          >
            <img
              src={lightboxImage}
              alt="Lightbox Evidence"
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute bottom-6 text-xs text-zinc-400">
            Bấm nút ESC hoặc nhấp bên ngoài để đóng • Cuộn hoặc bấm nút phóng to
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
          <div 
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all duration-300 scale-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className={`rounded-xl p-3 shrink-0 ${
                confirmModal.type === "success" 
                  ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400" 
                  : confirmModal.type === "warning"
                  ? "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
                  : "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
              }`}>
                {confirmModal.type === "success" ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <AlertTriangle size={24} />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100">
                  {confirmModal.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {confirmModal.cancelText}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors ${
                  confirmModal.type === "success"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : confirmModal.type === "warning"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TasksManagement() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 dark:text-zinc-400">
        <RefreshCw size={24} className="animate-spin text-emerald-600 dark:text-emerald-400" />
      </div>
    }>
      <TasksManagementContent />
    </React.Suspense>
  );
}
