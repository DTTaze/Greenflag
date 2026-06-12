import {
  adminGetAccountsHandler,
  adminGetOrdersByStatusHandler,
  adminGetOrdersHandler,
  getDistrictsHandler,
  getOrderInfoHandler,
  getOrdersByBuyerHandler,
  getProvincesHandler,
  getReceiverByIdHandler,
  getReceiversHandler,
  getWardsHandler,
  partnerGetAccountByIdHandler,
  partnerGetAccountsHandler,
  partnerGetOrdersHandler,
} from "@/src/services/delivery/deliveryHandlers";
import {
  DeliveryAccountResponse,
  DeliveryOrderResponse,
  DistrictResponse,
  ProvinceResponse,
  ReceiverInfoResponse,
  WardResponse,
} from "@/src/types/delivery/delivery.response";

export const getReceiversQueryFn = async (): Promise<
  ReceiverInfoResponse[]
> => {
  const response = await getReceiversHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch receivers");
  }
  return response.data;
};

export const getReceiverByIdQueryFn = async (
  id: string,
): Promise<ReceiverInfoResponse> => {
  const response = await getReceiverByIdHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch receiver info");
  }
  return response.data;
};

export const getProvincesQueryFn = async (
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<any> => {
  return getProvincesHandler(carrier, token, shopId);
};

export const getDistrictsQueryFn = async (
  provinceId: number,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<any> => {
  return getDistrictsHandler(provinceId, carrier, token, shopId);
};

export const getWardsQueryFn = async (
  districtId: number,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<any> => {
  return getWardsHandler(districtId, carrier, token, shopId);
};

export const getOrdersByBuyerQueryFn = async (): Promise<
  DeliveryOrderResponse[]
> => {
  const response = await getOrdersByBuyerHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch delivery orders");
  }
  return response.data;
};

export const getOrderInfoQueryFn = async (
  orderCode: string,
  carrier?: string,
  token?: string,
  shopId?: string,
): Promise<DeliveryOrderResponse> => {
  const response = await getOrderInfoHandler(orderCode, carrier, token, shopId);
  if (!response.success) {
    throw new Error(
      response.message || "Failed to fetch delivery order detail",
    );
  }
  return response.data;
};

export const partnerGetAccountsQueryFn = async (): Promise<
  DeliveryAccountResponse[]
> => {
  const response = await partnerGetAccountsHandler();
  if (!response.success) {
    throw new Error(
      response.message || "Failed to fetch partner delivery accounts",
    );
  }
  return response.data;
};

export const partnerGetAccountByIdQueryFn = async (
  id: string,
): Promise<DeliveryAccountResponse> => {
  const response = await partnerGetAccountByIdHandler(id);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch delivery account");
  }
  return response.data;
};

export const partnerGetOrdersQueryFn = async (): Promise<
  DeliveryOrderResponse[]
> => {
  const response = await partnerGetOrdersHandler();
  if (!response.success) {
    throw new Error(
      response.message || "Failed to fetch partner delivery orders",
    );
  }
  return response.data;
};

export const adminGetAccountsQueryFn = async (): Promise<
  DeliveryAccountResponse[]
> => {
  const response = await adminGetAccountsHandler();
  if (!response.success) {
    throw new Error(
      response.message || "Failed to fetch all delivery accounts",
    );
  }
  return response.data;
};

export const adminGetOrdersQueryFn = async (): Promise<
  DeliveryOrderResponse[]
> => {
  const response = await adminGetOrdersHandler();
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch all delivery orders");
  }
  return response.data;
};

export const adminGetOrdersByStatusQueryFn = async (
  status: string,
): Promise<DeliveryOrderResponse[]> => {
  const response = await adminGetOrdersByStatusHandler(status);
  if (!response.success) {
    throw new Error(
      response.message ||
        `Failed to fetch delivery orders with status ${status}`,
    );
  }
  return response.data;
};
