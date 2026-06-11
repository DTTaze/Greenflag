import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

import QRscanner from "../QRscanner";

export default function QrTaskSubmissionModal({
  isOpen,
  onClose,
  task,
  handleTaskCompletion,
  userID,
}) {
  const [scannedQRCodes, setScannedQRCodes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !task) return null;

  const handleScan = (data) => {
    if (data && !scannedQRCodes.includes(data)) {
      setScannedQRCodes((prev) => [...prev, data]);
      toast.success("🎉 Đã quét mã QR thành công!", {
        position: "top-right",
        autoClose: 2500,
        style: {
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "13px",
        },
      });
    } else if (data) {
      toast.info("ℹ️ Mã QR này đã được quét trước đó!", {
        position: "top-right",
        autoClose: 2000,
        style: {
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "13px",
        },
      });
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const handleSubmit = async () => {
    if (scannedQRCodes.length === 0) {
      toast.warning("Vui lòng quét ít nhất một mã QR");
      return;
    }

    setIsSubmitting(true);
    try {
      const prevProgress = task.progress_count || 0;
      const numOfProgress = Math.min(
        scannedQRCodes.length,
        task.total - prevProgress,
      );
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
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
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
            Quét mã QR hoàn thành nhiệm vụ
          </span>
          <h2 className="truncate pr-8 text-xl leading-tight font-bold">
            {task.title}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Details block */}
          <div className="space-y-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/35 p-4 text-sm">
            <div className="border-gray-250/30 dark:border-zinc-800 flex justify-between border-b pb-2">
              <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
                Tiền thưởng:
              </span>
              <span className="flex items-center gap-1 font-extrabold text-amber-600 dark:text-amber-400">
                +{task.coins} <span className="text-xs">🪙</span>
              </span>
            </div>
            <div className="border-gray-250/30 dark:border-zinc-800 flex justify-between border-b pb-2">
              <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
                Tiến độ cần đạt:
              </span>
              <span className="font-bold text-gray-700 dark:text-zinc-300">{task.total} lần</span>
            </div>
            <div>
              <span className="mb-1 block text-xs font-semibold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
                Mô tả chi tiết:
              </span>
              <p className="text-gray-650 dark:text-zinc-300 leading-relaxed">
                {task.description || "Nhiệm vụ chưa có mô tả chi tiết."}
              </p>
            </div>
          </div>

          {/* QR Scanner Frame */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold tracking-wider text-gray-400 dark:text-zinc-500 uppercase">
              Khung quét mã QR:
            </label>
            <div className="bg-gray-50/40 dark:bg-zinc-950/10 flex flex-col items-center justify-center rounded-2xl border border-gray-100 dark:border-zinc-800 p-4">
              <QRscanner
                onScan={handleScan}
                onError={handleError}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Selected files feedback */}
            {scannedQRCodes.length > 0 && (
              <div className="space-y-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/20 p-4.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B6E4F] dark:text-emerald-450">
                  <span>
                    ✅ Đã quét {scannedQRCodes.length} mã QR thành công.
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800/80 dark:text-emerald-350">
                  Tiến độ dự kiến sẽ tăng thêm:{" "}
                  <strong className="text-xs text-[#0B6E4F] dark:text-emerald-400">
                    +
                    {Math.min(
                      scannedQRCodes.length,
                      task.total - (task.progress_count || 0),
                    )}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 p-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-zinc-350 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 active:scale-95"
          >
            Hủy
          </button>
          <button
            disabled={scannedQRCodes.length === 0 || isSubmitting}
            onClick={handleSubmit}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận hoàn thành"}
          </button>
        </div>
      </div>
    </div>
  );
}
