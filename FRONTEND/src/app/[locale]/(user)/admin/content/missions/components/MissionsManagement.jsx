"use client";

import {
  Check,
  ClipboardCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";

import {
  useAdminCreateTaskMutation,
  useAdminDeleteTaskMutation,
  useAdminHandleDecisionMutation,
  useAdminTaskSubmissionsQuery,
  useAdminTasksQuery,
  useAdminUpdateTaskMutation,
} from "@/src/queries/task/useTaskQueries";
import { TaskSubmitStatus } from "@/src/types/task/task.type";

import DataTable from "../../../components/DataTable";
import { taskColumns } from "../../../components/HeaderColumn";
import TaskForm from "./TaskForm";

const SUBMISSION_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: TaskSubmitStatus.PENDING, label: "Chờ duyệt" },
  { id: TaskSubmitStatus.APPROVED, label: "Đã duyệt" },
  { id: TaskSubmitStatus.REJECTED, label: "Từ chối" },
];

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

const getSubmissionStatusLabel = (status) => {
  switch (status) {
    case TaskSubmitStatus.APPROVED:
      return "Đã duyệt";
    case TaskSubmitStatus.REJECTED:
      return "Từ chối";
    default:
      return "Chờ duyệt";
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

export default function TasksManagement() {
  const [showDeleted, setShowDeleted] = useState(false);
  const { data: tasks = [], isLoading: loading } = useAdminTasksQuery(showDeleted);
  const {
    data: submissions = [],
    isLoading: submissionsLoading,
    refetch: refetchSubmissions,
  } = useAdminTaskSubmissionsQuery("all");
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
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
        alert("Xóa nhiệm vụ thành công!");
      } catch (e) {
        console.error(e);
        alert(e.message || "Xóa nhiệm vụ thất bại!");
      }
    }
  };

  const handleBulkDeleteTasks = async (ids) => {
    try {
      const results = await Promise.allSettled(
        ids.map((id) => deleteTaskMutation.mutateAsync(id)),
      );

      const successful = results.filter((r) => r.status === "fulfilled");
      const failed = results.filter((r) => r.status === "rejected");

      if (failed.length === 0) {
        alert(`Đã xóa thành công ${successful.length} nhiệm vụ.`);
      } else {
        const sampleError =
          failed[0].reason?.response?.data?.message ||
          failed[0].reason?.message ||
          "Dữ liệu đang được sử dụng hoặc bị ràng buộc khóa ngoại";
        alert(
          `Xóa thành công ${successful.length}/${ids.length} nhiệm vụ. Thất bại ${failed.length} nhiệm vụ (${sampleError}).`,
        );
      }
    } catch (e) {
      console.log(e);
      alert("Đã xảy ra lỗi hệ thống khi thực hiện xóa hàng loạt.");
    }
  };

  const handleSubmitTask = async (data, mode) => {
    const payload = {
      title: data.title,
      description: data.description,
      coins: data.coins ? Number(data.coins) : 0,
      difficulty: data.difficulty,
      total: data.total ? Number(data.total) : undefined,
    };

    if (mode === "add") {
      try {
        await createTaskMutation.mutateAsync(payload);
        alert("Thêm nhiệm vụ thành công!");
      } catch (e) {
        alert(e.message || "Thêm nhiệm vụ thất bại!");
      }
    } else if (mode === "edit") {
      try {
        await updateTaskMutation.mutateAsync({ id: data.id, payload });
        alert("Cập nhật nhiệm vụ thành công!");
      } catch (e) {
        alert(e.message || "Cập nhật nhiệm vụ thất bại!");
      }
    }
    setFormOpen(false);
  };

  const handleDecision = async (submission, decision) => {
    if (!submission?.id) return;

    if (
      decision === TaskSubmitStatus.REJECTED &&
      !window.confirm("Bạn có chắc chắn muốn từ chối submission này không?")
    ) {
      return;
    }

    try {
      await decisionMutation.mutateAsync({
        id: submission.id,
        payload: { decision },
      });

      if (decision === TaskSubmitStatus.APPROVED) {
        alert("Đã duyệt submission thành công.");
      } else {
        alert("Đã từ chối submission.");
      }

      setSelectedSubmission(null);
      refetchSubmissions();
    } catch (error) {
      console.error(error);
      alert(error.message || "Xử lý submission thất bại.");
    }
  };

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Tasks"
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

      <div className="overflow-hidden rounded-xl border border-emerald-200/60 bg-white shadow-sm dark:border-emerald-500/15 dark:bg-zinc-950">
        <div className="flex flex-col gap-4 border-b border-emerald-100 p-6 dark:border-emerald-500/10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-zinc-100">
              <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
              Kiểm duyệt submission nhiệm vụ
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
              Duyệt minh chứng do người dùng gửi sau khi thực hiện nhiệm vụ.
            </p>
          </div>
          <button
            onClick={() => refetchSubmissions()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <RefreshCw size={14} />
            Làm mới
          </button>
        </div>

        <div className="grid gap-4 border-b border-emerald-100 bg-emerald-50/30 p-6 sm:grid-cols-2 xl:grid-cols-4 dark:border-emerald-500/10 dark:bg-emerald-950/10">
          <div className="rounded-xl border border-amber-200/70 bg-white p-4 dark:border-amber-500/15 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
              Chờ duyệt
            </p>
            <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
              {summary.pending}
            </p>
          </div>
          <div className="rounded-xl border border-green-200/70 bg-white p-4 dark:border-green-500/15 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
              Đã duyệt
            </p>
            <p className="mt-2 text-2xl font-black text-green-600 dark:text-green-400">
              {summary.approved}
            </p>
          </div>
          <div className="rounded-xl border border-red-200/70 bg-white p-4 dark:border-red-500/15 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
              Từ chối
            </p>
            <p className="mt-2 text-2xl font-black text-red-600 dark:text-red-400">
              {summary.rejected}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
              Tổng submission
            </p>
            <p className="mt-2 text-2xl font-black text-slate-700 dark:text-zinc-100">
              {summary.total}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 xl:flex-row">
          <div className={`space-y-4 ${selectedSubmission ? "xl:w-3/5" : "w-full"}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {SUBMISSION_FILTERS.map((filter) => (
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
                  placeholder="Tìm theo user, nhiệm vụ, mô tả..."
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
                        Người dùng
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                        Nhiệm vụ
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                        Thời gian gửi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {submissionsLoading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500 dark:text-zinc-400">
                          Đang tải submissions...
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
                              <div className="font-semibold text-gray-900 dark:text-zinc-100">
                                {fullName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-zinc-400">
                                @{submission.task_user?.user?.username || "unknown"}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-gray-900 dark:text-zinc-100">
                                {submission.task_user?.task?.title || "Nhiệm vụ"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-zinc-400">
                                {submission.task_user?.task?.difficulty || "--"} •{" "}
                                {submission.task_user?.task?.coins || 0} xu
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
                        <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500 dark:text-zinc-400">
                          Không có submission phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedSubmission && (
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:w-2/5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                    Chi tiết submission
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                    Người dùng
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
                    Nhiệm vụ
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
                      Tiến độ
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-zinc-100">
                      {selectedSubmission.task_user?.progress_count || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                      Gửi lúc
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
                    Mô tả minh chứng
                  </p>
                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    {selectedSubmission.description || "Không có mô tả."}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
                    Ảnh minh chứng
                  </p>
                  {Array.isArray(selectedSubmission.images) &&
                  selectedSubmission.images.length > 0 ? (
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {selectedSubmission.images.map((imageUrl, index) => (
                        <a
                          key={`${selectedSubmission.id}-${index}`}
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <img
                            src={imageUrl}
                            alt={`evidence-${index + 1}`}
                            className="h-28 w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                      Không có ảnh minh chứng.
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
                      Duyệt
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
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
                    Submission này đã được xử lý.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitTask}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}
