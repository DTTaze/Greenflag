import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-opacity-30 absolute inset-0 bg-black"
        onClick={onClose}
      ></div>
      <div className="relative z-10 mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-shrink-0 rounded-full bg-red-100 p-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {title || "Xác nhận xóa"}
          </h3>
        </div>

        <p className="mb-6 text-gray-600">
          {message ||
            "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác."}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
