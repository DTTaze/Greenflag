export const statusStyles: Record<string, string> = {
  ready_to_pick:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  picking: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  money_collect_picking:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  picked: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  storing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  transporting:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  sorting: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  delivering:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  delivered:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  money_collect_delivering:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  delivery_fail: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  waiting_to_return:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  return:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  return_transporting:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  return_sorting:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  returning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  return_fail: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  returned:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  cancel: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  exception: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  damage: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
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
      public_id: tx.public_id || tx.publicId,
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
      item_snapshot: tx.item_snapshot || tx.itemSnapshot,
      quantity: tx.quantity,
      total_price: tx.total_price || tx.totalPrice,
      created_at: tx.created_at || tx.createdAt,
      shipping_info: tx.shipping_info || tx.shippingInfo || null,
    };
  } else {
    const orderCode = tx.orderCode || tx.order_code;
    const toAddress = tx.toAddress || tx.to_address;
    const toName = tx.toName || tx.to_name;
    const toPhone = tx.toPhone || tx.to_phone;
    const codAmount = tx.codAmount ?? tx.cod_amount;
    const weight = tx.weight;
    const totalAmount = tx.totalAmount ?? tx.total_amount;
    const createdDate =
      tx.createdDate || tx.created_date || tx.created_at || tx.createdAt;

    return {
      id: `shipping-${tx.id}`,
      public_id: orderCode,
      status: tx.status,
      status_label: statusLabels[tx.status] || tx.status,
      item_snapshot: {
        name: "Đơn hàng vận chuyển",
        price: totalAmount,
        creator: { full_name: "Không xác định" },
        public_id: orderCode,
        description: `Địa chỉ giao hàng: ${toAddress}`,
        image_url: "/placeholder-image.jpg",
      },
      quantity: 1,
      total_price: totalAmount,
      created_at: createdDate,
      shipping_info: {
        carrier: "Không xác định",
        tracking_number: orderCode,
        estimated_delivery: createdDate,
        to_name: toName,
        to_phone: toPhone,
        to_address: toAddress,
        cod_amount: codAmount,
        weight: weight,
      },
    };
  }
};
