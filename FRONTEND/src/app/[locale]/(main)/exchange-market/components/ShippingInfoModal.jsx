import { AnimatePresence, motion } from "framer-motion";
import { Star, Truck, X } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import { getReceiverInfoByUserId } from "@/src/utils/api";

// Sử dụng forwardRef để nhận ref từ PurchaseModal
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
        // Ngăn sự kiện mousedown lan truyền ra ngoài
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <motion.div
            ref={ref} // Gắn ref vào div chính của modal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-emerald-600 px-6 py-4 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white transition-colors hover:text-emerald-100"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="flex items-center text-xl font-semibold">
                <Truck className="mr-2 h-5 w-5" />
                Chọn thông tin giao hàng
              </h2>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 rounded-lg bg-gray-100"></div>
                  <div className="h-16 rounded-lg bg-gray-100"></div>
                  <div className="h-16 rounded-lg bg-gray-100"></div>
                </div>
              ) : shippingOptions.length === 0 ? (
                <p className="text-center text-gray-600">
                  Chưa có thông tin giao hàng nào được lưu.
                </p>
              ) : (
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className="w-full rounded-lg border border-gray-200 p-4 text-left transition hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">
                          {option.to_name}
                        </p>
                        {option.is_default && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {option.to_address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.to_ward_name}, {option.to_district_name},{" "}
                        {option.to_province_name}
                      </p>
                      <p className="text-sm text-gray-600">{option.to_phone}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        Loại: {option.account_type}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
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

export default ShippingInfoModal;
