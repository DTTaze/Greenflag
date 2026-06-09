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
            Quét mã QR hoàn thành nhiệm vụ
          </span>
          <h2 className="text-xl font-bold leading-tight truncate pr-8">
            {task.title}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Details block */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3.5 text-sm">
            <div className="flex justify-between border-b border-gray-250/30 pb-2">
              <span className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Tiền thưởng:</span>
              <span className="font-extrabold text-amber-600 flex items-center gap-1">
                +{task.coins} <span className="text-xs">🪙</span>
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-250/30 pb-2">
              <span className="font-semibold text-gray-400 text-xs uppercase tracking-wider">Tiến độ cần đạt:</span>
              <span className="font-bold text-gray-700">{task.total} lần</span>
            </div>
            <div>
              <span className="block font-semibold text-gray-400 text-xs uppercase tracking-wider mb-1">Mô tả chi tiết:</span>
              <p className="text-gray-650 leading-relaxed">{task.description || "Nhiệm vụ chưa có mô tả chi tiết."}</p>
            </div>
          </div>

          {/* QR Scanner Frame */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Khung quét mã QR:
            </label>
            <div className="rounded-2xl border border-gray-100 bg-gray-55/40 p-4 flex flex-col items-center justify-center">
              <QRscanner
                onScan={handleScan}
                onError={handleError}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Selected files feedback */}
            {scannedQRCodes.length > 0 && (
              <div className="rounded-xl bg-emerald-50/30 border border-emerald-100 p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B6E4F]">
                  <span>✅ Đã quét {scannedQRCodes.length} mã QR thành công.</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800/80">
                  Tiến độ dự kiến sẽ tăng thêm:{" "}
                  <strong className="text-xs text-[#0B6E4F]">
                    +{Math.min(scannedQRCodes.length, task.total - (task.progress_count || 0))}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Hủy
          </button>
          <button
            disabled={scannedQRCodes.length === 0 || isSubmitting}
            onClick={handleSubmit}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận hoàn thành"}
          </button>
        </div>
      </div>
    </div>
  );
}
