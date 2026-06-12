import React from "react";
import { formatDate } from "@/src/utils/formatDate";
import {
  STATUS_MAP,
  DIFFICULTY_MAP,
  CATEGORY_MAP,
  P2P_STATUS_MAP,
} from "@/src/constants/enumMaps";

export const taskColumns = [
  { field: "title", headerName: "Tiêu đề", width: 230 },
  { field: "description", headerName: "Mô tả", width: 230 },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 120,
    render: (value: any, row: any) => {
      const val = String(row.status || value || "").toUpperCase();
      const statusUi = STATUS_MAP[val] || {
        label: row.status || "Không xác định",
        color: "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400",
      };
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusUi.color}`}
        >
          {statusUi.label}
        </span>
      );
    },
  },
  { field: "coins", headerName: "Xu thưởng", width: 120 },
  {
    field: "difficulty",
    headerName: "Độ khó",
    width: 120,
    render: (value: any, row: any) => {
      const val = String(row.difficulty || value || "").toUpperCase();
      const diffUi = DIFFICULTY_MAP[val] || {
        label: row.difficulty || "Không xác định",
        color: "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400",
      };
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${diffUi.color}`}
        >
          {diffUi.label}
        </span>
      );
    },
  },
  { field: "total", headerName: "Tổng tiến trình", width: 120 },
  {
    field: "creator",
    headerName: "Người tạo",
    width: 150,
    valueGetter: (_value: any, row: any) =>
      row.creator?.profile?.fullName || row.creator?.username || "--",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.updated_at || row.updatedAt),
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.created_at || row.createdAt),
  },
  {
    field: "deletedAt",
    headerName: "Ngày xóa",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.deletedAt || row.deleted_at),
  },
];

export const itemColumns = [
  { field: "name", headerName: "Tên vật phẩm", width: 200 },
  { field: "description", headerName: "Mô tả", width: 300 },
  { field: "price", headerName: "Giá (xu)", width: 120 },
  { field: "stock", headerName: "Tồn kho", width: 120 },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 120,
    render: (value: any, row: any) => {
      const val = String(row.status || value || "").toUpperCase();
      const statusUi = STATUS_MAP[val] || {
        label: row.status || "Không xác định",
        color: "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400",
      };
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusUi.color}`}
        >
          {statusUi.label}
        </span>
      );
    },
  },
  { field: "weight", headerName: "Cân nặng (g)", width: 120 },
  { field: "length", headerName: "Chiều dài (cm)", width: 120 },
  { field: "width", headerName: "Chiều rộng (cm)", width: 120 },
  { field: "height", headerName: "Chiều cao (cm)", width: 120 },
  {
    field: "creator",
    headerName: "Tài khoản cung cấp",
    width: 150,
    valueGetter: (params: any) =>
      params?.username || params?.email || "Chưa cập nhật",
  },
  {
    field: "purchase_limit_per_day",
    headerName: "Giới hạn lượt mua/ngày",
    width: 200,
    valueGetter: (params: any) => params || "Không giới hạn",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.updated_at || row.updatedAt),
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.created_at || row.createdAt),
  },
  {
    field: "deletedAt",
    headerName: "Ngày xóa",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.deletedAt || row.deleted_at),
  },
];

export const productColumns = [
  { field: "name", headerName: "Tên sản phẩm", width: 200 },
  { field: "description", headerName: "Mô tả", width: 300 },
  {
    field: "category",
    headerName: "Danh mục",
    width: 150,
    render: (value: any, row: any) => {
      const val = String(row.category || value || "");
      const catUi = CATEGORY_MAP[val] || {
        label: row.category || "Không xác định",
        color: "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400",
      };
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${catUi.color}`}
        >
          {catUi.label}
        </span>
      );
    },
  },
  { field: "price", headerName: "Giá (VNĐ)", width: 120 },
  {
    field: "productStatus",
    headerName: "Tình trạng sản phẩm",
    width: 150,
    render: (value: any, row: any) => {
      const val = String(row.productStatus || row.product_status || value || "").toUpperCase();
      let label = row.productStatus || row.product_status || value || "Mới";
      let color =
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      if (val === "USED" || val === "CŨ") {
        label = "Cũ";
        color =
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      }
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${color}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    field: "postStatus",
    headerName: "Trạng thái bài đăng",
    width: 150,
    render: (value: any, row: any) => {
      const val = String(row.postStatus || row.post_status || value || "").toUpperCase();
      const statusUi = P2P_STATUS_MAP[val] || {
        label: row.postStatus || row.post_status || "Không xác định",
        color: "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400",
      };
      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusUi.color}`}
        >
          {statusUi.label}
        </span>
      );
    },
  },
  {
    field: "seller",
    headerName: "Người bán",
    width: 150,
    valueGetter: (_value: any, row: any) =>
      row.seller?.profile?.fullName || row.seller?.email || "--",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.updated_at || row.updatedAt),
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.created_at || row.createdAt),
  },
  {
    field: "deletedAt",
    headerName: "Ngày xóa",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.deletedAt || row.deleted_at),
  },
];
