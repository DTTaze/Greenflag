import axiosClient from "@/src/services";
import {
  CreateProductPayload,
  UpdateProductPayload,
  CreateItemPayload,
  UpdateItemPayload,
  PurchaseItemPayload,
} from "@/src/types/commerce/commerce.payload";

export const commerceServices = {
  // --- Products ---
  getAllProducts: (): Promise<any> => axiosClient.get("/commerce/products"),

  getProductById: (id: string): Promise<any> => axiosClient.get(`/commerce/products/${id}`),

  // --- Items ---
  getAllItems: (): Promise<any> => axiosClient.get("/commerce/items"),

  getItemById: (id: string): Promise<any> => axiosClient.get(`/commerce/items/${id}`),

  purchaseItem: (itemId: string, payload: PurchaseItemPayload): Promise<any> =>
    axiosClient.post(`/commerce/items/${itemId}/purchase`, payload),

  // --- Transactions ---
  getTransactionsByBuyer: (): Promise<any> => axiosClient.get("/commerce/transactions/buyer"),

  getTransactionById: (id: string): Promise<any> => axiosClient.get(`/commerce/transactions/${id}`),

  cancelTransaction: (id: string): Promise<any> => axiosClient.post(`/commerce/transactions/${id}/cancel`),

  // --- Partner Commerce ---
  partnerCreateProduct: (payload: CreateProductPayload): Promise<any> =>
    axiosClient.post("/partner/commerce/products", payload),

  partnerUpdateProduct: (id: string, payload: UpdateProductPayload): Promise<any> =>
    axiosClient.patch(`/partner/commerce/products/${id}`, payload),

  partnerDeleteProduct: (id: string): Promise<any> =>
    axiosClient.delete(`/partner/commerce/products/${id}`),

  partnerCreateItem: (payload: CreateItemPayload): Promise<any> =>
    axiosClient.post("/partner/commerce/items", payload),

  partnerUpdateItem: (id: string, payload: UpdateItemPayload): Promise<any> =>
    axiosClient.patch(`/partner/commerce/items/${id}`, payload),

  partnerDeleteItem: (id: string): Promise<any> =>
    axiosClient.delete(`/partner/commerce/items/${id}`),

  partnerGetTransactions: (): Promise<any> =>
    axiosClient.get("/partner/commerce/transactions"),

  partnerMakeTransactionDecision: (id: string, decision: string): Promise<any> =>
    axiosClient.patch(`/partner/commerce/transactions/${id}/decision`, { decision }),

  // --- Admin Commerce ---
  adminUpdateProduct: (id: string, payload: UpdateProductPayload): Promise<any> =>
    axiosClient.patch(`/admin/commerce/products/${id}`, payload),

  adminDeleteProduct: (id: string): Promise<any> =>
    axiosClient.delete(`/admin/commerce/products/${id}`),

  adminUpdateItem: (id: string, payload: UpdateItemPayload): Promise<any> =>
    axiosClient.patch(`/admin/commerce/items/${id}`, payload),

  adminDeleteItem: (id: string): Promise<any> =>
    axiosClient.delete(`/admin/commerce/items/${id}`),

  adminGetAllTransactions: (): Promise<any> =>
    axiosClient.get("/admin/commerce/transactions"),

  adminGetTransactionsByStatus: (status: string): Promise<any> =>
    axiosClient.get(`/admin/commerce/transactions/status/${status}`),

  adminMakeTransactionDecision: (id: string, decision: string): Promise<any> =>
    axiosClient.patch(`/admin/commerce/transactions/${id}/decision`, { decision }),

  adminCancelTransaction: (id: string): Promise<any> =>
    axiosClient.post(`/admin/commerce/transactions/${id}/cancel`),
};
