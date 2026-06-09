import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

import QRscanner from "./QRscanner";

export default function QrTaskSubmissionModal({
  isOpen,
  onClose,
  task,
  handleTaskCompletion,
  userID,
}) {
  const [scannedQRCodes, setScannedQRCodes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleScan = (data) => {
    if (data && !scannedQRCodes.includes(data)) {
      setScannedQRCodes((prev) => [...prev, data]);
      toast.success("Đã quét mã QR thành công!");
    } else if (data) {
      toast.info("Mã QR này đã được quét trước đó!");
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
    toast.error("Có lỗi xảy ra khi quét mã QR");
  };

  const handleSubmit = async () => {
    if (scannedQRCodes.length === 0) {
      toast.warning("Vui lòng quét ít nhất một mã QR");
      return;
    }

    setIsSubmitting(true);
    try {
      // Tăng tiến độ theo số mã QR đã quét, không vượt quá task.total
      const prevProgress = task.progress_count || 0;
      const numOfProgress = Math.min(
        scannedQRCodes.length,
        task.total - prevProgress,
      );
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
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-green-200 bg-green-50 p-6 shadow-2xl sm:max-w-xl md:max-w-2xl">
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

        {/* QR Scanner */}
        <div className="mt-6">
          <label className="mb-3 block text-base font-medium text-green-800">
            Quét mã QR:
          </label>
          <div className="h-full w-full overflow-hidden rounded-xl border border-green-300 bg-white">
            <QRscanner
              onScan={handleScan}
              onError={handleError}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Info về mã đã quét */}
          {scannedQRCodes.length > 0 && (
            <div className="mt-3 space-y-1 text-sm text-green-600 sm:text-base">
              <p>✅ Đã quét {scannedQRCodes.length} mã QR.</p>
              <p>
                Tiến độ tăng thêm:{" "}
                <strong>
                  {Math.min(scannedQRCodes.length, task.total)}/{task.total}
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
            disabled={scannedQRCodes.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
