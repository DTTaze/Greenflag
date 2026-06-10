import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminCancelOrderHandler,
  createReceiverHandler,
  deleteReceiverHandler,
  partnerCancelOrderHandler,
  partnerCreateAccountHandler,
  partnerDeleteAccountHandler,
  partnerSetDefaultAccountHandler,
  partnerUpdateAccountHandler,
  previewOrderHandler,
  createOrderHandler,
  createOrderFromTransactionHandler,
  setDefaultReceiverHandler,
  updateReceiverHandler,
} from "@/src/services/delivery/deliveryHandlers";
import {
  CreateDeliveryAccountPayload,
  CreateDeliveryOrderFromTransactionPayload,
  CreateDeliveryOrderPayload,
  CreateReceiverInfoPayload,
  UpdateDeliveryAccountPayload,
  UpdateReceiverInfoPayload,
} from "@/src/types/delivery/delivery.payload";

import {
  adminGetAccountsQueryFn,
  adminGetOrdersByStatusQueryFn,
  adminGetOrdersQueryFn,
  getDistrictsQueryFn,
  getOrderInfoQueryFn,
  getOrdersByBuyerQueryFn,
  getProvincesQueryFn,
  getReceiverByIdQueryFn,
  getReceiversQueryFn,
  getWardsQueryFn,
  partnerGetAccountByIdQueryFn,
  partnerGetAccountsQueryFn,
  partnerGetOrdersQueryFn,
} from "./QueryFnsDelivery";
import { QueryKeysDelivery } from "./QueryKeysDelivery";

// --- Query Hooks ---

export const useReceiversQuery = () => {
  return useQuery({
    queryKey: [QueryKeysDelivery.RECEIVERS],
    queryFn: getReceiversQueryFn,
  });
};

export const useReceiverDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysDelivery.RECEIVER_DETAIL, id],
    queryFn: () => getReceiverByIdQueryFn(id),
    enabled: !!id,
  });
};

export const useProvincesQuery = (
  carrier?: string,
  token?: string,
  shopId?: string,
) => {
  return useQuery({
    queryKey: [QueryKeysDelivery.PROVINCES, carrier, token, shopId],
    queryFn: () => getProvincesQueryFn(carrier, token, shopId),
  });
};

export const useDistrictsQuery = (
  provinceId: number,
  carrier?: string,
  token?: string,
  shopId?: string,
) => {
  return useQuery({
    queryKey: [QueryKeysDelivery.DISTRICTS, provinceId, carrier, token, shopId],
    queryFn: () => getDistrictsQueryFn(provinceId, carrier, token, shopId),
    enabled: !!provinceId,
  });
};

export const useWardsQuery = (
  districtId: number,
  carrier?: string,
  token?: string,
  shopId?: string,
) => {
  return useQuery({
    queryKey: [QueryKeysDelivery.WARDS, districtId, carrier, token, shopId],
    queryFn: () => getWardsQueryFn(districtId, carrier, token, shopId),
    enabled: !!districtId,
  });
};

export const useBuyerOrdersQuery = () => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ORDERS, "buyer"],
    queryFn: getOrdersByBuyerQueryFn,
  });
};

export const useOrderDetailQuery = (
  orderCode: string,
  carrier?: string,
  token?: string,
  shopId?: string,
) => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ORDER_DETAIL, orderCode, carrier, token, shopId],
    queryFn: () => getOrderInfoQueryFn(orderCode, carrier, token, shopId),
    enabled: !!orderCode,
  });
};

export const usePartnerAccountsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ACCOUNTS, "partner"],
    queryFn: partnerGetAccountsQueryFn,
  });
};

export const usePartnerAccountDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ACCOUNT_DETAIL, id],
    queryFn: () => partnerGetAccountByIdQueryFn(id),
    enabled: !!id,
  });
};

export const usePartnerOrdersQuery = () => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ORDERS, "partner"],
    queryFn: partnerGetOrdersQueryFn,
  });
};

export const useAdminAccountsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ACCOUNTS, "admin-all"],
    queryFn: adminGetAccountsQueryFn,
  });
};

export const useAdminOrdersQuery = () => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ORDERS, "admin-all"],
    queryFn: adminGetOrdersQueryFn,
  });
};

export const useAdminOrdersByStatusQuery = (status: string) => {
  return useQuery({
    queryKey: [QueryKeysDelivery.ORDERS, "admin-status", status],
    queryFn: () => adminGetOrdersByStatusQueryFn(status),
    enabled: !!status,
  });
};

// --- Mutation Hooks ---

export const useCreateReceiverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReceiverInfoPayload) => createReceiverHandler(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.RECEIVERS] });
    },
  });
};

export const useUpdateReceiverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReceiverInfoPayload }) =>
      updateReceiverHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.RECEIVERS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.RECEIVER_DETAIL, id] });
    },
  });
};

export const useDeleteReceiverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReceiverHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.RECEIVERS] });
    },
  });
};

export const useSetDefaultReceiverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setDefaultReceiverHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.RECEIVERS] });
    },
  });
};

export const usePreviewOrderMutation = () => {
  return useMutation({
    mutationFn: ({ dto, carrier, token, shopId }: { dto: any; carrier?: string; token?: string; shopId?: string }) =>
      previewOrderHandler(dto, carrier, token, shopId),
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, carrier, token, shopId }: { dto: CreateDeliveryOrderPayload; carrier?: string; token?: string; shopId?: string }) =>
      createOrderHandler(dto, carrier, token, shopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ORDERS] });
    },
  });
};

export const useCreateOrderFromTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      dto,
      carrier,
      token,
      shopId,
    }: {
      transactionId: string;
      dto: CreateDeliveryOrderFromTransactionPayload;
      carrier?: string;
      token?: string;
      shopId?: string;
    }) => createOrderFromTransactionHandler(transactionId, dto, carrier, token, shopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ORDERS] });
    },
  });
};

export const usePartnerCreateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDeliveryAccountPayload) => partnerCreateAccountHandler(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ACCOUNTS] });
    },
  });
};

export const usePartnerUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDeliveryAccountPayload }) =>
      partnerUpdateAccountHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ACCOUNTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ACCOUNT_DETAIL, id] });
    },
  });
};

export const usePartnerDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerDeleteAccountHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ACCOUNTS] });
    },
  });
};

export const usePartnerSetDefaultAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerSetDefaultAccountHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ACCOUNTS] });
    },
  });
};

export const usePartnerCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, carrier, token, shopId }: { orderCode: string; carrier?: string; token?: string; shopId?: string }) =>
      partnerCancelOrderHandler(orderCode, carrier, token, shopId),
    onSuccess: (_, { orderCode, carrier, token, shopId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ORDER_DETAIL, orderCode, carrier, token, shopId] });
    },
  });
};

export const useAdminCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, carrier, token, shopId }: { orderCode: string; carrier?: string; token?: string; shopId?: string }) =>
      adminCancelOrderHandler(orderCode, carrier, token, shopId),
    onSuccess: (_, { orderCode, carrier, token, shopId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysDelivery.ORDER_DETAIL, orderCode, carrier, token, shopId] });
    },
  });
};
