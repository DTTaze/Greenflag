import { formatDate } from "@/src/utils/formatDate";

export const userColumns = [
  { field: "full_name", headerName: "Họ tên", width: 250 },
  { field: "username", headerName: "Tên người dùng", width: 200 },
  { field: "phone_number", headerName: "SĐT", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "streak", headerName: "Chuỗi", width: 100 },
  {
    field: "avatar_url",
    headerName: "Avatar URL",
    width: 250,
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

export const roleColumns = [
  { field: "name", headerName: "Tên vai trò", width: 230 },
  { field: "description", headerName: "Mô tả", width: 230 },
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

export const permissionColumns = [
  { field: "action", headerName: "Hành động", width: 230 },
  { field: "subject", headerName: "Đối tượng", width: 230 },
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

export const rolesPermissionsColumns = [
  {
    field: "role",
    headerName: "Name",
    width: 250,
    valueGetter: (params: any) => params?.name || "Chưa cập nhật",
  },
  {
    field: "permission",
    headerName: "Subject",
    width: 150,
    valueGetter: (params: any) => params?.subject || "Chưa cập nhật",
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
