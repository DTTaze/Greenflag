import { useState, useEffect, useContext, forwardRef } from "react";
import { X, Truck, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReceiverInfoByUserIDAPI } from "@/src/utils/api";
import { AuthContext } from "@/src/contexts/auth.context";

// Sử dụng forwardRef để nhận ref từ PurchaseModal
const ShippingInfoModal = forwardRef(({ isOpen, onClose, onSelect }, ref) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    async function fetchShippingOptions() {
      if (isOpen && auth.user?.id) {
        try {
          setIsLoading(true);
          const response = await getReceiverInfoByUserIDAPI(auth.user.id);
          setShippingOptions(response?.data || []);
        } catch (error) {
          console.error("Error fetching shipping options:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchShippingOptions();
  }, [isOpen, auth.user?.id]);

  const handleSelect = (option) => {
    onSelect(option);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Ngăn sự kiện mousedown lan truyền ra ngoài
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <motion.div
            ref={ref} // Gắn ref vào div chính của modal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 py-4 px-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white hover:text-emerald-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Chọn thông tin giao hàng
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                </div>
              ) : shippingOptions.length === 0 ? (
                <p className="text-gray-600 text-center">
                  Chưa có thông tin giao hàng nào được lưu.
                </p>
              ) : (
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">{option.to_name}</p>
                        {option.is_default && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{option.to_address}</p>
                      <p className="text-sm text-gray-600">
                        {option.to_ward_name}, {option.to_district_name}, {option.to_province_name}
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
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
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