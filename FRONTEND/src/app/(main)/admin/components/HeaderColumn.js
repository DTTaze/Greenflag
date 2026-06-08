/* eslint-disable max-lines */
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
    valueGetter: (params) => params?.username || "Unknown",
  },
  {
    field: "dueDate",
    headerName: "Ngày hết hạn",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
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
    valueGetter: (params) => params?.username || "Unknown",
  },
  {
    field: "purchase_limit_per_day",
    headerName: "Giới hạn lượt mua/ngày",
    width: 200,
    valueGetter: (params) => params || "Không giới hạn",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
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
    valueGetter: (params) => params?.username || "Unknown",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];

export const videoColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 230 },
  { field: "duration", headerName: "Duration", width: 120 },
  { field: "views", headerName: "Views", width: 120 },
  { field: "url", headerName: "Url", width: 120 },
  { field: "filename", headerName: "File Name", width: 120 },
  { field: "user_id", headerName: "User ID", width: 120 },
  { field: "category", headerName: "Category", width: 150 },
  { field: "dateUploaded", headerName: "Date Uploaded", width: 150 },
  { field: "created_at", headerName: "Created At", width: 150 },
  { field: "updated_at", headerName: "Updated At", width: 150 },
];

export const avatarColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "usage", headerName: "Usage", width: 120 },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];

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
    field: "roles",
    headerName: "Vai trò",
    width: 120,
    valueGetter: (params) => params?.name || "Unknown",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
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
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
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
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];

export const rolesPermissionsColumns = [
  { field: "id", headerName: "ID", width: 100 },

  {
    field: "role",
    headerName: "Name",
    width: 250,
    valueGetter: (params) => params?.name || "Unknown",
  },
  {
    field: "permission",
    headerName: "Subject",
    width: 150,
    valueGetter: (params) => params?.subject || "Unknown",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];

export const transactionsColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "public_id", headerName: "ID công khai", width: 200 },
  { field: "name", headerName: "Tên giao dịch", width: 200 },
  {
    field: "buyer",
    headerName: "Tên tài khoản người mua",
    width: 200,
    valueGetter: (params) => params?.username || "Unknown",
  },
  {
    field: "item_snapshot",
    headerName: "Tên tài khoản người bán",
    width: 200,
    valueGetter: (params) => params?.creator?.username || "Unknown",
  },
  { field: "total_price", headerName: "Tổng giá trị (xu)", width: 150 },
  { field: "quantity", headerName: "Số lượng sản phẩm", width: 150 },
  { field: "status", headerName: "Trạng thái", width: 150 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];

export const ordersColumns = [
  { field: "id", headerName: "ID", width: 100 },
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
  { field: "status", headerName: "Trạng thái", width: 150 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];

export const eventsColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "public_id", headerName: "ID công khai", width: 200 },
  { field: "title", headerName: "Tên sự kiện", width: 200 },
  {
    field: "creator",
    headerName: "Tên tài khoản người mua",
    width: 200,
    valueGetter: (params) => params?.username || "Unknown",
  },
  { field: "description", headerName: "Tổng giá trị (xu)", width: 150 },
  {
    field: "location",
    headerName: "Địa điểm tổ chức",
    width: 200,
  },
  { field: "capacity", headerName: "Hạn mức tham gia", width: 150 },
  { field: "coins", headerName: "Số xu nhận được", width: 150 },
  { field: "status", headerName: "Trạng thái", width: 200 },
  {
    field: "end_sign",
    headerName: "Hạn chót đăng kí",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "start_time",
    headerName: "Ngày bắt đầu",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "end_time",
    headerName: "Ngày kết thúc",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];
