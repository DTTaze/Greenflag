import { UploadCloud, X } from "lucide-react";
import React, { useState } from "react";
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

  if (!isOpen || !task) return null;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.warning("Vui lòng tải lên ít nhất một file minh chứng");
      return;
    }

    setIsSubmitting(true);
    try {
      const prevProgress = task.progress_count || 0;
      const numOfProgress = Math.min(files.length, task.total - prevProgress);
      await handleTaskCompletion(userID, task.id, numOfProgress);
      toast.success("Nhiệm vụ đã được cập nhật thành công!");
      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi xử lý nhiệm vụ");
    } finally {
      setIsSubmitting(false);
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
            Nộp minh chứng nhiệm vụ
          </span>
          <h2 className="truncate pr-8 text-xl leading-tight font-bold">
            {task.title}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Details block */}
          <div className="space-y-3.5 rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-sm">
            <div className="border-gray-250/30 flex justify-between border-b pb-2">
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Tiền thưởng:
              </span>
              <span className="flex items-center gap-1 font-extrabold text-amber-600">
                +{task.coins} <span className="text-xs">🪙</span>
              </span>
            </div>
            <div className="border-gray-250/30 flex justify-between border-b pb-2">
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Tiến độ cần đạt:
              </span>
              <span className="font-bold text-gray-700">{task.total} lần</span>
            </div>
            <div>
              <span className="mb-1 block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Mô tả chi tiết:
              </span>
              <p className="text-gray-650 leading-relaxed">
                {task.description || "Nhiệm vụ chưa có mô tả chi tiết."}
              </p>
            </div>
          </div>

          {/* Upload section */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold tracking-wider text-gray-400 uppercase">
              Tải lên bằng chứng (ảnh):
            </label>
            <div className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/20 p-6 transition-colors hover:bg-gray-50/80">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#0B6E4F] transition-transform duration-300 group-hover:scale-105">
                <UploadCloud className="h-5.5 w-5.5" />
              </div>
              <span className="text-xs font-bold text-gray-600">
                Nhấp hoặc kéo thả ảnh vào đây
              </span>
              <span className="text-[10px] font-semibold text-gray-400">
                Hỗ trợ định dạng JPG, PNG, WEBP
              </span>
            </div>

            {/* Selected files feedback */}
            {files.length > 0 && (
              <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/30 p-4.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B6E4F]">
                  <span>📸 Đã chọn {files.length} ảnh.</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800/80">
                  Tiến độ dự kiến sẽ tăng thêm:{" "}
                  <strong className="text-xs text-[#0B6E4F]">
                    +
                    {Math.min(
                      files.length,
                      task.total - (task.progress_count || 0),
                    )}
                  </strong>
                </div>
                {/* List names of files */}
                <div className="max-h-[80px] space-y-1 overflow-y-auto border-t border-emerald-100/30 pt-1">
                  {files.map((file, i) => (
                    <div key={i} className="truncate text-[10px] text-gray-500">
                      {i + 1}. {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
          >
            Hủy
          </button>
          <button
            disabled={files.length === 0 || isSubmitting}
            onClick={handleSubmit}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Đang gửi..." : "Xác nhận nộp bài"}
          </button>
        </div>
      </div>
    </div>
  );
}
