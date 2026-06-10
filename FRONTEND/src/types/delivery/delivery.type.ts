export enum CARRIER_TYPE {
  GHN = "ghn",
  GHTK = "ghtk",
  GRAB = "grab",
}

export enum RECEIVER_ACCOUNT_TYPE {
  HOME = "home",
  OFFICE = "office",
}

export enum DELIVERY_ORDER_STATUS {
  READY_TO_PICK = "ready_to_pick",
  PICKING = "picking",
  MONEY_COLLECT_PICKING = "money_collect_picking",
  PICKED = "picked",
  STORING = "storing",
  TRANSPORTING = "transporting",
  SORTING = "sorting",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  MONEY_COLLECT_DELIVERING = "money_collect_delivering",
  DELIVERY_FAIL = "delivery_fail",
  WAITING_TO_RETURN = "waiting_to_return",
  RETURN = "return",
  RETURN_TRANSPORTING = "return_transporting",
  RETURN_SORTING = "return_sorting",
  RETURNING = "returning",
  RETURN_FAIL = "return_fail",
  RETURNED = "returned",
  CANCEL = "cancel",
  EXCEPTION = "exception",
  LOST = "lost",
  DAMAGE = "damage",
}

export interface ReceiverInfoType {
  id: string;
  userId: string;
  toName: string;
  toPhone: string;
  toAddress: string;
  toWardName: string;
  toDistrictName: string;
  toProvinceName: string;
  accountType: RECEIVER_ACCOUNT_TYPE;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAccountType {
  id: string;
  name: string;
  userId: string;
  carrier: CARRIER_TYPE;
  apiConfig?: Record<string, any>;
  isDefault: boolean;
}

export interface DeliveryOrderType {
  id: string;
  transactionId: string;
  sellerId: string;
  buyerId?: string;
  deliveryAccountId?: string;
  orderCode?: string;
  status: DELIVERY_ORDER_STATUS;
  toName: string;
  toPhone: string;
  toAddress: string;
  isPrinted: boolean;
  createdDate?: string;
  codAmount: number;
  weight: number;
  paymentTypeId: number;
  totalAmount: number;
  itemSnapshot?: any;
  transaction?: any;
  seller?: any;
  buyer?: any;
  deliveryAccount?: DeliveryAccountType;
}
