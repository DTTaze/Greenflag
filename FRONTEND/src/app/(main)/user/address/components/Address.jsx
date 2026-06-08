import { useEffect, useState } from "react";

import Button from "@/src/components/ui/button";
import { useAuthStore } from "@/src/store/auth/authStore";
import {
  deleteReceiverInfoByIdAPI,
  getReceiverInfoByUserIDAPI,
  SetDefaultReceiverInfoByIdAPI,
} from "@/src/utils/api";

import AddressFormDialog from "./AddressFormDialog";

function Address() {
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
        const response = await getReceiverInfoByUserIDAPI(user.id);
        if (response.status === 200 && response.data) {
          setAddresses(response.data);
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            setDefaultAddressId(defaultAddress.id);
          }
        } else {
          setErrorMessage("No addresses found.");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setErrorMessage("Error fetching addresses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [user?.id]);

  const handleUpdateAddress = (addr) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    setIsLoading(true);
    try {
      await deleteReceiverInfoByIdAPI(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      if (defaultAddressId === id) {
        setDefaultAddressId(null);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setErrorMessage("Error deleting address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    setIsLoading(true);
    try {
      const response = await SetDefaultReceiverInfoByIdAPI(id);
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
      setErrorMessage("Error setting default address. Please try again.");
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
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Địa chỉ của tôi</h4>
        <Button
          text="Thêm địa chỉ mới"
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          padding="15px"
        />
      </div>
      <hr className="my-2 border-gray-300" />

      <div className="space-y-4">
        {isLoading && <p className="text-gray-500">Đang tải...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {!isLoading && addresses.length === 0 && (
          <p className="text-gray-500">Chưa có địa chỉ nào.</p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`flex items-start justify-between rounded-lg border p-4 ${
              defaultAddressId === addr.id ? "border-green-500 bg-green-50" : ""
            }`}
          >
            <div>
              <p className="font-semibold">{addr.to_name}</p>
              <p className="text-gray-600">{addr.to_phone}</p>
              <p className="text-gray-600">{`${addr.to_ward_name}, ${addr.to_district_name}, ${addr.to_province_name}`}</p>
              <p className="text-sm text-gray-500">
                {addr.account_type === "home" ? "Nhà riêng" : "Văn phòng"}
              </p>
              {defaultAddressId === addr.id && (
                <p className="text-sm font-semibold text-green-600">Mặc định</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateAddress(addr)}
                  className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-blue-500"
                >
                  Cập nhật
                </button>
                {defaultAddressId !== addr.id && (
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-blue-500"
                  >
                    Xóa
                  </button>
                )}
              </div>
              {defaultAddressId !== addr.id && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="cursor-pointer rounded-md bg-gray-300 px-4 py-2 text-sm font-medium"
                >
                  Thiết lập mặc định
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
