import axios from "./axios.customize";

export const createUserApi = (data) => {
  return axios.post("api/auth/register", data);
};

export const loginUserApi = (data) => {
  return axios.post("api/auth/login", data);
};

export const logoutUserApi = () => {
  return axios.post("api/auth/logout");
};

export const forgotPasswordApi = (email) => {
  return axios.post("/api/auth/forgot_password", { email });
};

export const resetPasswordApi = (token, newPassword) => {
  return axios.post("/api/auth/reset_password", { token, newPassword });
};

export const getUserApi = () => {
  return axios.get("api/users/me");
};

export const getAllUserApi = () => {
  return axios.get("api/users");
};

export const updateUserApi = (id, data) => {
  return axios.put(`api/users/${id}`, data);
};

export const updateUserPublicApi = (public_id, data) => {
  return axios.put(`api/users/public/${public_id}`, data);
};

export const getUserByIDPublicApi = (public_id) => {
  return axios.get(`api/users/public/${public_id}`);
};

export const deleteUserApi = (id) => {
  return axios.delete(`api/users/${id}`);
};

export const getAllRolesApi = () => {
  return axios.get("api/roles");
};

export const getAllPermissionsApi = () => {
  return axios.get("api/permissions");
};

export const getAllRolesPermissionsApi = () => {
  return axios.get("api/roles/all-rolepermission");
};

export const getAllVideosApi = () => {
  return axios.get("api/videos");
};

