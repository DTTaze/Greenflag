import { ApiResponse } from "@/src/types/api";
import {
  CreateItemPayload,
  CreateProductPayload,
  PurchaseItemPayload,
  UpdateItemPayload,
  UpdateProductPayload,
} from "@/src/types/commerce/commerce.payload";
import {
  ItemResponse,
  ProductResponse,
  TransactionResponse,
} from "@/src/types/commerce/commerce.response";

import { commerceServices } from ".";

// --- Products ---

export const getProductsHandler = async (): Promise<
  ApiResponse<ProductResponse[]>
> => {
  return commerceServices.getAllProducts();
};

export const getProductByIdHandler = async (
  id: string,
): Promise<ApiResponse<ProductResponse>> => {
  return commerceServices.getProductById(id);
};

// --- Items ---

export const getItemsHandler = async (): Promise<ApiResponse<ItemResponse[]>> => {
  return commerceServices.getAllItems();
};

export const getItemByIdHandler = async (
  id: string,
): Promise<ApiResponse<ItemResponse>> => {
  return commerceServices.getItemById(id);
};

export const purchaseItemHandler = async (
  itemId: string,
  payload: PurchaseItemPayload,
): Promise<ApiResponse<TransactionResponse>> => {
  return commerceServices.purchaseItem(itemId, payload);
};

// --- Transactions ---

export const getBuyerTransactionsHandler = async (): Promise<
  ApiResponse<TransactionResponse[]>
> => {
  return commerceServices.getTransactionsByBuyer();
};

export const getTransactionByIdHandler = async (
  id: string,
): Promise<ApiResponse<TransactionResponse>> => {
  return commerceServices.getTransactionById(id);
};

export const cancelTransactionHandler = async (
  id: string,
): Promise<ApiResponse<TransactionResponse>> => {
  return commerceServices.cancelTransaction(id);
};

// --- Partner ---

export const partnerCreateProductHandler = async (
  payload: CreateProductPayload,
): Promise<ApiResponse<ProductResponse>> => {
  return commerceServices.partnerCreateProduct(payload);
};

export const partnerUpdateProductHandler = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<ApiResponse<ProductResponse>> => {
  return commerceServices.partnerUpdateProduct(id, payload);
};

export const partnerDeleteProductHandler = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return commerceServices.partnerDeleteProduct(id);
};

export const partnerCreateItemHandler = async (
  payload: CreateItemPayload,
): Promise<ApiResponse<ItemResponse>> => {
  return commerceServices.partnerCreateItem(payload);
};

export const partnerUpdateItemHandler = async (
  id: string,
  payload: UpdateItemPayload,
): Promise<ApiResponse<ItemResponse>> => {
  return commerceServices.partnerUpdateItem(id, payload);
};

export const partnerDeleteItemHandler = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return commerceServices.partnerDeleteItem(id);
};

export const partnerGetTransactionsHandler = async (): Promise<
  ApiResponse<TransactionResponse[]>
> => {
  return commerceServices.partnerGetTransactions();
};

export const partnerMakeTransactionDecisionHandler = async (
  id: string,
  decision: string,
): Promise<ApiResponse<TransactionResponse>> => {
  return commerceServices.partnerMakeTransactionDecision(id, decision);
};

// --- Admin ---

export const adminUpdateProductHandler = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<ApiResponse<ProductResponse>> => {
  return commerceServices.adminUpdateProduct(id, payload);
};

export const adminDeleteProductHandler = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return commerceServices.adminDeleteProduct(id);
};

export const adminUpdateItemHandler = async (
  id: string,
  payload: UpdateItemPayload,
): Promise<ApiResponse<ItemResponse>> => {
  return commerceServices.adminUpdateItem(id, payload);
};

export const adminDeleteItemHandler = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return commerceServices.adminDeleteItem(id);
};

export const adminGetAllTransactionsHandler = async (): Promise<
  ApiResponse<TransactionResponse[]>
> => {
  return commerceServices.adminGetAllTransactions();
};

export const adminGetTransactionsByStatusHandler = async (
  status: string,
): Promise<ApiResponse<TransactionResponse[]>> => {
  return commerceServices.adminGetTransactionsByStatus(status);
};

export const adminMakeTransactionDecisionHandler = async (
  id: string,
  decision: string,
): Promise<ApiResponse<TransactionResponse>> => {
  return commerceServices.adminMakeTransactionDecision(id, decision);
};

export const adminCancelTransactionHandler = async (
  id: string,
): Promise<ApiResponse<TransactionResponse>> => {
  return commerceServices.adminCancelTransaction(id);
};
