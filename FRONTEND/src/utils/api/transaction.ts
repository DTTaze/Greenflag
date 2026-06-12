import axiosClient from "../../services";

const getTransactionPrefix = () => {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/admin");
  return isAdmin
    ? "/admin/commerce/transactions"
    : "/partner/commerce/transactions";
};

export const purchaseItem = (
  userId: string | number,
  itemId: string | number,
  data: any,
) => {
  return axiosClient.post(`/commerce/items/${itemId}/purchase`, {
    name: data.name || "Item Purchase",
    quantity: data.quantity ? parseInt(data.quantity, 10) : 1,
    receiver_information_id:
      data.receiver_information_id || data.receiverInformationId,
    to_name: data.to_name || data.toName || "Recipient",
    to_phone: data.to_phone || data.toPhone || "",
    to_address: data.to_address || data.toAddress || "",
  });
};

export const purchaseProduct = (
  userId: string | number,
  productId: string | number,
  data: any,
) => {
  return axiosClient.post(`/commerce/products/${productId}/purchase`, {
    name: data.name || "Product Purchase",
    quantity: data.quantity ? parseInt(data.quantity, 10) : 1,
    receiver_information_id:
      data.receiver_information_id || data.receiverInformationId,
    to_name: data.to_name || data.toName || "Recipient",
    to_phone: data.to_phone || data.toPhone || "",
    to_address: data.to_address || data.toAddress || "",
  });
};


export const getBuyerTransactionHistory = () => {
  return axiosClient.get("/commerce/transactions/buyer");
};

export const getTransactionById = (transactionId: string | number) => {
  return axiosClient.get(`/commerce/transactions/${transactionId}`);
};

export const makeTransactionDecision = (
  transactionId: string | number,
  decision: string,
) => {
  return axiosClient.patch(
    `${getTransactionPrefix()}/${transactionId}/decision`,
    {
      decision: decision,
    },
  );
};

export const getSellerTransactionHistory = () => {
  return axiosClient.get("/partner/commerce/transactions");
};

export const cancelTransaction = (transactionId: string | number) => {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/admin");
  if (isAdmin) {
    return axiosClient.post(
      `/admin/commerce/transactions/${transactionId}/cancel`,
    );
  }
  return axiosClient.post(`/commerce/transactions/${transactionId}/cancel`);
};

export const deleteTransaction = (transactionId: string | number) => {
  // NestJS backend does not expose soft-delete for transactions directly;
  // canceling represents the transaction resolution flow.
  return cancelTransaction(transactionId);
};

export const getAllTransactions = () => {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/admin");
  if (isAdmin) {
    return axiosClient.get("/admin/commerce/transactions");
  }
  return axiosClient.get("/partner/commerce/transactions");
};
