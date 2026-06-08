import React, { useState } from "react";
import { X } from "lucide-react";
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
        task.total - prevProgress
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
    <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-green-50 p-6 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl border border-green-200 max-h-[90vh] overflow-y-auto">
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

        {/* Nhiệm vụ chi tiết */}
        <div className="space-y-2 text-[1.1rem] sm:text-lg text-green-700">
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
          <label className="block text-base font-medium text-green-800 mb-3">
            Quét mã QR:
          </label>
          <div className="w-full h-full bg-white rounded-xl overflow-hidden border border-green-300">
            <QRscanner
              onScan={handleScan}
              onError={handleError}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Info về mã đã quét */}
          {scannedQRCodes.length > 0 && (
            <div className="mt-3 space-y-1 text-green-600 text-sm sm:text-base">
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
        <div className="flex justify-end mt-8">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
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
