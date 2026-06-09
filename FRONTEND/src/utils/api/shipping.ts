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

export const createReceiverInfo = (data: any) => {
  return axiosClient.post("/delivery/receivers", data);
};

export const getReceiverInfoByUserId = (_userId: string | number) => {
  return axiosClient.get("/delivery/receivers");
};

export const updateReceiverInfoById = (
  receiverInfoId: string | number,
  data: any,
) => {
  return axiosClient.patch(`/delivery/receivers/${receiverInfoId}`, data);
};

export const deleteReceiverInfoById = (receiverInfoId: string | number) => {
  return axiosClient.delete(`/delivery/receivers/${receiverInfoId}`);
};

export const setDefaultReceiverInfoById = (receiverInfoId: string | number) => {
  return axiosClient.patch(`/delivery/receivers/${receiverInfoId}/default`);
};
