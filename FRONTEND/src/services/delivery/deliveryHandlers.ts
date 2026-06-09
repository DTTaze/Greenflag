import { ApiResponse } from "@/src/types/api";
import {
  CreateDeliveryAccountPayload,
  CreateDeliveryOrderFromTransactionPayload,
  CreateDeliveryOrderPayload,
  CreateReceiverInfoPayload,
  UpdateDeliveryAccountPayload,
  UpdateReceiverInfoPayload,
} from "@/src/types/delivery/delivery.payload";
import {
  DeliveryAccountResponse,
  DeliveryOrderResponse,
  DistrictResponse,
  ProvinceResponse,
  ReceiverInfoResponse,
  WardResponse,
} from "@/src/types/delivery/delivery.response";

import { deliveryServices } from ".";

// --- Receiver Info Handlers ---

export const getReceiversHandler = async (): Promise<
  ApiResponse<ReceiverInfoResponse[]>
> => {
  return deliveryServices.getReceivers();
};

export const getReceiverByIdHandler = async (
  id: string,
): Promise<ApiResponse<ReceiverInfoResponse>> => {
  return deliveryServices.getReceiverById(id);
};

export const createReceiverHandler = async (
  payload: CreateReceiverInfoPayload,
): Promise<ApiResponse<ReceiverInfoResponse>> => {
  return deliveryServices.createReceiver(payload);
};

export const updateReceiverHandler = async (
  id: string,
  payload: UpdateReceiverInfoPayload,
): Promise<ApiResponse<ReceiverInfoResponse>> => {
  return deliveryServices.updateReceiver(id, payload);
};

export const deleteReceiverHandler = async (id: string): Promise<ApiResponse<void>> => {
  return deliveryServices.deleteReceiver(id);
};

export const setDefaultReceiverHandler = async (
  id: string,
): Promise<ApiResponse<ReceiverInfoResponse>> => {
  return deliveryServices.setDefaultReceiver(id);
};

// --- Locations Handlers ---

export const getProvincesHandler = async (
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<ProvinceResponse[]>> => {
  return deliveryServices.getProvinces(carrier, token, shopId);
};

export const getDistrictsHandler = async (
  provinceId: number,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<DistrictResponse[]>> => {
  return deliveryServices.getDistricts(provinceId, carrier, token, shopId);
};

export const getWardsHandler = async (
  districtId: number,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<WardResponse[]>> => {
  return deliveryServices.getWards(districtId, carrier, token, shopId);
};

// --- Order Handlers ---

export const previewOrderHandler = async (
  dto: any,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<any>> => {
  return deliveryServices.previewOrder(dto, carrier, token, shopId);
};

export const createOrderHandler = async (
  dto: CreateDeliveryOrderPayload,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<DeliveryOrderResponse>> => {
  return deliveryServices.createOrder(dto, carrier, token, shopId);
};

export const createOrderFromTransactionHandler = async (
  transactionId: string,
  dto: CreateDeliveryOrderFromTransactionPayload,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<DeliveryOrderResponse>> => {
  return deliveryServices.createOrderFromTransaction(
    transactionId,
    dto,
    carrier,
    token,
    shopId,
  );
};

export const getOrderInfoHandler = async (
  orderCode: string,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<DeliveryOrderResponse>> => {
  return deliveryServices.getOrderInfo(orderCode, carrier, token, shopId);
};

export const getOrdersByBuyerHandler = async (): Promise<
  ApiResponse<DeliveryOrderResponse[]>
> => {
  return deliveryServices.getOrdersByBuyer();
};

// --- Partner Handlers ---

export const partnerGetAccountsHandler = async (): Promise<
  ApiResponse<DeliveryAccountResponse[]>
> => {
  return deliveryServices.partnerGetAccounts();
};

export const partnerGetAccountByIdHandler = async (
  id: string,
): Promise<ApiResponse<DeliveryAccountResponse>> => {
  return deliveryServices.partnerGetAccountById(id);
};

export const partnerCreateAccountHandler = async (
  payload: CreateDeliveryAccountPayload,
): Promise<ApiResponse<DeliveryAccountResponse>> => {
  return deliveryServices.partnerCreateAccount(payload);
};

export const partnerUpdateAccountHandler = async (
  id: string,
  payload: UpdateDeliveryAccountPayload,
): Promise<ApiResponse<DeliveryAccountResponse>> => {
  return deliveryServices.partnerUpdateAccount(id, payload);
};

export const partnerDeleteAccountHandler = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return deliveryServices.partnerDeleteAccount(id);
};

export const partnerSetDefaultAccountHandler = async (
  id: string,
): Promise<ApiResponse<DeliveryAccountResponse>> => {
  return deliveryServices.partnerSetDefaultAccount(id);
};

export const partnerGetOrdersHandler = async (): Promise<
  ApiResponse<DeliveryOrderResponse[]>
> => {
  return deliveryServices.partnerGetOrders();
};

export const partnerCancelOrderHandler = async (
  orderCode: string,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<any>> => {
  return deliveryServices.partnerCancelOrder(orderCode, carrier, token, shopId);
};

// --- Admin Handlers ---

export const adminGetAccountsHandler = async (): Promise<
  ApiResponse<DeliveryAccountResponse[]>
> => {
  return deliveryServices.adminGetAccounts();
};

export const adminGetOrdersHandler = async (): Promise<
  ApiResponse<DeliveryOrderResponse[]>
> => {
  return deliveryServices.adminGetOrders();
};

export const adminGetOrdersByStatusHandler = async (
  status: string,
): Promise<ApiResponse<DeliveryOrderResponse[]>> => {
  return deliveryServices.adminGetOrdersByStatus(status);
};

export const adminCancelOrderHandler = async (
  orderCode: string,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<ApiResponse<any>> => {
  return deliveryServices.adminCancelOrder(orderCode, carrier, token, shopId);
};
