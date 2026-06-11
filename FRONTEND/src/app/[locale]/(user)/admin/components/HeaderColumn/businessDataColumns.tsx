import React from "react";
import { formatDate } from "@/src/utils/formatDate";
import {
  TRANSACTION_STATUS_MAP,
  DELIVERY_STATUS_MAP,
  STATUS_MAP,
} from "@/src/constants/enumMaps";

export const transactionsColumns = [
  { field: "name", headerName: "Tên giao dịch", width: 200 },
  {
    field: "buyer",
    headerName: "Tên tài khoản người mua",
    width: 200,
    valueGetter: (params: any) =>
      params?.username || params?.email || "Chưa cập nhật",
  },
  {
    field: "item_snapshot",
    headerName: "Tên tài khoản người bán",
    width: 200,
    valueGetter: (params: any) =>
      params?.creator?.username || params?.creator?.email || "Chưa cập nhật",
  },
  { field: "total_price", headerName: "Tổng giá trị (xu)", width: 150 },
  { field: "quantity", headerName: "Số lượng sản phẩm", width: 150 },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    render: (value: any, row: any) => {
      const statusVal = String(row.status || value || "").toUpperCase();
      const statusUi = TRANSACTION_STATUS_MAP[statusVal] || {
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
];

export const ordersColumns = [
  { field: "order_code", headerName: "Mã vận chuyển", width: 200 },
  {
    field: "to_name",
    headerName: "Tên người nhận",
    width: 200,
  },
  {
    field: "to_phone",
    headerName: "SĐT người nhận",
    width: 200,
  },
  {
    field: "to_address",
    headerName: "Địa chỉ người nhận",
    width: 200,
  },
  {
    field: "cod_amount",
    headerName: "Phí COD",
    width: 200,
  },
  { field: "weight", headerName: "Tổng cân nặng (g)", width: 150 },
  { field: "total_amount", headerName: "Tổng phí (VNĐ)", width: 150 },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    render: (value: any, row: any) => {
      const statusVal = String(row.status || value || "").toUpperCase();
      const statusUi = DELIVERY_STATUS_MAP[statusVal] || {
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
];

export const eventsColumns = [
  { field: "title", headerName: "Tên sự kiện", width: 200 },
  {
    field: "creator",
    headerName: "Tên tài khoản người tạo",
    width: 200,
    valueGetter: (params: any) =>
      params?.username || params?.email || "Chưa cập nhật",
  },
  { field: "description", headerName: "Mô tả", width: 150 },
  {
    field: "location",
    headerName: "Địa điểm tổ chức",
    width: 200,
  },
  { field: "capacity", headerName: "Hạn mức tham gia", width: 150 },
  { field: "coins", headerName: "Số xu nhận được", width: 150 },
  {
    field: "end_sign",
    headerName: "Hạn chót đăng kí",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.end_sign || row.endSign),
  },
  {
    field: "start_time",
    headerName: "Ngày bắt đầu",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.start_time || row.startTime),
  },
  {
    field: "end_time",
    headerName: "Ngày kết thúc",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.end_time || row.endTime),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    render: (value: any, row: any) => {
      const statusVal = String(row.status || value || "").toUpperCase();
      const statusUi = STATUS_MAP[statusVal] || {
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
