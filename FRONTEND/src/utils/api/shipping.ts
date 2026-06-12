import axiosClient from "../../services";

const getDeliveryPrefix = () => {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/admin");
  return isAdmin ? "/admin/delivery" : "/partner/delivery";
};

export const createShippingOrder = (
  data: any,
  token?: string,
  shopId?: string | number,
) => {
  return axiosClient.post("/delivery/orders", data, {
    headers: {
      token: token,
      shop_id: shopId,
    },
  });
};

export const getShippingOrderDetail = (
  orderCode: string,
  token?: string,
  shopId?: string | number,
) => {
  return axiosClient.get(`/delivery/orders/${orderCode}`, {
    headers: {
      token: token,
      shop_id: shopId,
    },
  });
};

export const getAllShippingOrdersBySeller = () => {
  return axiosClient.get(`${getDeliveryPrefix()}/orders`);
};

export const getAllShippingOrdersByBuyer = () => {
  return axiosClient.get("/delivery/orders");
};

export const getAllShippingOrders = () => {
  return axiosClient.get(`${getDeliveryPrefix()}/orders`);
};

export const updateShippingOrder = (
  _data: any,
  _token?: string,
  _shopId?: string | number,
) => {
  // NestJS backend handles update through cancellation/recreation;
  // returning success for compatibility.
  return Promise.resolve({ success: true, data: null });
};

export const previewOrderWithoutOrderCode = (
  data: any,
  token?: string,
  shopId?: string | number,
) => {
  return axiosClient.post("/delivery/preview", data, {
    headers: {
      token: token,
      shop_id: shopId,
    },
  });
};

export const getShippingAccountsByUser = () => {
  return axiosClient.get("/partner/delivery/accounts");
};

export const createShippingAccount = (data: any) => {
  return axiosClient.post("/partner/delivery/accounts", data);
};

export const createDeliveryOrderFromTransaction = (
  transactionId: string | number,
  data: any,
  token?: string,
  shopId?: string | number,
) => {
  return axiosClient.post(
    `/delivery/orders/transaction/${transactionId}`,
    data,
    {
      headers: {
        token: token,
        shop_id: shopId,
      },
    },
  );
};

export const updateShippingAccount = (
  accountId: string | number,
  data: any,
) => {
  return axiosClient.patch(`/partner/delivery/accounts/${accountId}`, data);
};

export const deleteShippingAccount = (accountId: string | number) => {
  return axiosClient.delete(`/partner/delivery/accounts/${accountId}`);
};

export const setDefaultShippingAccount = (accountId: string | number) => {
  return axiosClient.patch(`/partner/delivery/accounts/${accountId}/default`);
};

export const getAllProvinces = (token?: string) => {
  return axiosClient.get("/delivery/provinces", {
    headers: {
      token: token,
    },
  });
};

export const getAllDistrictsByProvince = (
  provinceId: string | number,
  token?: string,
) => {
  return axiosClient.post(
    `/delivery/districts`,
    { province_id: provinceId },
    {
      headers: {
        token: token,
      },
    },
  );
};

export const getAllWardsByDistrict = (
  districtId: string | number,
  token?: string,
) => {
  return axiosClient.get(`/delivery/wards`, {
    headers: {
      token: token,
    },
    params: {
      district_id: districtId,
    },
  });
};

