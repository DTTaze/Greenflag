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
