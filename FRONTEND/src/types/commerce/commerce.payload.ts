import {
  ITEM_STATUS,
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_POST_STATUS,
  TRANSACTION_STATUS,
} from "./commerce.type";

export interface CreateProductPayload {
  name: string;
  price: number;
  description?: string;
  category: PRODUCT_CATEGORY;
  product_status?: PRODUCT_CONDITION;
  post_status?: PRODUCT_POST_STATUS;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  description?: string;
  category?: PRODUCT_CATEGORY;
  product_status?: PRODUCT_CONDITION;
  post_status?: PRODUCT_POST_STATUS;
}

export interface CreateItemPayload {
  name: string;
  price: number;
  stock: number;
  description?: string;
  status?: ITEM_STATUS;
  purchase_limit_per_day?: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  images?: string[];
}

export interface UpdateItemPayload {
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  status?: ITEM_STATUS;
  purchase_limit_per_day?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  images?: string[];
}

export interface PurchaseItemPayload {
  name: string;
  quantity: number;
  receiver_information_id?: string;
  to_name: string;
  to_phone: string;
  to_address: string;
}

export interface TransactionDecisionPayload {
  decision: TRANSACTION_STATUS;
}
