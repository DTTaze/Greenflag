import React from "react";

import {
  DELIVERY_STATUS_MAP,
  EVENT_STATUS_MAP,
  TRANSACTION_STATUS_MAP,
} from "@/src/constants/enumMaps";
import { formatDate } from "@/src/utils/formatDate";

export const transactionsColumns = [
  { field: "name", headerName: "Tên giao dịch", width: 200 },
  {
    field: "buyer",
    headerName: "Người mua",
    width: 200,
    valueGetter: (value: any, row: any) =>
      row.buyer?.profile?.fullName ||
      row.buyer?.username ||
      row.buyer?.email ||
      "",
    render: (value: any, row: any) => {
      if (!row.buyer) return <span className="text-gray-400 italic">--</span>;
      return (
        <span className="font-medium text-gray-900 dark:text-zinc-100">
          {value}
        </span>
      );
    },
  },
  {
    field: "seller",
    headerName: "Người bán",
    width: 200,
    valueGetter: (value: any, row: any) =>
      row.seller?.profile?.fullName ||
      row.seller?.username ||
      row.seller?.email ||
      "",
    render: (value: any, row: any) => {
      if (!row.seller) return <span className="text-gray-400 italic">--</span>;
      return (
        <span className="font-medium text-gray-900 dark:text-zinc-100">
          {value}
        </span>
      );
    },
  },
  {
    field: "totalPrice",
    headerName: "Tổng giá trị (xu)",
    width: 150,
    valueGetter: (value: any, row: any) =>
      row.totalPrice ?? row.total_price ?? 0,
  },
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
  {
    field: "orderCode",
    headerName: "Mã vận chuyển",
    width: 200,
    valueGetter: (value: any, row: any) => row.orderCode || row.order_code,
  },
  {
    field: "toName",
    headerName: "Tên người nhận",
    width: 200,
    valueGetter: (value: any, row: any) => row.toName || row.to_name,
  },
  {
    field: "toPhone",
    headerName: "SĐT người nhận",
    width: 200,
    valueGetter: (value: any, row: any) => row.toPhone || row.to_phone,
  },
  {
    field: "toAddress",
    headerName: "Địa chỉ người nhận",
    width: 200,
    valueGetter: (value: any, row: any) => row.toAddress || row.to_address,
  },
  {
    field: "codAmount",
    headerName: "Phí COD",
    width: 200,
    valueGetter: (value: any, row: any) => row.codAmount ?? row.cod_amount,
  },
  {
    field: "weight",
    headerName: "Tổng cân nặng (g)",
    width: 150,
    valueGetter: (value: any, row: any) => row.weight,
  },
  {
    field: "totalAmount",
    headerName: "Tổng phí (VNĐ)",
    width: 150,
    valueGetter: (value: any, row: any) => row.totalAmount ?? row.total_amount,
  },
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
    field: "updatedAt",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(row.updatedAt || row.updated_at || row.updatedDate),
  },
  {
    field: "createdDate",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (_value: any, row: any) =>
      formatDate(
        row.createdDate || row.created_date || row.createdAt || row.created_at,
      ),
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
      const statusUi = EVENT_STATUS_MAP[statusVal] || {
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
