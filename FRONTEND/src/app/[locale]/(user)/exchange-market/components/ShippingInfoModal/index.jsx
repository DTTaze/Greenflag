import { AnimatePresence, motion } from "framer-motion";
import { Star, Truck, X } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import { getReceiverInfoByUserId } from "@/src/utils/api";

const ShippingInfoModal = forwardRef(({ isOpen, onClose, onSelect }, ref) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchShippingOptions() {
      if (isOpen && user?.id) {
        try {
          setIsLoading(true);
          const response = await getReceiverInfoByUserId(user.id);
          setShippingOptions(response?.data || []);
        } catch (error) {
          console.error("Error fetching shipping options:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchShippingOptions();
  }, [isOpen, user?.id]);

  const handleSelect = (option) => {
    onSelect(option);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900/95 border border-slate-800/85 shadow-2xl"
          >
            {/* Decorative Glow */}
            <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-600/90 to-teal-600/90 px-6 py-5 border-b border-emerald-500/10 text-white">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-emerald-100 hover:text-white rounded-full p-1 hover:bg-white/10 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="flex items-center text-lg font-bold tracking-wide">
                <Truck className="mr-2 h-5 w-5 text-emerald-200 animate-pulse" />
                Chọn thông tin giao hàng
              </h2>
            </div>

            {/* Content */}
            <div className="relative max-h-[50vh] overflow-y-auto p-6 space-y-3">
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-24 rounded-lg bg-slate-850/50 border border-slate-800/50"></div>
                  <div className="h-24 rounded-lg bg-slate-850/50 border border-slate-800/50"></div>
                  <div className="h-24 rounded-lg bg-slate-850/50 border border-slate-800/50"></div>
                </div>
              ) : shippingOptions.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">
                  Chưa có thông tin giao hàng nào được lưu.
                </p>
              ) : (
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition hover:border-slate-700 hover:bg-slate-950/60 duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">
                          {option.to_name}
                        </p>
                        {option.is_default && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {option.to_address}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {option.to_ward_name}, {option.to_district_name},{" "}
                        {option.to_province_name}
                      </p>
                      <p className="text-xs text-emerald-400 mt-2 font-medium">
                        SĐT: {option.to_phone}
                      </p>
                      <p className="text-[10px] text-slate-500 capitalize mt-1.5 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600"></span>
                        Loại: {option.account_type}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative border-t border-slate-800/60 p-6">
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
              >
                Hủy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ShippingInfoModal.displayName = "ShippingInfoModal";

export default ShippingInfoModal;
