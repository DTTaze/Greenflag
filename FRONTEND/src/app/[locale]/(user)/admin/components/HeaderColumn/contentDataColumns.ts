const formatDateValue = (params: any): string => {
  if (!params) return "N/A";
  const date = new Date(params);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("vi-VN");
};

export const taskColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "public_id", headerName: "ID công khai", width: 200 },
  { field: "title", headerName: "Tiêu đề", width: 230 },
  { field: "description", headerName: "Mô tả", width: 230 },
  { field: "status", headerName: "Trạng thái", width: 120 },
  { field: "coins", headerName: "Xu thưởng", width: 120 },
  { field: "difficulty", headerName: "Độ khó", width: 120 },
  { field: "total", headerName: "Tổng tiến trình", width: 120 },
  {
    field: "User",
    headerName: "Bên cung cấp",
    width: 150,
    valueGetter: (params: any) => params?.username || params?.email || "Chưa cập nhật",
  },
  {
    field: "dueDate",
    headerName: "Ngày hết hạn",
    width: 200,
    valueGetter: formatDateValue,
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

export const itemColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "public_id", headerName: "ID công khai", width: 200 },
  { field: "name", headerName: "Tên vật phẩm", width: 200 },
  { field: "description", headerName: "Mô tả", width: 300 },
  { field: "price", headerName: "Giá (xu)", width: 120 },
  { field: "stock", headerName: "Tồn kho", width: 120 },
  { field: "status", headerName: "Trạng thái", width: 120 },
  { field: "weight", headerName: "Cân nặng (g)", width: 120 },
  { field: "length", headerName: "Chiều dài (cm)", width: 120 },
  { field: "width", headerName: "Chiều rộng (cm)", width: 120 },
  { field: "height", headerName: "Chiều cao (cm)", width: 120 },
  {
    field: "creator",
    headerName: "Tài khoản cung cấp",
    width: 150,
    valueGetter: (params: any) => params?.username || params?.email || "Chưa cập nhật",
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
    valueGetter: formatDateValue,
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: formatDateValue,
  },
];

export const productColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "public_id", headerName: "ID công khai", width: 200 },
  { field: "name", headerName: "Tên sản phẩm", width: 200 },
  { field: "description", headerName: "Mô tả", width: 300 },
  { field: "category", headerName: "Danh mục", width: 150 },
  { field: "price", headerName: "Giá (VNĐ)", width: 120 },
  { field: "product_status", headerName: "Tình trạng sản phẩm", width: 150 },
  { field: "post_status", headerName: "Trạng thái bài đăng", width: 150 },
  {
    field: "seller",
    headerName: "Tài khoản người bán",
    width: 150,
    valueGetter: (params: any) => params?.username || params?.email || "Chưa cập nhật",
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
