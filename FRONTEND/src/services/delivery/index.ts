import axiosClient from "@/src/services";
import {
  CreateDeliveryAccountPayload,
  CreateDeliveryOrderFromTransactionPayload,
  CreateDeliveryOrderPayload,
  CreateReceiverInfoPayload,
  UpdateDeliveryAccountPayload,
  UpdateDeliveryOrderPayload,
  UpdateReceiverInfoPayload,
} from "@/src/types/delivery/delivery.payload";

export const deliveryServices = {
  // --- Receiver Information ---
  getReceivers: (): Promise<any> => axiosClient.get("/delivery/receivers"),

  getReceiverById: (id: string): Promise<any> => axiosClient.get(`/delivery/receivers/${id}`),

  createReceiver: (payload: CreateReceiverInfoPayload): Promise<any> =>
    axiosClient.post("/delivery/receivers", payload),

  updateReceiver: (id: string, payload: UpdateReceiverInfoPayload): Promise<any> =>
    axiosClient.patch(`/delivery/receivers/${id}`, payload),

  deleteReceiver: (id: string): Promise<any> => axiosClient.delete(`/delivery/receivers/${id}`),

  setDefaultReceiver: (id: string): Promise<any> =>
    axiosClient.patch(`/delivery/receivers/${id}/default`),

  // --- Locations ---
  getProvinces: (carrier?: string, token?: string, shopId?: string): Promise<any> =>
    axiosClient.get("/delivery/provinces", {
      params: { carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),

  getDistricts: (
    provinceId: number,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.post(
      "/delivery/districts",
      { province_id: provinceId },
      {
        params: { carrier },
        headers: token || shopId ? { token, shop_id: shopId } : undefined,
      },
    ),

  getWards: (
    districtId: number,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.get("/delivery/wards", {
      params: { district_id: districtId, carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),

  // --- Order Actions & Calculations ---
  previewOrder: (
    dto: any,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.post("/delivery/preview", dto, {
      params: { carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),

  createOrder: (
    dto: CreateDeliveryOrderPayload,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.post("/delivery/orders", dto, {
      params: { carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),

  createOrderFromTransaction: (
    transactionId: string,
    dto: CreateDeliveryOrderFromTransactionPayload,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.post(`/delivery/orders/transaction/${transactionId}`, dto, {
      params: { carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),

  getOrderInfo: (
    orderCode: string,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.get(`/delivery/orders/${orderCode}`, {
      params: { carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),

  getOrdersByBuyer: (): Promise<any> => axiosClient.get("/delivery/orders"),

  // --- Partner Accounts & Orders ---
  partnerGetAccounts: (): Promise<any> => axiosClient.get("/partner/delivery/accounts"),

  partnerGetAccountById: (id: string): Promise<any> =>
    axiosClient.get(`/partner/delivery/accounts/${id}`),

  partnerCreateAccount: (payload: CreateDeliveryAccountPayload): Promise<any> =>
    axiosClient.post("/partner/delivery/accounts", payload),

  partnerUpdateAccount: (id: string, payload: UpdateDeliveryAccountPayload): Promise<any> =>
    axiosClient.patch(`/partner/delivery/accounts/${id}`, payload),

  partnerDeleteAccount: (id: string): Promise<any> =>
    axiosClient.delete(`/partner/delivery/accounts/${id}`),

  partnerSetDefaultAccount: (id: string): Promise<any> =>
    axiosClient.patch(`/partner/delivery/accounts/${id}/default`),

  partnerGetOrders: (): Promise<any> => axiosClient.get("/partner/delivery/orders"),

  partnerCancelOrder: (
    orderCode: string,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.post(`/partner/delivery/orders/${orderCode}/cancel`, null, {
      params: { carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),

  // --- Admin Accounts & Orders ---
  adminGetAccounts: (): Promise<any> => axiosClient.get("/admin/delivery/accounts"),

  adminGetOrders: (): Promise<any> => axiosClient.get("/admin/delivery/orders"),

  adminGetOrdersByStatus: (status: string): Promise<any> =>
    axiosClient.get(`/admin/delivery/orders/status/${status}`),

  adminCancelOrder: (
    orderCode: string,
    carrier?: string,
    token?: string,
    shopId?: string,
  ): Promise<any> =>
    axiosClient.post(`/admin/delivery/orders/${orderCode}/cancel`, null, {
      params: { carrier },
      headers: token || shopId ? { token, shop_id: shopId } : undefined,
    }),
};
