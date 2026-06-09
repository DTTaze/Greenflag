import {
  adminGetAllTransactionsHandler,
  adminGetTransactionsByStatusHandler,
  getBuyerTransactionsHandler,
  getItemByIdHandler,
  getItemsHandler,
  getProductByIdHandler,
  getProductsHandler,
  getTransactionByIdHandler,
  partnerGetTransactionsHandler,
} from "@/src/services/commerce/commerceHandlers";
import {
  ItemResponse,
  ProductResponse,
  TransactionResponse,
} from "@/src/types/commerce/commerce.response";

export const getProductsQueryFn = async (): Promise<ProductResponse[]> => {
  const response = await getProductsHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch products");
  }
  return response.data;
};

export const getProductByIdQueryFn = async (id: string): Promise<ProductResponse> => {
  const response = await getProductByIdHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch product details");
  }
  return response.data;
};

export const getItemsQueryFn = async (): Promise<ItemResponse[]> => {
  const response = await getItemsHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch items");
  }
  return response.data;
};

export const getItemByIdQueryFn = async (id: string): Promise<ItemResponse> => {
  const response = await getItemByIdHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch item details");
  }
  return response.data;
};

export const getBuyerTransactionsQueryFn = async (): Promise<
  TransactionResponse[]
> => {
  const response = await getBuyerTransactionsHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch buyer transactions");
  }
  return response.data;
};

export const getTransactionByIdQueryFn = async (
  id: string,
): Promise<TransactionResponse> => {
  const response = await getTransactionByIdHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch transaction details");
  }
  return response.data;
};

export const partnerGetTransactionsQueryFn = async (): Promise<
  TransactionResponse[]
> => {
  const response = await partnerGetTransactionsHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch partner transactions");
  }
  return response.data;
};

export const adminGetAllTransactionsQueryFn = async (): Promise<
  TransactionResponse[]
> => {
  const response = await adminGetAllTransactionsHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch all transactions");
  }
  return response.data;
};

export const adminGetTransactionsByStatusQueryFn = async (
  status: string,
): Promise<TransactionResponse[]> => {
  const response = await adminGetTransactionsByStatusHandler(status);
  if (!response.success) {
    throw new Error(response.message || `Failed to fetch transactions with status ${status}`);
  }
  return response.data;
};
