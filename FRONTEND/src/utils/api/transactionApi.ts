import axios from "../axios.customize";

export const purchaseItemApi = (
  user_id: string | number,
  item_id: string | number,
  data: any,
) => {
  return axios.post(`api/items/purchase/${item_id}`, { user_id, ...data });
};

export const getBuyerTransactionHistory = () => {
  return axios.get(`api/transactions/buyer`);
};

export const getTransactionByIdApi = (id: string | number) => {
  return axios.get(`api/transactions/${id}`);
};

export const transactionMakeDicisionApi = (
  id: string | number,
  decision: string,
) => {
  return axios.patch(`api/transactions/decision/${id}/${decision}`);
};

export const getSellerTransactionHistory = () => {
  return axios.get(`api/transactions/seller`);
};

export const CancelTransactionByIdAPI = (id: string | number) => {
  return axios.patch(`/api/transactions/cancel/${id}`);
};

export const deleteTransactionsApi = (id: string | number) => {
  return axios.delete(`api/transactions/${id}`);
};

export const getAllTransactionsApi = () => {
  return axios.get("api/transactions");
};
