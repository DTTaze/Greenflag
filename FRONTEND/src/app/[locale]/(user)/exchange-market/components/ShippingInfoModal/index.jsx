import { AnimatePresence, motion } from "framer-motion";
import { Check, Star, Truck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useState } from "react";

import AddressFormDialog from "@/src/app/[locale]/(user)/(private)/user/address/components/AddressFormDialog";
import { useAuthStore } from "@/src/store/auth/authStore";
import { formatCleanAddress, getReceiverInfoByUserId } from "@/src/utils/api";

const ShippingInfoModal = forwardRef(({ isOpen, onClose, onSelect, selectedId }, ref) => {
  const t = useTranslations("exchangeMarket");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-250 bg-white shadow-2xl dark:border-emerald-500/15 dark:bg-slate-900/95"
          >
            {/* Decorative Glow */}
            <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            {/* Header */}
            <div className="relative border-b border-emerald-500/10 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 px-6 py-5 text-white">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 rounded-full p-1 text-emerald-100 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="flex items-center text-lg font-bold tracking-wide">
                <Truck className="mr-2 h-5 w-5 animate-pulse text-emerald-200" />
                {t("shipping.modalTitle")}
              </h2>
            </div>

            {/* Content */}
            <div className="relative max-h-[50vh] space-y-3 overflow-y-auto p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-24 rounded-lg border border-emerald-200/50 bg-slate-50/50 dark:border-emerald-500/10 dark:bg-slate-900/30"></div>
                  <div className="h-24 rounded-lg border border-emerald-200/50 bg-slate-50/50 dark:border-emerald-500/10 dark:bg-slate-900/30"></div>
                  <div className="h-24 rounded-lg border border-emerald-200/50 bg-slate-50/50 dark:border-emerald-500/10 dark:bg-slate-900/30"></div>
                </div>
              ) : shippingOptions.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-slate-400 mb-4">
                    {t("shipping.emptySaved") || "Chưa có địa chỉ nào được lưu."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddressFormOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition duration-200 active:scale-[0.98] shadow-md shadow-emerald-950/20 cursor-pointer"
                  >
                    + Thêm địa chỉ mới
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {shippingOptions.map((option) => {
                    const isSelected = option.id === selectedId;
                    const cleanStreetAddress = formatCleanAddress(
                      option.to_address,
                      option.to_ward_name,
                      option.to_district_name,
                      option.to_province_name
                    );
                    const accountType = option.account_type?.toLowerCase() || option.accountType?.toLowerCase();

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(option)}
                        className={`w-full relative rounded-xl border p-4 text-left transition duration-200 cursor-pointer ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-900/10"
                            : "bg-white border-gray-200 hover:border-emerald-500/40 hover:bg-emerald-50/10 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-emerald-950/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {option.to_name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            {isSelected && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm shadow-emerald-950/20">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                            {option.is_default && (
                              <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <Star className="h-2.5 w-2.5 fill-current text-amber-700 dark:text-amber-400" />
                                {t("shipping.defaultBadge")}
                              </span>
                            )}
                            {accountType && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                                  accountType === "home"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}
                              >
                                {accountType === "home" ? "Nhà riêng" : "Văn phòng"}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-650 dark:text-slate-300 font-medium">
                          {cleanStreetAddress}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {option.to_ward_name}, {option.to_district_name},{" "}
                          {option.to_province_name}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {t("shipping.phonePrefix", { phone: option.to_phone })}
                        </p>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setIsAddressFormOpen(true)}
                    className="w-full rounded-xl border border-dashed border-emerald-500/35 bg-emerald-50/5 p-4 text-center text-sm font-semibold text-emerald-500 hover:border-emerald-450 hover:bg-emerald-50/10 dark:border-emerald-500/20 dark:bg-slate-950/20 dark:hover:border-emerald-500/30 dark:hover:bg-slate-900/40 transition duration-200 cursor-pointer"
                  >
                    + Thêm địa chỉ mới
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative border-t border-emerald-100 p-6 dark:border-emerald-500/10">
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-emerald-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-emerald-50/30 dark:border-emerald-500/15 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {t("common.cancel")}
              </button>
            </div>

            {/* Address Form Dialog Overlay */}
            {isAddressFormOpen && (
              <AddressFormDialog
                isOpen={isAddressFormOpen}
                onClose={() => setIsAddressFormOpen(false)}
                editingAddress={null}
                userId={user?.id}
                onSuccess={(savedAddress) => {
                  setIsAddressFormOpen(false);
                  handleSelect(savedAddress);
                }}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ShippingInfoModal.displayName = "ShippingInfoModal";

export default ShippingInfoModal;