export const uploadUserAvatarApi = (user_id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.post(`api/avatars/upload/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserAvatarByIdApi = (user_id) => {
  return axios.get(`api/avatars/${user_id}`);
};

export const getAllUserAvatarsApi = () => {
  return axios.get("api/avatars/");
};

export const updateUserAvatarApi = (user_id, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.put(`api/avatars/${user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUserAvatarApi = (user_id) => {
  return axios.delete(`api/avatars/${user_id}`);
};

export const purchaseItemApi = (user_id, item_id, data) => {
  return axios.post(`api/items/purchase/${item_id}`, { user_id, ...data });
};

export const getAllItemsApi = () => {
  return axios.get("api/items");
};

export const getTaskByIdApi = (task_id) => {
  return axios.get(`api/tasks/${task_id}`);
};

export const getAllTasksApi = () => {
  return axios.get("api/tasks");
};

export const getAllTaskCompletedById = () => {
  return axios.get(`api/users/task/completed`);
};

export const acceptTaskApi = (task_id, user_id) => {
  return axios.post(`api/tasks/${task_id}/accept/${user_id}`);
};

export const completeTaskApi = (id) => {
  return axios.post(`api/tasks/complete/${id}`);
};

export const AllTaskByIdApi = (id) => {
  return axios.get(`api/users/tasks/all/${id}`);
};

export const receiveCoinApi = (coins) => {
  return axios.post("api/tasks/coin/receive", { coins });
};

export const submitTaskApi = (task_user_id, data) => {
  const formData = new FormData();
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.file) {
    formData.append("file", data.file);
  }

  return axios.post(`api/tasks/submit/${task_user_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const increaseProgressCountApi = (task_user_id) => {
  return axios.post(`api/tasks/progress/increase/${task_user_id}`);
};

export const deleteTaskApi = (id) => {
  return axios.delete(`api/tasks/${id}`);
};

export const createTaskApi = (data) => {
  return axios.post("api/tasks/upload", data);
};

export const updateTaskApi = (id, data) => {
  return axios.put(`api/tasks/${id}`, data);
};

export const deleteItemApi = (id) => {
  return axios.delete(`api/items/${id}`);
};

export const createItemApi = (data) => {
  return axios.post("api/items/upload", data);
};

export const updateItemApi = (id, data) => {
  return axios.put(`api/items/${id}`, data);
};

export const deleteRoleApi = (id) => {
  return axios.delete(`api/roles/${id}`);
};

export const createRoleApi = (data) => {
  return axios.post("api/roles/create", data);
};

export const updateRoleApi = (id, data) => {
  return axios.put(`api/roles/${id}`, data);
};

export const deletePermissionApi = (id) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createPermissionApi = (data) => {
  return axios.post("api/permissions/create", data);
};

export const updatePermissionApi = (id, data) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const deleteRolePermissionApi = (id) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createRolePermissionApi = (data) => {
  return axios.post("api/permissions/create", data);
};

export const updateRolePermissionApi = (id, data) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const acceptTaskByIdApi = (task_id) => {
  return axios.post(`api/tasks/accept/${task_id}`);
};

export const getBuyerTransactionHistory = () => {
  return axios.get(`api/transactions/buyer`);
};

export const getTransactionByIdApi = (id) => {
  return axios.get(`api/transactions/${id}`);
};

export const transactionMakeDicisionApi = (id, decision) => {
  return axios.patch(`api/transactions/decision/${id}/${decision}`);
};

export const getSellerTransactionHistory = () => {
  return axios.get(`api/transactions/seller`);
};

export const CancelTransactionByIdAPI = (id) => {
  return axios.patch(`/api/transactions/cancel/${id}`);
};

export const deleteTransactionsApi = (id) => {
  return axios.delete(`api/transactions/${id}`);
};

export const getAllTransactionsApi = () => {
  return axios.get("api/transactions");
};

export const getQRApi = (text) => {
  return axios.get("api/qr", {
    params: { text },
  });
};

export const getAllTasksByTypeNameApi = (type_name) => {
  return axios.get(`api/tasks/type/${type_name}`);
};

export const rearrangeRankApi = () => {
  return axios.post("api/ranks/rearrange");
};

export const getUserByIdApi = (id) => {
  return axios.get(`api/users/${id}`);
};
export const getAdminQueueApi = () => {
  return axios.get("api/admin/queues");
};

export const createProductApi = (formData) => {
  return axios.post("api/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllAvailableProductsApi = () => {
  return axios.get("api/products/available");
};

export const getAllProductsApi = () => {
  return axios.get("api/products");
};

export const getProductByIdUser = (id) => {
  return axios.get(`api/products/users/${id}`);
};

export const updateProductApi = (id, formData) => {
  return axios.put(`api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProductApi = (id) => {
  return axios.delete(`api/products/${id}`);
};

export const getAllEventsApi = () => {
  return axios.get("api/events/informations");
};

export const getOwnerEventApi = () => {
  return axios.get("api/events/creator");
};

export const getEventUserByEventIdApi = (event_id) => {
  return axios.get(`api/events/user/${event_id}`);
};

export const acceptEventApi = (event_id) => {
  return axios.post(`api/events/accept/${event_id}`);
};

export const getEventSignedByUserIdApi = (user_id) => {
  return axios.get(`api/events/signed/${user_id}`);
};

export const deleteEventUserByIdApi = (eventUser_id) => {
  return axios.delete(`api/events/user/delete/${eventUser_id}`);
};

export const CheckInUserByUserIdApi = (user_id, event_id) => {
  return axios.put("api/events/check_in", {
    event_id: event_id,
    user_id: user_id,
  });
};

export const CheckOutUserByUserIdApi = (user_id, event_id) => {
  return axios.put("api/events/check_out", {
    event_id: event_id,
    user_id: user_id,
  });
};

export const createEventApi = (formEventData, images) => {
  const formData = new FormData();

  // Append all event data fields
  Object.keys(formEventData).forEach((key) => {
    formData.append(key, formEventData[key]);
  });

  // Append images if they exist
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      formData.append("images", image);
    });
  }

  return axios.post("api/events/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateEventApi = (event_id, formEventData, images) => {
  const formData = new FormData();

  // Append all event data fields
  Object.keys(formEventData).forEach((key) => {
    formData.append(key, formEventData[key]);
  });

  // Append images if they exist
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      formData.append("images", image);
    });
  }

  return axios.put(`api/events/update/${event_id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEventApi = (event_id) => {
  return axios.delete(`api/events/delete/${event_id}`);
};

export const upLoadItemApi = (formItemData, images) => {
  const formData = new FormData();

  // Append all item data fields
  Object.keys(formItemData).forEach((key) => {
    formData.append(key, formItemData[key]);
  });

  // Append images if they exist
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      formData.append("images", image);
    });
  }

  return axios.post("api/items/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getItemByIdUserApi = (id) => {
  return axios.get(`api/items/users/${id}`);
};

export const updateItemOfCustomerApi = (id, formItemData, images) => {
  const formData = new FormData();

  // Append all item data fields
  Object.keys(formItemData).forEach((key) => {
    formData.append(key, formItemData[key]);
  });

  // Append images if they exist
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      formData.append("images", image);
    });
  }

  return axios.put(`api/items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItemOfCustomerApi = (id) => {
  return axios.delete(`api/items/${id}`);
};

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
