export interface MapDetail {
  label: string;
  color: string;
}

export const TRANSACTION_STATUS_MAP: Record<string, MapDetail> = {
  PENDING: {
    label: "Chờ xử lý",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  pending: {
    label: "Chờ xử lý",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  APPROVED: {
    label: "Thành công",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  approved: {
    label: "Thành công",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  ACCEPTED: {
    label: "Thành công",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  accepted: {
    label: "Thành công",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Bị từ chối",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  rejected: {
    label: "Bị từ chối",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

export const P2P_STATUS_MAP: Record<string, MapDetail> = {
  public: {
    label: "Công khai",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  PUBLIC: {
    label: "Công khai",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  private: {
    label: "Riêng tư",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  PRIVATE: {
    label: "Riêng tư",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  pending: {
    label: "Chờ duyệt",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  PENDING: {
    label: "Chờ duyệt",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  rejected: {
    label: "Bị từ chối",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  REJECTED: {
    label: "Bị từ chối",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export const EVENT_STATUS_MAP: Record<string, MapDetail> = {
  upcoming: {
    label: "Sắp diễn ra",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  UPCOMING: {
    label: "Sắp diễn ra",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  ongoing: {
    label: "Đang diễn ra",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  ONGOING: {
    label: "Đang diễn ra",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  finished: {
    label: "Đã kết thúc",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  FINISHED: {
    label: "Đã kết thúc",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

export const DELIVERY_STATUS_MAP: Record<string, MapDetail> = {
  PENDING: {
    label: "Chờ lấy hàng",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  SHIPPING: {
    label: "Đang giao",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  DELIVERED: {
    label: "Đã giao",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export const DIFFICULTY_MAP: Record<string, MapDetail> = {
  EASY: {
    label: "Dễ",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  MEDIUM: {
    label: "Trung bình",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  HARD: {
    label: "Khó",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
};

export const STATUS_MAP: Record<string, MapDetail> = {
  PENDING: {
    label: "Chờ duyệt",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  pending: {
    label: "Chờ duyệt",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  APPROVED: {
    label: "Đã duyệt",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  approved: {
    label: "Đã duyệt",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Từ chối",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  rejected: {
    label: "Từ chối",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  // Task visibility
  PUBLIC: {
    label: "Công khai",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  PRIVATE: {
    label: "Riêng tư",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  // Item status mapping
  AVAILABLE: {
    label: "Còn hàng",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  available: {
    label: "Còn hàng",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  SOLD_OUT: {
    label: "Hết hàng",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  sold_out: {
    label: "Hết hàng",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  SOLD: {
    label: "Đã bán",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  sold: {
    label: "Đã bán",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  HIDDEN: {
    label: "Ẩn",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  hidden: {
    label: "Ẩn",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

export const CATEGORY_MAP: Record<string, MapDetail> = {
  recycled: {
    label: "Tái chế",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  organic: {
    label: "Hữu cơ",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  handicraft: {
    label: "Thủ công",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  plants: {
    label: "Cây cảnh",
    color:
      "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  },
  other: {
    label: "Khác",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
  RECYCLED: {
    label: "Tái chế",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  ORGANIC: {
    label: "Hữu cơ",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  HANDICRAFT: {
    label: "Thủ công",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  PLANTS: {
    label: "Cây cảnh",
    color:
      "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  },
  OTHER: {
    label: "Khác",
    color: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400",
  },
};
