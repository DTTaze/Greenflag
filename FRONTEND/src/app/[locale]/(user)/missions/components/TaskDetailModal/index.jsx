import { Award, ShieldAlert, X } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

import { useAcceptTaskMutation } from "@/src/queries/task/useTaskQueries";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onTaskAccepted,
}) {
  const acceptTaskMutation = useAcceptTaskMutation();
  const isSubmitting = acceptTaskMutation.isPending;

  if (!isOpen || !task) return null;

  const handleAcceptTask = async () => {
    try {
      await acceptTaskMutation.mutateAsync(task.id);
      toast.success("🎉 Bạn đã tham gia nhiệm vụ thành công!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        style: {
          background: "#10B981",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
      if (onTaskAccepted) onTaskAccepted(task);
      onClose();
    } catch (error) {
      console.error("Error accepting task:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi tham gia nhiệm vụ");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {/* Header with Background Pattern */}
        <div className="relative shrink-0 bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] p-6 text-white">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="text-emerald-250 mb-1 inline-block text-[10px] font-bold tracking-wider uppercase">
            Thông tin chi tiết nhiệm vụ
          </span>
          <h2 className="truncate pr-8 text-xl leading-tight font-bold">
            {task.title}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Main info cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center rounded-xl border border-amber-100 bg-amber-50/35 p-4 text-center">
              <Award className="mb-1.5 h-6 w-6 text-amber-600" />
              <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                Phần thưởng
              </span>
              <span className="mt-0.5 text-base font-black text-amber-700">
                +{task.coins} Xu
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/25 p-4 text-center">
              <ShieldAlert className="mb-1.5 h-6 w-6 text-[#0B6E4F]" />
              <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                Độ khó
              </span>
              <span className="mt-1 text-sm font-extrabold tracking-wide text-[#0B6E4F] uppercase">
                {task.difficulty === "easy"
                  ? "Dễ"
                  : task.difficulty === "medium"
                    ? "Trung bình"
                    : "Khó"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Description */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                Mô tả thử thách
              </span>
              <p className="text-gray-650 text-sm leading-relaxed">
                {task.description || "Nhiệm vụ chưa có mô tả chi tiết."}
              </p>
            </div>

            {/* Target */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                Yêu cầu tiến độ
              </span>
              <p className="text-gray-750 text-sm font-semibold">
                Cần tích lũy đủ:{" "}
                <strong className="text-sm font-extrabold text-emerald-700">
                  {task.total} lần
                </strong>{" "}
                thực hiện
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
          >
            Đóng
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleAcceptTask}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận tham gia"}
          </button>
        </div>
      </div>
    </div>
  );
}
