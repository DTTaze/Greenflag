export enum ITEM_STATUS {
  PENDING = "pending",
  AVAILABLE = "available",
  SOLD_OUT = "sold_out",
  SOLD = "sold",
  HIDDEN = "hidden",
  REJECTED = "rejected",
}

export enum PRODUCT_CATEGORY {
  RECYCLED = "recycled",
  HANDICRAFT = "handicraft",
  ORGANIC = "organic",
  PLANTS = "plants",
  OTHER = "other",
}

export enum PRODUCT_CONDITION {
  NEW = "new",
  USED = "used",
}

export enum PRODUCT_POST_STATUS {
  PUBLIC = "public",
  PRIVATE = "private",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum TRANSACTION_STATUS {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export interface ProductType {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  price: number;
  category: PRODUCT_CATEGORY;
  productStatus: PRODUCT_CONDITION;
  postStatus: PRODUCT_POST_STATUS;
  createdAt: string;
  updatedAt: string;
  seller?: any;
  items?: ItemType[];
}

export interface ItemType {
  id: string;
  productId?: string;
  creatorId: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: ITEM_STATUS;
  weight: number;
  length: number;
  width: number;
  height: number;
  purchaseLimitPerDay?: number;
  createdAt: string;
  updatedAt: string;
  product?: ProductType;
  creator?: any;
}

export interface TransactionType {
  id: string;
  receiverInformationId: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  name?: string;
  itemSnapshot: any;
  totalPrice: number;
  quantity: number;
  status: TRANSACTION_STATUS;
  createdAt: string;
  updatedAt: string;
  receiverInformation?: any;
  buyer?: any;
  seller?: any;
  item?: ItemType;
  deliveryOrder?: any;
}
