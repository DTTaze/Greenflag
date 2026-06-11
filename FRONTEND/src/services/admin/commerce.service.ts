import axiosClient from "@/src/services";
const axios = axiosClient;
import { ApiResponse } from "@/src/types/api";
import {
  AdminProductDTO,
  UpdateProductDTO,
  AdminItemDTO,
  UpdateItemDTO,
  AdminTransactionDTO,
  TransactionDecisionDTO,
  TransactionStatus,
  OrderDTO,
  UpdateOrderStatusPayload,
  OrderStatus,
} from "@/src/types/admin/commerce.type";

const BASE_URL = "/admin/commerce";

/**
 * Products Management
 */
const PRODUCTS_URL = `${BASE_URL}/products`;

export async function adminGetAllProducts(): Promise<
  ApiResponse<AdminProductDTO[]>
> {
  const response = await axios.get(PRODUCTS_URL);
  return response.data;
}

export async function adminUpdateProduct(
  productId: string,
  payload: UpdateProductDTO,
): Promise<ApiResponse<AdminProductDTO>> {
  const response = await axios.patch(`${PRODUCTS_URL}/${productId}`, payload);
  return response.data;
}

export async function adminDeleteProduct(
  productId: string,
): Promise<ApiResponse<null>> {
  const response = await axios.delete(`${PRODUCTS_URL}/${productId}`);
  return response.data;
}

/**
 * Items Management
 */
const ITEMS_URL = `${BASE_URL}/items`;

export async function adminGetAllItems(): Promise<ApiResponse<AdminItemDTO[]>> {
  const response = await axios.get(ITEMS_URL);
  return response.data;
}

export async function adminUpdateItem(
  itemId: string,
  payload: UpdateItemDTO,
): Promise<ApiResponse<AdminItemDTO>> {
  const response = await axios.patch(`${ITEMS_URL}/${itemId}`, payload);
  return response.data;
}

export async function adminDeleteItem(
  itemId: string,
): Promise<ApiResponse<null>> {
  const response = await axios.delete(`${ITEMS_URL}/${itemId}`);
  return response.data;
}

/**
 * Transactions Management
 */
const TRANSACTIONS_URL = `${BASE_URL}/transactions`;

export async function adminGetAllTransactions(params?: {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
}): Promise<ApiResponse<AdminTransactionDTO[]>> {
  const response = await axios.get(TRANSACTIONS_URL, { params });
  return response.data;
}

export async function adminGetTransactionsByStatus(
  status: TransactionStatus,
): Promise<ApiResponse<AdminTransactionDTO[]>> {
  const response = await axios.get(`${TRANSACTIONS_URL}/status/${status}`);
  return response.data;
}

export async function adminMakeTransactionDecision(
  transactionId: string,
  decision: TransactionDecisionDTO,
): Promise<ApiResponse<AdminTransactionDTO>> {
  const response = await axios.patch(
    `${TRANSACTIONS_URL}/${transactionId}/decision`,
    decision,
  );
  return response.data;
}

export async function adminCancelTransaction(
  transactionId: string,
): Promise<ApiResponse<AdminTransactionDTO>> {
  const response = await axios.post(
    `${TRANSACTIONS_URL}/${transactionId}/cancel`,
  );
  return response.data;
}

/**
 * Orders Management (for reward redemption)
 */
const ORDERS_URL = `${BASE_URL}/orders`;

export async function adminGetAllOrders(params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}): Promise<ApiResponse<OrderDTO[]>> {
  const response = await axios.get(ORDERS_URL, { params });
  return response.data;
}

export async function adminUpdateOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusPayload,
): Promise<ApiResponse<OrderDTO>> {
  const response = await axios.patch(
    `${ORDERS_URL}/${orderId}/status`,
    payload,
  );
  return response.data;
}

export async function adminGetOrderById(
  orderId: string,
): Promise<ApiResponse<OrderDTO>> {
  const response = await axios.get(`${ORDERS_URL}/${orderId}`);
  return response.data;
}
