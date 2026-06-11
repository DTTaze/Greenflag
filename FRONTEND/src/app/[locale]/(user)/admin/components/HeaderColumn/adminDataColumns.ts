const formatDateValue = (params: any): string => {
  if (!params) return "N/A";
  const date = new Date(params);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("vi-VN");
};

export const userColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "public_id", headerName: "ID công khai", width: 200 },
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
    valueGetter: formatDateValue,
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: formatDateValue,
  },
];

export const roleColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Tên vai trò", width: 230 },
  { field: "description", headerName: "Mô tả", width: 230 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: formatDateValue,
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: formatDateValue,
  },
];

export const permissionColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "action", headerName: "Hành động", width: 230 },
  { field: "subject", headerName: "Đối tượng", width: 230 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: formatDateValue,
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: formatDateValue,
  },
];

export const rolesPermissionsColumns = [
  { field: "id", headerName: "ID", width: 100 },
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
    valueGetter: formatDateValue,
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: formatDateValue,
  },
];
