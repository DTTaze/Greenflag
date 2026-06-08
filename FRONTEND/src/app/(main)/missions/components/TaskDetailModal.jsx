import { X } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

import { acceptTaskByIdApi } from "@/src/utils/api";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onTaskAccepted,
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;
  console.log("total of task", task.total);

  const handleAcceptTask = async () => {
    setIsSubmitting(true);
    try {
      const response = await acceptTaskByIdApi(task.id);
      if (response.success) {
        toast.success("Đã tham gia nhiệm vụ thành công!");
        onTaskAccepted(task);
        onClose();
        // Reload the page after successful task acceptance
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-green-200 bg-green-50 p-6 shadow-2xl sm:max-w-xl md:max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-800 sm:text-3xl">
            Thông tin nhiệm vụ
          </h2>
          <button
            onClick={onClose}
            className="text-green-700 hover:text-green-900"
          >
            <X className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        </div>

        {/* Task details */}
        <div className="space-y-4 text-[1.1rem] text-green-700 sm:text-lg">
          <div>
            <strong className="mb-1 block">Nhiệm vụ:</strong>
            <p className="pl-4">{task.title}</p>
          </div>
          <div>
            <strong className="mb-1 block">Mô tả:</strong>
            <p className="pl-4">{task.description}</p>
          </div>
          <div>
            <strong className="mb-1 block">Tiền thưởng:</strong>
            <p className="pl-4">
              {task.coins} <span className="inline-block">🪙</span>
            </p>
          </div>
          <div>
            <strong className="mb-1 block">Độ khó:</strong>
            <p className="pl-4">{task.difficulty}</p>
          </div>
          <div>
            <strong className="mb-1 block">Tiến độ cần đạt:</strong>
            <p className="pl-4">{task.total} lần</p>
          </div>
        </div>

        {/* Confirm button */}
        <div className="mt-8 flex justify-end">
          <button
            className="rounded-full bg-green-600 px-6 py-3 text-base font-semibold text-white transition duration-200 hover:bg-green-700 disabled:opacity-50 sm:text-lg"
            onClick={handleAcceptTask}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận tham gia"}
          </button>
        </div>
      </div>
    </div>
  );
}
