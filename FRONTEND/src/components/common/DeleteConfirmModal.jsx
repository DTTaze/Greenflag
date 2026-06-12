import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay with blur */}
      <div
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-2xl transition-all dark:border-zinc-800/80 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex-shrink-0 rounded-2xl bg-rose-50 dark:bg-rose-950/30 p-3.5 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {title || "Xác nhận xóa"}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
              {message ||
                "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3.5 mt-6 pt-2 border-t border-slate-100 dark:border-zinc-800/50">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/10 transition-all hover:bg-red-500 active:scale-95"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmModal;
