import {
  DeliveryAccountType,
  DeliveryOrderType,
  ReceiverInfoType,
} from "./delivery.type";

export type ReceiverInfoResponse = ReceiverInfoType;
export type DeliveryAccountResponse = DeliveryAccountType;
export type DeliveryOrderResponse = DeliveryOrderType;

export interface ProvinceResponse {
  ProvinceID: number;
  ProvinceName: string;
  Code?: string;
}

export interface DistrictResponse {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code?: string;
}

export interface WardResponse {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}
