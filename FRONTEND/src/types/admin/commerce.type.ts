import { UserType } from "../user/user.type";

export interface AdminProductDTO {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rewardPoints: number;
  stock: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  rewardPoints?: number;
  stock?: number;
}

export interface AdminItemDTO {
  id: string;
  productId: string;
  name: string;
  description: string;
  stock: number;
  pointsRequired: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateItemDTO {
  name?: string;
  description?: string;
  stock?: number;
  pointsRequired?: number;
}

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export interface AdminTransactionDTO {
  id: string;
  userId: string;
  user?: UserType;
  items: TransactionItemDTO[];
  status: TransactionStatus;
  totalPoints: number;
  shippingAddress?: string;
  deliveryInfo?: DeliveryInfoDTO;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItemDTO {
  id: string;
  itemId: string;
  quantity: number;
  pointsPerUnit: number;
  item?: AdminItemDTO;
}

export interface DeliveryInfoDTO {
  carrier: string;
  trackingNumber?: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

export interface TransactionDecisionDTO {
  status: TransactionStatus;
  reason?: string;
}

export interface InventoryItemDTO {
  id: string;
  name: string;
  category: string;
  description: string;
  stock: number;
  pointsRequired: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDTO {
  id: string;
  userId: string;
  items: OrderItemDTO[];
  status: OrderStatus;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
  user?: UserType;
}

export interface OrderItemDTO {
  id: string;
  inventoryItemId: string;
  quantity: number;
  pointsPerUnit: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
