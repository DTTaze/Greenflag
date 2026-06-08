import { useEffect, useState } from "react";

import {
  createReceiverInfoAPI,
  getAllDistrictsByProvinceApi,
  getAllProvincesApi,
  getAllWardsByDistrictApi,
  SetDefaultReceiverInfoByIdAPI,
  updateReceiverInfoByIdAPI,
} from "@/src/utils/api.js";

export default function useAddressForm({
  isOpen,
  onClose,
  editingAddress,
  userId,
  onSuccess,
}) {
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

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [token] = useState("c3f24415-29b9-11f0-9b81-222185cb68c8");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load initial provinces and resolve editing address hierarchy
  useEffect(() => {
    const initForm = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const provResponse = await getAllProvincesApi(token);
        if (provResponse.code !== 200) {
          setErrorMessage("Failed to fetch provinces. Please try again.");
          setIsLoading(false);
          return;
        }
        const provinceList = provResponse.data;
        setProvinces(provinceList);

        if (editingAddress) {
          const matchedProvince = provinceList.find(
            (p) => p.ProvinceName === editingAddress.to_province_name,
          );

          let matchedDistrictId = "";
          let districtList = [];
          if (matchedProvince) {
            const distResponse = await getAllDistrictsByProvinceApi(
              matchedProvince.ProvinceID,
              token,
            );
            if (distResponse.code === 200) {
              districtList = distResponse.data;
              setDistricts(districtList);
              const matchedDistrict = districtList.find(
                (d) => d.DistrictName === editingAddress.to_district_name,
              );
              if (matchedDistrict) {
                matchedDistrictId = matchedDistrict.DistrictID;
              }
            }
          }

          let matchedWardCode = "";
          let wardList = [];
          if (matchedDistrictId) {
            const wardResponse = await getAllWardsByDistrictApi(
              matchedDistrictId,
              token,
            );
            if (wardResponse.code === 200) {
              wardList = wardResponse.data;
              setWards(wardList);
              const matchedWard = wardList.find(
                (w) => w.WardName === editingAddress.to_ward_name,
              );
              if (matchedWard) {
                matchedWardCode = matchedWard.WardCode;
              }
            }
          }

          setNewAddress({
            fullName: editingAddress.to_name,
            phoneNumber: editingAddress.to_phone,
            province: matchedProvince?.ProvinceID || "",
            district: matchedDistrictId,
            ward: matchedWardCode,
            specificAddress: editingAddress.to_address,
            type: editingAddress.account_type,
            isDefault: editingAddress.is_default,
          });
        } else {
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
        }
      } catch (error) {
        console.error("Error initializing address form:", error);
        setErrorMessage("Error initializing form data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      initForm();
    }
  }, [isOpen, editingAddress, token]);

  // Fetch districts on province change (only when not loading initial edit state)
  useEffect(() => {
    const fetchDistricts = async () => {
      if (
        !isLoading &&
        newAddress.province &&
        Number.isInteger(newAddress.province)
      ) {
        try {
          const response = await getAllDistrictsByProvinceApi(
            newAddress.province,
            token,
          );
          if (response.code === 200) {
            setDistricts(response.data);
            setWards([]);
            setNewAddress((prev) => ({ ...prev, district: "", ward: "" }));
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [newAddress.province, token, isLoading]);

  // Fetch wards on district change (only when not loading initial edit state)
  useEffect(() => {
    const fetchWards = async () => {
      if (
        !isLoading &&
        newAddress.district &&
        Number.isInteger(newAddress.district)
      ) {
        try {
          const response = await getAllWardsByDistrictApi(
            newAddress.district,
            token,
          );
          if (response.code === 200) {
            setWards(response.data);
            setNewAddress((prev) => ({ ...prev, ward: "" }));
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      }
    };
    fetchWards();
  }, [newAddress.district, token, isLoading]);

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
      user_id: userId,
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
      let savedAddress;
      if (editingAddress) {
        const response = await updateReceiverInfoByIdAPI(
          editingAddress.id,
          addressData,
        );
        if (response.data) {
          savedAddress = { ...response.data, id: editingAddress.id };
        }
      } else {
        const response = await createReceiverInfoAPI(addressData);
        if (response.data) {
          savedAddress = response.data;
        }
      }

      if (savedAddress && newAddress.isDefault) {
        const defaultResponse = await SetDefaultReceiverInfoByIdAPI(
          savedAddress.id,
        );
        if (defaultResponse.data) {
          savedAddress.is_default = true;
        }
      }

      if (savedAddress) {
        onSuccess(savedAddress);
      }
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      setErrorMessage("Error saving address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newAddress,
    errors,
    provinces,
    districts,
    wards,
    isLoading,
    errorMessage,
    handleInputChange,
    handleTypeChange,
    handleDefaultChange,
    handleAddOrUpdateAddress,
  };
}
