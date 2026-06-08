import axios from "../axios.customize";

export const createShippingOrderApi = (data, token, shop_id) => {
  return axios.post("api/delivery/carrier/ghn/create-order", data, {
    headers: {
      token: token,
      shop_id: shop_id,
    },
  });
};

export const getShippingOrderDetailApi = (order_code, token, shop_id) => {
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

export const updateShippingOrderApi = (data, token, shop_id) => {
  return axios.post("api/delivery/carrier/ghn/update", data, {
    headers: {
      token: token,
      shop_id: shop_id,
    },
  });
};

export const PreviewOrderWithoutOrderCode = (data, token, shop_id) => {
  return axios.post("api/delivery/carrier/ghn/order/preview", data, {
    headers: {
      token: token,
      shop_id: shop_id,
    },
  });
};

export const cancelShippingOrderApi = (order_code) => {
  return axios.post(`api/delivery/carrier/ghn/cancel/${order_code}`);
};

export const getShippingAccountsByUserApi = () => {
  return axios.get("api/delivery/accounts/user");
};

export const createShippingAccountApi = (data) => {
  return axios.post("api/delivery/accounts/create", data);
};

export const createDeliveryOrderFromTransactionApi = (
  transaction_id,
  data,
  token,
  shop_id,
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

export const updateShippingAccountApi = (id, data) => {
  return axios.put(`api/delivery/accounts/${id}`, data);
};

export const deleteShippingAccountApi = (id) => {
  return axios.delete(`api/delivery/accounts/${id}`);
};

export const setDefaultShippingAccountApi = (id) => {
  return axios.patch(`api/delivery/accounts/user/set-default/${id}`);
};

export const getAllProvincesApi = (token) => {
  return axios.get("api/delivery/carrier/ghn/master-data/province", {
    headers: {
      token: token,
    },
  });
};

export const getAllDistrictsByProvinceApi = (province_id, token) => {
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

export const getAllWardsByDistrictApi = (district_id, token) => {
  return axios.get(
    `api/delivery/carrier/ghn/master-data/ward?district_id=${district_id}`,
    {
      headers: {
        token: token,
      },
    },
  );
};

export const createReceiverInfoAPI = (data) => {
  return axios.post("api/users/receiver/create", data);
};

export const getReceiverInfoByIdAPI = (id) => {
  return axios.get(`api/users/receiver/info/${id}`);
};

export const getReceiverInfoByUserIDAPI = (user_id) => {
  return axios.get(`api/users/receiver/info/user/${user_id}`);
};

export const updateReceiverInfoByIdAPI = (id, data) => {
  return axios.patch(`api/users/receiver/update/${id}`, data);
};

export const deleteReceiverInfoByIdAPI = (id) => {
  return axios.delete(`api/users/receiver/info/${id}`);
};

export const SetDefaultReceiverInfoByIdAPI = (id) => {
  return axios.patch(`api/users/receiver/set-default/${id}`);
};
