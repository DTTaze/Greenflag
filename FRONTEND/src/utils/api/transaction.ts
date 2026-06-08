import axios from "../axios.customize";

export const purchaseItem = (
  userId: string | number,
  itemId: string | number,
  data: any,
) => {
  return axios.post(`api/items/purchase/${itemId}`, {
    user_id: userId,
    ...data,
  });
};

export const getBuyerTransactionHistory = () => {
  return axios.get(`api/transactions/buyer`);
};

export const getTransactionById = (transactionId: string | number) => {
  return axios.get(`api/transactions/${transactionId}`);
};

export const makeTransactionDecision = (
  transactionId: string | number,
  decision: string,
) => {
  return axios.patch(`api/transactions/decision/${transactionId}/${decision}`);
};

export const getSellerTransactionHistory = () => {
  return axios.get(`api/transactions/seller`);
};

export const cancelTransaction = (transactionId: string | number) => {
  return axios.patch(`/api/transactions/cancel/${transactionId}`);
};

export const deleteTransaction = (transactionId: string | number) => {
  return axios.delete(`api/transactions/${transactionId}`);
};

export const getAllTransactions = () => {
  return axios.get("api/transactions");
};
