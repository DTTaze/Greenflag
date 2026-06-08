import React from "react";
import { X } from "lucide-react";
import { acceptTaskByIdApi } from "@/src/utils/api.js";
import { toast } from "react-toastify";

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  userID,
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
    <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-green-50 p-6 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl border border-green-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
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
        <div className="space-y-4 text-[1.1rem] sm:text-lg text-green-700">
          <div>
            <strong className="block mb-1">Nhiệm vụ:</strong>
            <p className="pl-4">{task.title}</p>
          </div>
          <div>
            <strong className="block mb-1">Mô tả:</strong>
            <p className="pl-4">{task.description}</p>
          </div>
          <div>
            <strong className="block mb-1">Tiền thưởng:</strong>
            <p className="pl-4">
              {task.coins} <span className="inline-block">🪙</span>
            </p>
          </div>
          <div>
            <strong className="block mb-1">Độ khó:</strong>
            <p className="pl-4">{task.difficulty}</p>
          </div>
          <div>
            <strong className="block mb-1">Tiến độ cần đạt:</strong>
            <p className="pl-4">{task.total} lần</p>
          </div>
        </div>

        {/* Confirm button */}
        <div className="flex justify-end mt-8">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
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
