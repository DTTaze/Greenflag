import { CARRIER_TYPE, RECEIVER_ACCOUNT_TYPE } from "./delivery.type";

export interface CreateReceiverInfoPayload {
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_name: string;
  to_district_name: string;
  to_province_name: string;
  account_type?: RECEIVER_ACCOUNT_TYPE;
  is_default?: boolean;
}

export interface UpdateReceiverInfoPayload {
  to_name?: string;
  to_phone?: string;
  to_address?: string;
  to_ward_name?: string;
  to_district_name?: string;
  to_province_name?: string;
  account_type?: RECEIVER_ACCOUNT_TYPE;
  is_default?: boolean;
}

export interface CreateDeliveryAccountPayload {
  name: string;
  carrier?: CARRIER_TYPE;
  token: string;
  shop_id: string;
  is_default?: boolean;
}

export interface UpdateDeliveryAccountPayload {
  name?: string;
  carrier?: CARRIER_TYPE;
  token?: string;
  shop_id?: string;
  is_default?: boolean;
}

export interface CreateDeliveryOrderPayload {
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_name: string;
  to_district_name: string;
  to_province_name: string;
  cod_amount?: number;
  weight: number;
  payment_type_id: number;
  required_note?: string;
  service_type_id?: number;
}

export interface CreateDeliveryOrderFromTransactionPayload {
  payment_type_id: number;
  required_note: string;
  weight: number;
}

export interface UpdateDeliveryOrderPayload {
  order_code: string;
  to_name?: string;
  to_phone?: string;
  to_address?: string;
  weight?: number;
  payment_type_id?: number;
}
