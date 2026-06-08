/* eslint-disable max-lines */
import { useContext, useEffect, useState } from "react";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField.jsx";
import { AuthContext } from "@/src/contexts/auth.context.jsx";
import {
  createReceiverInfoAPI,
  deleteReceiverInfoByIdAPI,
  getAllDistrictsByProvinceApi,
  getAllProvincesApi,
  getAllWardsByDistrictApi,
  getReceiverInfoByUserIDAPI,
  SetDefaultReceiverInfoByIdAPI,
  updateReceiverInfoByIdAPI,
} from "@/src/utils/api.js";

function Address() {
  const { auth } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    specificAddress: "",
    type: "home",
    isDefault: false,
  });
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [token] = useState("c3f24415-29b9-11f0-9b81-222185cb68c8");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!auth.user?.id) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await getReceiverInfoByUserIDAPI(auth.user.id);
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
  }, [auth.user?.id]);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await getAllProvincesApi(token);
        if (response.code === 200) {
          setProvinces(response.data);
        } else {
          setErrorMessage("Failed to fetch provinces. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setErrorMessage(
          "Error fetching provinces. Please check your connection.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, [token]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (newAddress.province && Number.isInteger(newAddress.province)) {
        setIsLoading(true);
        try {
          const response = await getAllDistrictsByProvinceApi(
            newAddress.province,
            token,
          );
          if (response.code === 200) {
            setDistricts(response.data);
            setWards([]);
            setNewAddress((prev) => ({ ...prev, district: "", ward: "" }));
          } else {
            setErrorMessage("Failed to fetch districts. Please try again.");
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
          setErrorMessage(
            "Error fetching districts. Please check your connection.",
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setDistricts([]);
        setWards([]);
        setNewAddress((prev) => ({ ...prev, district: "", ward: "" }));
      }
    };
    fetchDistricts();
  }, [newAddress.province, token]);

  useEffect(() => {
    const fetchWards = async () => {
      if (newAddress.district && Number.isInteger(newAddress.district)) {
        setIsLoading(true);
        try {
          const response = await getAllWardsByDistrictApi(
            newAddress.district,
            token,
          );
          if (response.code === 200) {
            setWards(response.data);
            setNewAddress((prev) => ({ ...prev, ward: "" }));
          } else {
            setErrorMessage("Failed to fetch wards. Please try again.");
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
          setErrorMessage(
            "Error fetching wards. Please check your connection.",
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setWards([]);
        setNewAddress((prev) => ({ ...prev, ward: "" }));
      }
    };
    fetchWards();
  }, [newAddress.district, token]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value) error = "Họ và tên không được để trống";
        else if (!/^[a-zA-ZÀ-ỹà-ỹ\s]+$/.test(value))
          error = "Họ và tên không được chứa ký tự đặc biệt";
        break;
      case "phoneNumber":
        if (!value) error = "Số điện thoại không được để trống";
        else if (!/^\d{10}$/.test(value))
          error = "Số điện thoại phải là 10 chữ số";
        break;
      case "province":
        if (!value) error = "Vui lòng chọn Tỉnh/Thành phố";
        break;
      case "district":
        if (!value) error = "Vui lòng chọn Quận/Huyện";
        break;
      case "ward":
        if (!value) error = "Vui lòng chọn Phường/Xã";
        break;
      case "specificAddress":
        if (!value) error = "Địa chỉ cụ thể không được để trống";
        else if (!/^[a-zA-ZÀ-ỹ0-9\s,./-]+$/.test(value))
          error = "Địa chỉ cụ thể không chứa ký tự đặc biệt không hợp lệ";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "province" || name === "district"
        ? parseInt(value, 10) || ""
        : value;
    setNewAddress((prev) => ({ ...prev, [name]: parsedValue }));

    const error = validateField(name, parsedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTypeChange = (e) => {
    setNewAddress((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleDefaultChange = (e) => {
    setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }));
  };

  const handleAddOrUpdateAddress = async () => {
    const newErrors = {};
    [
      "fullName",
      "phoneNumber",
      "province",
      "district",
      "ward",
      "specificAddress",
    ].forEach((field) => {
      const error = validateField(field, newAddress[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const provinceName =
      provinces.find((p) => p.ProvinceID === newAddress.province)
        ?.ProvinceName || "";
    const districtName =
      districts.find((d) => d.DistrictID === newAddress.district)
        ?.DistrictName || "";
    const wardName =
      wards.find((w) => w.WardCode === newAddress.ward)?.WardName || "";

    const addressData = {
      user_id: auth.user.id,
      to_name: newAddress.fullName,
      to_phone: newAddress.phoneNumber,
      to_address: newAddress.specificAddress,
      to_ward_name: wardName,
      to_district_name: districtName,
      to_province_name: provinceName,
      account_type: newAddress.type,
      is_default: newAddress.isDefault,
    };

    setIsLoading(true);
    try {
      let newAddressId;
      if (editingAddressId) {
        const response = await updateReceiverInfoByIdAPI(
          editingAddressId,
          addressData,
        );
        if (response.data) {
          setAddresses(
            addresses.map((addr) =>
              addr.id === editingAddressId
                ? { ...response.data, id: editingAddressId }
                : addr,
            ),
          );
          newAddressId = editingAddressId;
        }
      } else {
        const response = await createReceiverInfoAPI(addressData);
        if (response.data) {
          newAddressId = response.data.id;
          setAddresses([...addresses, { ...response.data, id: newAddressId }]);
        }
      }

      if (newAddress.isDefault && newAddressId) {
        const defaultResponse =
          await SetDefaultReceiverInfoByIdAPI(newAddressId);
        if (defaultResponse.data) {
          setAddresses((prev) =>
            prev.map((addr) => ({
              ...addr,
              is_default: addr.id === newAddressId,
            })),
          );
          setDefaultAddressId(newAddressId);
        }
      }

      setNewAddress({
        fullName: "",
        phoneNumber: "",
        province: "",
        district: "",
        ward: "",
        specificAddress: "",
        type: "home",
        isDefault: false,
      });
      setErrors({});
      setIsModalOpen(false);
      setEditingAddressId(null);
    } catch (error) {
      console.error("Error saving address:", error);
      setErrorMessage("Error saving address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (id) => {
    try {
      const address = addresses.find((addr) => addr.id === id);
      if (address) {
        const province = provinces.find(
          (p) => p.ProvinceName === address.to_province_name,
        );
        const district = districts.find(
          (d) => d.DistrictName === address.to_district_name,
        );
        const ward = wards.find((w) => w.WardName === address.to_ward_name);

        setNewAddress({
          fullName: address.to_name,
          phoneNumber: address.to_phone,
          province: province?.ProvinceID || "",
          district: district?.DistrictID || "",
          ward: ward?.WardCode || "",
          specificAddress: address.to_address,
          type: address.account_type,
          isDefault: address.is_default,
        });
        setEditingAddressId(id);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setErrorMessage("Error fetching address. Please try again.");
    }
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

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Địa chỉ của tôi</h4>
        <Button
          text="Thêm địa chỉ mới"
          onClick={() => {
            setEditingAddressId(null);
            setNewAddress({
              fullName: "",
              phoneNumber: "",
              province: "",
              district: "",
              ward: "",
              specificAddress: "",
              type: "home",
              isDefault: false,
            });
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
                  onClick={() => handleUpdateAddress(addr.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg transform rounded-lg bg-white p-6 shadow-2xl transition-all">
            <h4 className="mb-4 text-lg font-semibold">
              {editingAddressId ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            </h4>
            {isLoading && <p className="text-gray-500">Đang tải...</p>}
            {errorMessage && (
              <p className="mb-4 text-red-500">{errorMessage}</p>
            )}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <InputField
                id="fullName"
                label="Họ và tên"
                name="fullName"
                value={newAddress.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
              />
              <InputField
                id="phoneNumber"
                label="Số điện thoại"
                name="phoneNumber"
                value={newAddress.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="province"
                className="mb-2 block text-sm font-semibold"
              >
                Tỉnh/Thành phố
              </label>
              <select
                id="province"
                name="province"
                value={newAddress.province}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                disabled={isLoading}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces
                  .filter((province) => province.Status === 1)
                  .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
                  .map((province) => (
                    <option
                      key={province.ProvinceID}
                      value={province.ProvinceID}
                    >
                      {province.ProvinceName}
                    </option>
                  ))}
              </select>
              {errors.province && (
                <p className="text-sm text-red-500">{errors.province}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="district"
                className="mb-2 block text-sm font-semibold"
              >
                Quận/Huyện
              </label>
              <select
                id="district"
                name="district"
                value={newAddress.district}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                disabled={!newAddress.province || isLoading}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-sm text-red-500">{errors.district}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="ward"
                className="mb-2 block text-sm font-semibold"
              >
                Phường/Xã
              </label>
              <select
                id="ward"
                name="ward"
                value={newAddress.ward}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                disabled={!newAddress.district || isLoading}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
              {errors.ward && (
                <p className="text-sm text-red-500">{errors.ward}</p>
              )}
            </div>
            <InputField
              id="specificAddress"
              label="Địa chỉ cụ thể"
              name="specificAddress"
              value={newAddress.specificAddress}
              onChange={handleInputChange}
              error={errors.specificAddress}
            />
            <div className="mb-4">
              <label className="mt-2 mb-2 block text-sm font-semibold">
                Loại địa chỉ
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  value="home"
                  onClick={handleTypeChange}
                  className={`rounded-md border px-4 py-2 font-medium ${
                    newAddress.type === "home"
                      ? "border-emerald-800"
                      : "border-gray-300"
                  }`}
                >
                  Nhà riêng
                </button>
                <button
                  type="button"
                  value="office"
                  onClick={handleTypeChange}
                  className={`rounded-md border px-4 py-2 font-medium ${
                    newAddress.type === "office"
                      ? "border-emerald-800"
                      : "border-gray-300"
                  }`}
                >
                  Văn phòng
                </button>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={handleDefaultChange}
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="isDefault" className="text-sm">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                text="Trở lại"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAddressId(null);
                }}
                padding="15px"
              />
              <Button
                text={editingAddressId ? "Cập nhật" : "Hoàn thành"}
                onClick={handleAddOrUpdateAddress}
                padding="15px"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Address;
