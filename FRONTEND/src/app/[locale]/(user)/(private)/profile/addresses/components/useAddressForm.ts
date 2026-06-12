/* eslint-disable max-lines */
import { useEffect, useState } from "react";

import {
  createReceiverInfo,
  getAllDistrictsByProvince,
  getAllProvinces,
  getAllWardsByDistrict,
  setDefaultReceiverInfoById,
  updateReceiverInfoById,
} from "@/src/utils/api";

interface UseAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress: any;
  userId: any;
  onSuccess: (savedAddress: any) => void;
}

export default function useAddressForm({
  isOpen,
  onClose,
  editingAddress,
  userId,
  onSuccess,
}: UseAddressFormProps) {
  const [newAddress, setNewAddress] = useState<any>({
    fullName: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    specificAddress: "",
    type: "home",
    isDefault: false,
  });
  const [initialAddress, setInitialAddress] = useState<any>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [token] = useState<string>("c3f24415-29b9-11f0-9b81-222185cb68c8");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDistrictsLoading, setIsDistrictsLoading] = useState<boolean>(false);
  const [isWardsLoading, setIsWardsLoading] = useState<boolean>(false);

  // Load initial provinces and resolve editing address hierarchy
  useEffect(() => {
    const initForm = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const provResponse: any = await getAllProvinces(token);
        let provinceList = [];
        if (provResponse) {
          if (provResponse.success) {
            const innerData = provResponse.data;
            if (innerData) {
              if (Array.isArray(innerData)) {
                provinceList = innerData;
              } else if (innerData.code === 200 && Array.isArray(innerData.data)) {
                provinceList = innerData.data;
              } else if (Array.isArray(innerData.data)) {
                provinceList = innerData.data;
              }
            }
          } else if (Array.isArray(provResponse)) {
            provinceList = provResponse;
          } else if (Array.isArray(provResponse.data)) {
            provinceList = provResponse.data;
          }
        }

        if (!provinceList || provinceList.length === 0) {
          setErrorMessage("Failed to fetch provinces. Please try again.");
          setIsLoading(false);
          return;
        }
        setProvinces(provinceList);

        if (editingAddress) {
          const matchedProvince = provinceList.find(
            (p: any) => p.ProvinceName === editingAddress.to_province_name,
          );

          let matchedDistrictId = "";
          let districtList = [];
          if (matchedProvince) {
            const distResponse: any = await getAllDistrictsByProvince(
              matchedProvince.ProvinceID,
              token,
            );
            if (distResponse) {
              if (distResponse.success) {
                const innerDist = distResponse.data;
                if (innerDist) {
                  if (Array.isArray(innerDist)) {
                    districtList = innerDist;
                  } else if (innerDist.code === 200 && Array.isArray(innerDist.data)) {
                    districtList = innerDist.data;
                  } else if (Array.isArray(innerDist.data)) {
                    districtList = innerDist.data;
                  }
                }
              } else if (Array.isArray(distResponse)) {
                districtList = distResponse;
              } else if (Array.isArray(distResponse.data)) {
                districtList = distResponse.data;
              }
            }
            setDistricts(districtList);
            const matchedDistrict = districtList.find(
              (d: any) => d.DistrictName === editingAddress.to_district_name,
            );
            if (matchedDistrict) {
              matchedDistrictId = matchedDistrict.DistrictID;
            }
          }

          let matchedWardCode = "";
          let wardList = [];
          if (matchedDistrictId) {
            const wardResponse: any = await getAllWardsByDistrict(
              matchedDistrictId,
              token,
            );
            if (wardResponse) {
              if (wardResponse.success) {
                const innerWard = wardResponse.data;
                if (innerWard) {
                  if (Array.isArray(innerWard)) {
                    wardList = innerWard;
                  } else if (innerWard.code === 200 && Array.isArray(innerWard.data)) {
                    wardList = innerWard.data;
                  } else if (Array.isArray(innerWard.data)) {
                    wardList = innerWard.data;
                  }
                }
              } else if (Array.isArray(wardResponse)) {
                wardList = wardResponse;
              } else if (Array.isArray(wardResponse.data)) {
                wardList = wardResponse.data;
              }
            }
            setWards(wardList);
            const matchedWard = wardList.find(
              (w: any) => w.WardName === editingAddress.to_ward_name,
            );
            if (matchedWard) {
              matchedWardCode = matchedWard.WardCode;
            }
          }

          const resolvedAddress = {
            fullName: editingAddress.to_name,
            phoneNumber: editingAddress.to_phone,
            province: matchedProvince?.ProvinceID || "",
            district: matchedDistrictId,
            ward: matchedWardCode,
            specificAddress: editingAddress.to_address,
            type: editingAddress.account_type,
            isDefault: editingAddress.is_default,
          };
          setNewAddress(resolvedAddress);
          setInitialAddress(resolvedAddress);
        } else {
          const resolvedAddress = {
            fullName: "",
            phoneNumber: "",
            province: "",
            district: "",
            ward: "",
            specificAddress: "",
            type: "home",
            isDefault: false,
          };
          setNewAddress(resolvedAddress);
          setInitialAddress(resolvedAddress);
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
        setIsDistrictsLoading(true);
        try {
          const response: any = await getAllDistrictsByProvince(
            newAddress.province,
            token,
          );
          let districtList = [];
          if (response) {
            if (response.success) {
              const innerData = response.data;
              if (innerData) {
                if (Array.isArray(innerData)) {
                  districtList = innerData;
                } else if (innerData.code === 200 && Array.isArray(innerData.data)) {
                  districtList = innerData.data;
                } else if (Array.isArray(innerData.data)) {
                  districtList = innerData.data;
                }
              }
            } else if (Array.isArray(response)) {
              districtList = response;
            } else if (Array.isArray(response.data)) {
              districtList = response.data;
            }
          }
          setDistricts(districtList);
          setWards([]);
          setNewAddress((prev: any) => ({ ...prev, district: "", ward: "" }));
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setIsDistrictsLoading(false);
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
        setIsWardsLoading(true);
        try {
          const response: any = await getAllWardsByDistrict(
            newAddress.district,
            token,
          );
          let wardList = [];
          if (response) {
            if (response.success) {
              const innerData = response.data;
              if (innerData) {
                if (Array.isArray(innerData)) {
                  wardList = innerData;
                } else if (innerData.code === 200 && Array.isArray(innerData.data)) {
                  wardList = innerData.data;
                } else if (Array.isArray(innerData.data)) {
                  wardList = innerData.data;
                }
              }
            } else if (Array.isArray(response)) {
              wardList = response;
            } else if (Array.isArray(response.data)) {
              wardList = response.data;
            }
          }
          setWards(wardList);
          setNewAddress((prev: any) => ({ ...prev, ward: "" }));
        } catch (error) {
          console.error("Error fetching wards:", error);
        } finally {
          setIsWardsLoading(false);
        }
      }
    };
    fetchWards();
  }, [newAddress.district, token, isLoading]);

  const validateField = (name: string, value: any): string => {
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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "province" || name === "district"
        ? parseInt(value, 10) || ""
        : value;
    setNewAddress((prev: any) => ({ ...prev, [name]: parsedValue }));

    const error = validateField(name, parsedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTypeChange = (e: any) => {
    setNewAddress((prev: any) => ({ ...prev, type: e.target.value }));
  };

  const handleDefaultChange = (e: any) => {
    setNewAddress((prev: any) => ({ ...prev, isDefault: e.target.checked }));
  };

  const handleAddOrUpdateAddress = async () => {
    const newErrors: Record<string, string> = {};
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
      provinces.find((p: any) => p.ProvinceID === newAddress.province)
        ?.ProvinceName || "";
    const districtName =
      districts.find((d: any) => d.DistrictID === newAddress.district)
        ?.DistrictName || "";
    const wardName =
      wards.find((w: any) => w.WardCode === newAddress.ward)?.WardName || "";

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
      let savedAddress: any = null;
      if (editingAddress) {
        const { user_id, ...updatePayload } = addressData;
        const response: any = await updateReceiverInfoById(
          editingAddress.id,
          updatePayload,
        );
        if (response.data) {
          savedAddress = { ...response.data, id: editingAddress.id };
        }
      } else {
        const response: any = await createReceiverInfo(addressData);
        if (response.data) {
          savedAddress = response.data;
        }
      }

      if (savedAddress && newAddress.isDefault) {
        const defaultResponse: any = await setDefaultReceiverInfoById(
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

  const isDirty = initialAddress
    ? Object.keys(initialAddress).some(
        (key) => newAddress[key] !== initialAddress[key]
      )
    : false;

  const handleCancel = () => {
    if (isDirty) {
      const confirmCancel = window.confirm(
        "Bạn có chắc chắn muốn hủy? Thông tin đã nhập chưa được lưu lại."
      );
      if (!confirmCancel) {
        return;
      }
    }
    onClose();
  };

  return {
    newAddress,
    errors,
    provinces,
    districts,
    wards,
    isLoading,
    isDistrictsLoading,
    isWardsLoading,
    errorMessage,
    handleInputChange,
    handleTypeChange,
    handleDefaultChange,
    handleAddOrUpdateAddress,
    handleCancel,
  };
}
