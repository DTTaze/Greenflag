/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

export default function TaskSubmissionModal({
  isOpen,
  onClose,
  task,
  handleTaskCompletion,
  userID,
}) {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.warning("Vui lòng tải lên ít nhất một file");
      return;
    }

    setIsSubmitting(true);
    try {
      // Then handle task completion with the number of files
      const prevProgress = task.progress_count || 0;
      const numOfProgress = Math.min(files.length, task.total - prevProgress);
      await handleTaskCompletion(userID, task.id, numOfProgress);
      toast.success("Nhiệm vụ đã được cập nhật!");
      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi xử lý nhiệm vụ");
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

        {/* Nhiệm vụ chi tiết */}
        <div className="space-y-2 text-[1.1rem] text-green-700 sm:text-lg">
          <p>
            <strong>Nhiệm vụ:</strong> {task.title}
          </p>
          <p>
            <strong>Mô tả:</strong> {task.description}
          </p>
          <p>
            <strong>Tiền thưởng:</strong> {task.coins}{" "}
            <span className="inline-block">🪙</span>
          </p>
          <p>
            <strong>Tiến độ tối đa:</strong> {task.total}
          </p>
        </div>

        {/* Upload ảnh */}
        <div className="mt-6">
          <label className="mb-3 block text-base font-medium text-green-800">
            Tải lên bằng chứng (ảnh):
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full cursor-pointer rounded-xl border border-green-300 bg-white px-4 py-2 text-base text-green-700 transition file:mr-4 file:rounded-full file:border-0 file:bg-green-100 file:px-5 file:py-2 file:text-green-700 hover:file:bg-green-200"
          />

          {/* Info về file đã chọn */}
          {files.length > 0 && (
            <div className="mt-3 space-y-1 text-sm text-green-600 sm:text-base">
              <p>📸 Đã chọn {files.length} ảnh.</p>
              <p>
                Tiến độ tăng thêm:{" "}
                <strong>
                  {Math.min(files.length, task.total)}/{task.total}
                </strong>
              </p>
            </div>
          )}
        </div>

        {/* Nút xác nhận */}
        <div className="mt-8 flex justify-end">
          <button
            className="rounded-full bg-green-600 px-6 py-3 text-base font-semibold text-white transition duration-200 hover:bg-green-700 disabled:opacity-50 sm:text-lg"
            onClick={handleSubmit}
            disabled={files.length === 0}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
