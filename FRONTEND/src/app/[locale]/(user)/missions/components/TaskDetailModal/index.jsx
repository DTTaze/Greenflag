import { Award, ShieldAlert, X } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

import { acceptTask } from "@/src/utils/api";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onTaskAccepted,
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen || !task) return null;

  const handleAcceptTask = async () => {
    setIsSubmitting(true);
    try {
      const response = await acceptTask(task.id);
      if (response.success) {
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
        onTaskAccepted(task);
        onClose();
      } else {
        throw new Error("Không thể tham gia nhiệm vụ");
      }
    } catch (error) {
      console.error("Error accepting task:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi tham gia nhiệm vụ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header with Background Pattern */}
        <div className="relative bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] p-6 text-white shrink-0">
          <div className="absolute right-0 top-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-250">
            Thông tin chi tiết nhiệm vụ
          </span>
          <h2 className="text-xl font-bold leading-tight truncate pr-8">
            {task.title}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main info cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-100 bg-amber-50/35 p-4 flex flex-col items-center justify-center text-center">
              <Award className="h-6 w-6 text-amber-600 mb-1.5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Phần thưởng
              </span>
              <span className="text-base font-black text-amber-700 mt-0.5">
                +{task.coins} Xu
              </span>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/25 p-4 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="h-6 w-6 text-[#0B6E4F] mb-1.5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Độ khó
              </span>
              <span className="text-sm font-extrabold text-[#0B6E4F] uppercase tracking-wide mt-1">
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
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Mô tả thử thách
              </span>
              <p className="text-sm leading-relaxed text-gray-650">
                {task.description || "Nhiệm vụ chưa có mô tả chi tiết."}
              </p>
            </div>

            {/* Target */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Yêu cầu tiến độ
              </span>
              <p className="text-sm font-semibold text-gray-750">
                Cần tích lũy đủ: <strong className="text-emerald-700 text-sm font-extrabold">{task.total} lần</strong> thực hiện
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Đóng
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleAcceptTask}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận tham gia"}
          </button>
        </div>
      </div>
    </div>
  );
}
