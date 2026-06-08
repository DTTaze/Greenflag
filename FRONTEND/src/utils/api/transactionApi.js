import axios from "../axios.customize";

export const purchaseItemApi = (user_id, item_id, data) => {
  return axios.post(`api/items/purchase/${item_id}`, { user_id, ...data });
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

export const getAdminQueueApi = () => {
  return axios.get("api/admin/queues");
};
