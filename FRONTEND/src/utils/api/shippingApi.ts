import axios from "../axios.customize";

export const createShippingOrderApi = (
  data: any,
  token?: string,
  shop_id?: string | number,
) => {
  return axios.post("api/delivery/carrier/ghn/create-order", data, {
    headers: {
      token: token,
      shop_id: shop_id,
    },
  });
};

export const getShippingOrderDetailApi = (
  order_code: string,
  token?: string,
  shop_id?: string | number,
) => {
  return axios.get(`api/delivery/carrier/ghn/detail/${order_code}`, {
    headers: {
      token: token,
      shop_id: shop_id,
    },
  });
};

export const getAllShippingOrdersBySellerApi = () => {
  return axios.get("api/delivery/carrier/ghn/orders/seller");
};

export const getAllShippingOrdersByBuyerApi = () => {
  return axios.get("api/delivery/carrier/ghn/orders/buyer");
};

export const getAllShippingOrdersApi = () => {
  return axios.get("api/delivery/carrier/ghn/orders");
};

export const updateShippingOrderApi = (
  data: any,
  token?: string,
  shop_id?: string | number,
) => {
  return axios.post("api/delivery/carrier/ghn/update", data, {
    headers: {
      token: token,
      shop_id: shop_id,
    },
  });
};

export const PreviewOrderWithoutOrderCode = (
  data: any,
  token?: string,
  shop_id?: string | number,
) => {
  return axios.post("api/delivery/carrier/ghn/order/preview", data, {
    headers: {
      token: token,
      shop_id: shop_id,
    },
  });
};

export const cancelShippingOrderApi = (order_code: string) => {
  return axios.post(`api/delivery/carrier/ghn/cancel/${order_code}`);
};

export const getShippingAccountsByUserApi = () => {
  return axios.get("api/delivery/accounts/user");
};

export const createShippingAccountApi = (data: any) => {
  return axios.post("api/delivery/accounts/create", data);
};

export const createDeliveryOrderFromTransactionApi = (
  transaction_id: string | number,
  data: any,
  token?: string,
  shop_id?: string | number,
) => {
  return axios.post(
    `api/delivery/carrier/ghn/create-order-from-transaction/${transaction_id}`,
    data,
    {
      headers: {
        token: token,
        shop_id: shop_id,
      },
    },
  );
};

export const updateShippingAccountApi = (id: string | number, data: any) => {
  return axios.put(`api/delivery/accounts/${id}`, data);
};

export const deleteShippingAccountApi = (id: string | number) => {
  return axios.delete(`api/delivery/accounts/${id}`);
};

export const setDefaultShippingAccountApi = (id: string | number) => {
  return axios.patch(`api/delivery/accounts/user/set-default/${id}`);
};

export const getAllProvincesApi = (token?: string) => {
  return axios.get("api/delivery/carrier/ghn/master-data/province", {
    headers: {
      token: token,
    },
  });
};

export const getAllDistrictsByProvinceApi = (
  province_id: string | number,
  token?: string,
) => {
  return axios.post(
    `api/delivery/carrier/ghn/master-data/district`,
    { province_id },
    {
      headers: {
        token: token,
      },
    },
  );
};

export const getAllWardsByDistrictApi = (
  district_id: string | number,
  token?: string,
) => {
  return axios.get(
    `api/delivery/carrier/ghn/master-data/ward?district_id=${district_id}`,
    {
      headers: {
        token: token,
      },
    },
  );
};

export const createReceiverInfoAPI = (data: any) => {
  return axios.post("api/users/receiver/create", data);
};

export const getReceiverInfoByIdAPI = (id: string | number) => {
  return axios.get(`api/users/receiver/info/${id}`);
};

export const getReceiverInfoByUserIDAPI = (user_id: string | number) => {
  return axios.get(`api/users/receiver/info/user/${user_id}`);
};

export const updateReceiverInfoByIdAPI = (id: string | number, data: any) => {
  return axios.patch(`api/users/receiver/update/${id}`, data);
};

export const deleteReceiverInfoByIdAPI = (id: string | number) => {
  return axios.delete(`api/users/receiver/info/${id}`);
};

export const SetDefaultReceiverInfoByIdAPI = (id: string | number) => {
  return axios.patch(`api/users/receiver/set-default/${id}`);
};
