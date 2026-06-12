import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/src/components/ui/button";
import { useAuthStore } from "@/src/store/auth/authStore";
import {
  deleteReceiverInfoById,
  getReceiverInfoByUserId,
  setDefaultReceiverInfoById,
} from "@/src/utils/api";

import AddressFormDialog from "./AddressFormDialog";

function Address() {
  const t = useTranslations("user");
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await getReceiverInfoByUserId(user.id);
        if (response && response.data) {
          setAddresses(response.data);
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            setDefaultAddressId(defaultAddress.id);
          }
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setErrorMessage(t("updateFailed")); // Keep it generic or simple error message
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [user?.id, t]);

  const handleUpdateAddress = (addr) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    setIsLoading(true);
    try {
      await deleteReceiverInfoById(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      if (defaultAddressId === id) {
        setDefaultAddressId(null);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setErrorMessage(t("updateFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    setIsLoading(true);
    try {
      const response = await setDefaultReceiverInfoById(id);
      if (response.data) {
        setAddresses(
          addresses.map((addr) => ({
            ...addr,
            is_default: addr.id === id,
          })),
        );
        setDefaultAddressId(id);
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      setErrorMessage(t("updateFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSuccess = (savedAddress) => {
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === savedAddress.id
            ? savedAddress
            : {
                ...addr,
                is_default: savedAddress.is_default ? false : addr.is_default,
              },
        ),
      );
    } else {
      setAddresses((prev) => {
        const updated = prev.map((addr) =>
          savedAddress.is_default ? { ...addr, is_default: false } : addr,
        );
        return [...updated, savedAddress];
      });
    }

    if (savedAddress.is_default) {
      setDefaultAddressId(savedAddress.id);
    }
  };

  return (
    <div className="transform overflow-hidden rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-xl transition-all duration-300 dark:border-emerald-500/15 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t("myAddresses")}</h4>
        <Button
          text={t("addAddress")}
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          padding="15px"
        />
      </div>
      <hr className="my-4 border-emerald-100 dark:border-emerald-500/10" />

      <div className="space-y-4">
        {isLoading && <p className="text-zinc-500 dark:text-zinc-400">{t("loadingText")}</p>}
        {errorMessage && <p className="text-rose-500 dark:text-rose-400">{errorMessage}</p>}
        {!isLoading && addresses.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400">{t("noAddresses")}</p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border p-5 transition-all duration-200 ${
              defaultAddressId === addr.id
                ? "border-emerald-500 bg-emerald-50/20 dark:border-emerald-500/30 dark:bg-emerald-950/10"
                : "border-emerald-100 bg-zinc-50/30 dark:border-emerald-500/10 dark:bg-zinc-900/10"
            }`}
          >
            <div className="space-y-1">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{addr.to_name}</p>
              <p className="text-sm text-zinc-650 dark:text-zinc-450">{addr.to_phone}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{`${addr.to_ward_name}, ${addr.to_district_name}, ${addr.to_province_name}`}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full bg-zinc-200/60 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:text-zinc-350">
                  {addr.account_type?.toLowerCase() === "home" ? t("homeType") : t("officeType")}
                </span>
                {defaultAddressId === addr.id && (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-350">
                    {t("defaultText")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateAddress(addr)}
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/20 transition-all"
                >
                  {t("update")}
                </button>
                {defaultAddressId !== addr.id && (
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-450 dark:hover:text-rose-350 dark:hover:bg-rose-950/20 transition-all"
                  >
                    {t("delete")}
                  </button>
                )}
              </div>
              {defaultAddressId !== addr.id && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="cursor-pointer w-full sm:w-auto rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-250 transition-all px-4 py-2 text-xs font-semibold"
                >
                  {t("setDefault")}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddressFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAddress={editingAddress}
        userId={user?.id}
        onSuccess={handleAddressSuccess}
      />
    </div>
  );
}

export default Address;
