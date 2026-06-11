import { UserType } from "../user/user.type";

export enum DeliveryOrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface AdminDeliveryAccountDTO {
  id: string;
  partnerName: string;
  carrierType: "GHN" | "GHTK" | "OTHER";
  apiKey?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDeliveryOrderDTO {
  id: string;
  orderCode: string;
  userId: string;
  user?: UserType;
  carrier: string;
  trackingNumber?: string;
  status: DeliveryOrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}
