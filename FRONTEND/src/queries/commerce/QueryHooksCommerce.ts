import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  adminCancelTransactionHandler,
  adminDeleteItemHandler,
  adminDeleteProductHandler,
  adminMakeTransactionDecisionHandler,
  adminUpdateItemHandler,
  adminUpdateProductHandler,
  cancelTransactionHandler,
  partnerCreateItemHandler,
  partnerCreateProductHandler,
  partnerDeleteItemHandler,
  partnerDeleteProductHandler,
  partnerMakeTransactionDecisionHandler,
  partnerUpdateItemHandler,
  partnerUpdateProductHandler,
  purchaseItemHandler,
} from "@/src/services/commerce/commerceHandlers";
import {
  CreateItemPayload,
  CreateProductPayload,
  PurchaseItemPayload,
  UpdateItemPayload,
  UpdateProductPayload,
} from "@/src/types/commerce/commerce.payload";

import {
  adminGetAllTransactionsQueryFn,
  adminGetTransactionsByStatusQueryFn,
  getBuyerTransactionsQueryFn,
  getItemByIdQueryFn,
  getItemsQueryFn,
  getProductByIdQueryFn,
  getProductsQueryFn,
  getTransactionByIdQueryFn,
  partnerGetTransactionsQueryFn,
} from "./QueryFnsCommerce";
import { QueryKeysCommerce } from "./QueryKeysCommerce";

// --- Query Hooks ---

export const useProductsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysCommerce.PRODUCTS],
    queryFn: getProductsQueryFn,
  });
};

export const useProductDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysCommerce.PRODUCT_DETAIL, id],
    queryFn: () => getProductByIdQueryFn(id),
    enabled: !!id,
  });
};

export const useItemsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysCommerce.ITEMS],
    queryFn: getItemsQueryFn,
  });
};

export const useItemDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysCommerce.ITEM_DETAIL, id],
    queryFn: () => getItemByIdQueryFn(id),
    enabled: !!id,
  });
};

export const useBuyerTransactionsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysCommerce.TRANSACTIONS, "buyer"],
    queryFn: getBuyerTransactionsQueryFn,
  });
};

export const useTransactionDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysCommerce.TRANSACTION_DETAIL, id],
    queryFn: () => getTransactionByIdQueryFn(id),
    enabled: !!id,
  });
};

export const usePartnerTransactionsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysCommerce.TRANSACTIONS, "partner"],
    queryFn: partnerGetTransactionsQueryFn,
  });
};

export const useAdminTransactionsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysCommerce.TRANSACTIONS, "admin-all"],
    queryFn: adminGetAllTransactionsQueryFn,
  });
};

export const useAdminTransactionsByStatusQuery = (status: string) => {
  return useQuery({
    queryKey: [QueryKeysCommerce.TRANSACTIONS, "admin-status", status],
    queryFn: () => adminGetTransactionsByStatusQueryFn(status),
    enabled: !!status,
  });
};

// --- Mutation Hooks ---

export const usePurchaseItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: PurchaseItemPayload;
    }) => purchaseItemHandler(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.ITEMS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTIONS],
      });
    },
  });
};

export const useCancelTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelTransactionHandler(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTION_DETAIL, id],
      });
    },
  });
};

export const usePartnerCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      partnerCreateProductHandler(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.PRODUCTS] });
    },
  });
};

export const usePartnerUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => partnerUpdateProductHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.PRODUCTS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.PRODUCT_DETAIL, id],
      });
    },
  });
};

export const usePartnerDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerDeleteProductHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.PRODUCTS] });
    },
  });
};

export const usePartnerCreateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateItemPayload) =>
      partnerCreateItemHandler(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.ITEMS] });
    },
  });
};

export const usePartnerUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateItemPayload }) =>
      partnerUpdateItemHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.ITEMS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.ITEM_DETAIL, id],
      });
    },
  });
};

export const usePartnerDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerDeleteItemHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.ITEMS] });
    },
  });
};

export const usePartnerMakeDecisionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: string }) =>
      partnerMakeTransactionDecisionHandler(id, decision),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTION_DETAIL, id],
      });
    },
  });
};

export const useAdminUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => adminUpdateProductHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.PRODUCTS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.PRODUCT_DETAIL, id],
      });
    },
  });
};

export const useAdminDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteProductHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.PRODUCTS] });
    },
  });
};

export const useAdminUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateItemPayload }) =>
      adminUpdateItemHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.ITEMS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.ITEM_DETAIL, id],
      });
    },
  });
};

export const useAdminDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteItemHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysCommerce.ITEMS] });
    },
  });
};

export const useAdminMakeDecisionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: string }) =>
      adminMakeTransactionDecisionHandler(id, decision),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTION_DETAIL, id],
      });
    },
  });
};

export const useAdminCancelTransactionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCancelTransactionHandler(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeysCommerce.TRANSACTION_DETAIL, id],
      });
    },
  });
};
