export const statusStyles: Record<string, string> = {
  ready_to_pick: "bg-blue-100 text-blue-800",
  picking: "bg-blue-100 text-blue-800",
  money_collect_picking: "bg-blue-100 text-blue-800",
  picked: "bg-blue-100 text-blue-800",
  storing: "bg-blue-100 text-blue-800",
  transporting: "bg-blue-100 text-blue-800",
  sorting: "bg-blue-100 text-blue-800",
  delivering: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
  money_collect_delivering: "bg-purple-100 text-purple-800",
  delivery_fail: "bg-red-100 text-red-800",
  waiting_to_return: "bg-yellow-100 text-yellow-800",
  return: "bg-yellow-100 text-yellow-800",
  return_transporting: "bg-yellow-100 text-yellow-800",
  return_sorting: "bg-yellow-100 text-yellow-800",
  returning: "bg-yellow-100 text-yellow-800",
  return_fail: "bg-red-100 text-red-800",
  returned: "bg-yellow-100 text-yellow-800",
  cancel: "bg-red-100 text-red-800",
  exception: "bg-red-100 text-red-800",
  lost: "bg-red-100 text-red-800",
  damage: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  ready_to_pick: "Chờ lấy hàng",
  picking: "Đang lấy hàng",
  money_collect_picking: "Đang tương tác với người gửi",
  picked: "Lấy hàng thành công",
  storing: "Nhập kho",
  transporting: "Đang trung chuyển",
  sorting: "Đang phân loại",
  delivering: "Đang giao hàng",
  delivered: "Giao hàng thành công",
  money_collect_delivering: "Đang tương tác với người nhận",
  delivery_fail: "Giao hàng không thành công",
  waiting_to_return: "Chờ xác nhận giao lại",
  return: "Chuyển hoàn",
  return_transporting: "Đang trung chuyển hàng hoàn",
  return_sorting: "Đang phân loại hàng hoàn",
  returning: "Đang hoàn hàng",
  return_fail: "Hoàn hàng không thành công",
  returned: "Hoàn hàng thành công",
  cancel: "Đơn hủy",
  exception: "Hàng ngoại lệ",
  lost: "Hàng thất lạc",
  damage: "Hàng hư hỏng",
};

export const statusToTab: Record<string, string> = {
  pending: "pending",
  ready_to_pick: "shipping",
  picking: "shipping",
  money_collect_picking: "shipping",
  picked: "shipping",
  storing: "shipping",
  transporting: "shipping",
  sorting: "shipping",
  delivering: "delivered",
  delivered: "completed",
  money_collect_delivering: "delivered",
  delivery_fail: "delivered",
  waiting_to_return: "delivered",
  return: "cancelled",
  return_transporting: "cancelled",
  return_sorting: "cancelled",
  returning: "cancelled",
  return_fail: "cancelled",
  returned: "cancelled",
  cancel: "cancelled",
  exception: "cancelled",
  lost: "cancelled",
  damage: "cancelled",
  cancelled: "cancelled",
};

export const normalizeTransaction = (tx: any, source: string) => {
  if (source === "transaction") {
    return {
      id: `transaction-${tx.id}`,
      public_id: tx.public_id,
      status:
        tx.status === "accepted"
          ? "pending"
          : tx.status === "rejected"
            ? "cancel"
            : tx.status,
      status_label:
        statusLabels[
          tx.status === "accepted"
            ? "pending"
            : tx.status === "rejected"
              ? "cancel"
              : tx.status
        ] || tx.status,
      item_snapshot: tx.item_snapshot,
      quantity: tx.quantity,
      total_price: tx.total_price,
      created_at: tx.created_at,
      shipping_info: tx.shipping_info || null,
    };
  } else {
    return {
      id: `shipping-${tx.id}`,
      public_id: tx.order_code,
      status: tx.status,
      status_label: statusLabels[tx.status] || tx.status,
      item_snapshot: {
        name: "Đơn hàng vận chuyển",
        price: tx.total_amount,
        creator: { full_name: "Không xác định" },
        public_id: tx.order_code,
        description: `Địa chỉ giao hàng: ${tx.to_address}`,
        image_url: "/placeholder-image.jpg",
      },
      quantity: 1,
      total_price: tx.total_amount,
      created_at: tx.created_date,
      shipping_info: {
        carrier: "Không xác định",
        tracking_number: tx.order_code,
        estimated_delivery: tx.created_date,
        to_name: tx.to_name,
        to_phone: tx.to_phone,
        to_address: tx.to_address,
        cod_amount: tx.cod_amount,
        weight: tx.weight,
      },
    };
  }
};
