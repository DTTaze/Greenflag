import axios from "../axios.customize";

export const createShippingOrder = (
  data: any,
  token?: string,
  shopId?: string | number,
) => {
  return axios.post("api/delivery/carrier/ghn/create-order", data, {
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
  return axios.get(`api/delivery/carrier/ghn/detail/${orderCode}`, {
    headers: {
      token: token,
      shop_id: shopId,
    },
  });
};

export const getAllShippingOrdersBySeller = () => {
  return axios.get("api/delivery/carrier/ghn/orders/seller");
};

export const getAllShippingOrdersByBuyer = () => {
  return axios.get("api/delivery/carrier/ghn/orders/buyer");
};

export const getAllShippingOrders = () => {
  return axios.get("api/delivery/carrier/ghn/orders");
};

export const updateShippingOrder = (
  data: any,
  token?: string,
  shopId?: string | number,
) => {
  return axios.post("api/delivery/carrier/ghn/update", data, {
    headers: {
      token: token,
      shop_id: shopId,
    },
  });
};

export const previewOrderWithoutOrderCode = (
  data: any,
  token?: string,
  shopId?: string | number,
) => {
  return axios.post("api/delivery/carrier/ghn/order/preview", data, {
    headers: {
      token: token,
      shop_id: shopId,
    },
  });
};

export const getShippingAccountsByUser = () => {
  return axios.get("api/delivery/accounts/user");
};

export const createShippingAccount = (data: any) => {
  return axios.post("api/delivery/accounts/create", data);
};

export const createDeliveryOrderFromTransaction = (
  transactionId: string | number,
  data: any,
  token?: string,
  shopId?: string | number,
) => {
  return axios.post(
    `api/delivery/carrier/ghn/create-order-from-transaction/${transactionId}`,
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
  return axios.put(`api/delivery/accounts/${accountId}`, data);
};

export const deleteShippingAccount = (accountId: string | number) => {
  return axios.delete(`api/delivery/accounts/${accountId}`);
};

export const setDefaultShippingAccount = (accountId: string | number) => {
  return axios.patch(`api/delivery/accounts/user/set-default/${accountId}`);
};

export const getAllProvinces = (token?: string) => {
  return axios.get("api/delivery/carrier/ghn/master-data/province", {
    headers: {
      token: token,
    },
  });
};

export const getAllDistrictsByProvince = (
  provinceId: string | number,
  token?: string,
) => {
  return axios.post(
    `api/delivery/carrier/ghn/master-data/district`,
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
  return axios.get(
    `api/delivery/carrier/ghn/master-data/ward?district_id=${districtId}`,
    {
      headers: {
        token: token,
      },
    },
  );
};

export const createReceiverInfo = (data: any) => {
  return axios.post("api/users/receiver/create", data);
};

export const getReceiverInfoByUserId = (userId: string | number) => {
  return axios.get(`api/users/receiver/info/user/${userId}`);
};

export const updateReceiverInfoById = (
  receiverInfoId: string | number,
  data: any,
) => {
  return axios.patch(`api/users/receiver/update/${receiverInfoId}`, data);
};

export const deleteReceiverInfoById = (receiverInfoId: string | number) => {
  return axios.delete(`api/users/receiver/info/${receiverInfoId}`);
};

export const setDefaultReceiverInfoById = (receiverInfoId: string | number) => {
  return axios.patch(`api/users/receiver/set-default/${receiverInfoId}`);
};