export const formatCleanAddress = (
  rawAddress: string,
  ward: string,
  district: string,
  province: string
) => {
  if (!rawAddress) return "";

  const parts = rawAddress.split(",");

  const cleanStr = (s: string) => {
    if (!s) return "";
    let cleaned = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Normalize abbreviations and remove standalone prefix words
    cleaned = cleaned.replace(/\btp\b/g, "thanh pho")
                     .replace(/\bhcm\b/g, "ho chi minh")
                     .replace(/\bhn\b/g, "ha noi")
                     .replace(/\bphuong\b/g, "")
                     .replace(/\bquan\b/g, "")
                     .replace(/\btinh\b/g, "")
                     .replace(/\bxa\b/g, "")
                     .replace(/\bhuyen\b/g, "");

    // Keep only alphanumeric characters
    return cleaned.replace(/[^a-z0-9]/g, "").trim();
  };

  const cleanWard = cleanStr(ward);
  const cleanDistrict = cleanStr(district);
  const cleanProvince = cleanStr(province);

  const isMatch = (cleanedPart: string, cleanedMaster: string, prefix: string) => {
    if (!cleanedPart || !cleanedMaster) return false;
    if (cleanedPart === cleanedMaster) return true;
    if (cleanedPart === prefix + cleanedMaster || cleanedMaster === prefix + cleanedPart) return true;
    return false;
  };

  const filteredParts = parts.filter(part => {
    const cleanedPart = cleanStr(part);
    if (!cleanedPart) return false;

    if (cleanWard && isMatch(cleanedPart, cleanWard, "phuong")) return false;
    if (cleanDistrict && isMatch(cleanedPart, cleanDistrict, "quan")) return false;
    if (cleanProvince && (isMatch(cleanedPart, cleanProvince, "tinh") || isMatch(cleanedPart, cleanProvince, "thanhpho"))) return false;

    return true;
  });

  let streetAddress = filteredParts.map(p => p.trim()).join(", ");
  
  if (!streetAddress.trim()) {
    streetAddress = rawAddress;
  }

  return streetAddress;
};

const normalizeReceiverInfo = (addr: any) => {

  if (!addr) return null;
  return {
    ...addr,
    to_name: addr.to_name || addr.toName,
    toName: addr.toName || addr.to_name,
    to_phone: addr.to_phone || addr.toPhone,
    toPhone: addr.toPhone || addr.to_phone,
    to_address: addr.to_address || addr.toAddress,
    toAddress: addr.toAddress || addr.to_address,
    to_ward_name: addr.to_ward_name || addr.toWardName,
    toWardName: addr.toWardName || addr.to_ward_name,
    to_district_name: addr.to_district_name || addr.toDistrictName,
    toDistrictName: addr.toDistrictName || addr.to_district_name,
    to_province_name: addr.to_province_name || addr.toProvinceName,
    toProvinceName: addr.toProvinceName || addr.to_province_name,
    account_type: addr.account_type || addr.accountType,
    accountType: addr.accountType || addr.account_type,
    is_default: addr.is_default !== undefined ? addr.is_default : addr.isDefault,
    isDefault: addr.isDefault !== undefined ? addr.isDefault : addr.is_default,
  };
};

export const createReceiverInfo = async (data: any) => {
  const response: any = await axiosClient.post("/delivery/receivers", data);
  if (response && response.data) {
    response.data = normalizeReceiverInfo(response.data);
  }
  return response;
};

export const getReceiverInfoByUserId = async (_userId: string | number) => {
  const response: any = await axiosClient.get("/delivery/receivers");
  if (response && Array.isArray(response.data)) {
    response.data = response.data.map(normalizeReceiverInfo);
  }
  return response;
};

export const updateReceiverInfoById = async (
  receiverInfoId: string | number,
  data: any,
) => {
  const response: any = await axiosClient.patch(`/delivery/receivers/${receiverInfoId}`, data);
  if (response && response.data) {
    response.data = normalizeReceiverInfo(response.data);
  }
  return response;
};

export const deleteReceiverInfoById = (receiverInfoId: string | number) => {
  return axiosClient.delete(`/delivery/receivers/${receiverInfoId}`);
};

export const setDefaultReceiverInfoById = async (receiverInfoId: string | number) => {
  const response: any = await axiosClient.patch(`/delivery/receivers/${receiverInfoId}/default`);
  if (response && response.data) {
    response.data = normalizeReceiverInfo(response.data);
  }
  return response;
};
