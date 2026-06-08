const deliveryOrderService = require("../services/deliveryOrderService");
const BadRequestError = require("../errors/BadRequestError");

const getHeadersFromRequest = (req) => {
  const token = req.headers["token"];
  const shop_id = req.headers["shop_id"];

  if (!token && !shop_id) {
    throw new BadRequestError("Missing GHN Token or ShopId in headers");
  }

  return { token, shop_id };
};

const handlePreviewOrderWithoutOrderCode = async (req, res) => {
  const { token, shop_id } = getHeadersFromRequest(req);
  const shipmentData = req.body;
  const data = await deliveryOrderService.previewOrderWithoutOrderCode(
    shipmentData,
    token,
    shop_id,
  );
  return res.success("Preview order success", data);
};

const handleGetAllProvinces = async (req, res) => {
  const { token } = getHeadersFromRequest(req);
  const data = await deliveryOrderService.getAllProvinces(token);
  return res.success("Get all provinces success", data);
};

const handleGetAllDistrictsByProvince = async (req, res) => {
  const { token } = getHeadersFromRequest(req);
  const { province_id } = req.body;
  if (!province_id) {
    return res.error(400, "province_id is required");
  }

  const data = await deliveryOrderService.getAllDistrictsByProvince(token, province_id);
  return res.success("Get all districts success", data);
};

const handleGetAllWardsByDistrict = async (req, res) => {
  const { token } = getHeadersFromRequest(req);
  const { district_id } = req.query;

  if (!district_id) {
    return res.error(400, "district_id is required");
  }

  const data = await deliveryOrderService.getWardsByDistrict(token, district_id);
  return res.success("Get all wards success", data);
};

const handleCreateDeliveryOrder = async (req, res) => {
  const { token, shop_id } = getHeadersFromRequest(req);
  const shipmentData = req.body;
  const seller_id = req.user.id;
  const data = await deliveryOrderService.createDeliveryOrder(
    shipmentData,
    token,
    shop_id,
    seller_id,
  );
  return res.success("Create order success", data);
};

const handleCreateDeliveryOrderFromTransaction = async (req, res) => {
  const { token, shop_id } = getHeadersFromRequest(req);
  const transaction_id = req.params.transaction_id;
  const seller_id = req.user.id;
  const orderData = req.body;
  const data = await deliveryOrderService.createDeliveryOrderFromTransaction(
    transaction_id,
    token,
    shop_id,
    seller_id,
    orderData,
  );
  return res.success("Create order from transaction success", data);
};

const handleGetDeliveryOrderInfo = async (req, res) => {
  const { token, shop_id } = getHeadersFromRequest(req);
  const { order_code } = req.params;

  const data = await deliveryOrderService.getDeliveryOrderInfo(order_code, token, shop_id);
  return res.success("Get order info success", data);
};

const handleUpdateDeliveryOrder = async (req, res) => {
  const { token, shop_id } = getHeadersFromRequest(req);
  const updateData = req.body;
  const data = await deliveryOrderService.updateDeliveryOrder(updateData, token, shop_id);
  return res.success("Update order success", data);
};

const handleCancelDeliveryOrder = async (req, res) => {
  const { token, shop_id } = getHeadersFromRequest(req);
  const { order_code } = req.params;

  const data = await deliveryOrderService.cancelDeliveryOrder(order_code, token, shop_id);
  return res.success("Cancel order success", data);
};

const handleGetAllDeliveryOrdersBySeller = async (req, res) => {
  const sellerId = req.user.id;
  const orders = await deliveryOrderService.getDeliveryOrdersBySeller(sellerId);
  return res.success("Get all delivery orders by sellerId success", orders);
};

const handleGetAllDeliveryOrdersByBuyer = async (req, res) => {
  const buyerId = req.user.id;
  const orders = await deliveryOrderService.getDeliveryOrdersByBuyer(buyerId);
  return res.success("Get all delivery orders by buyerId success", orders);
};

const handleGetAllDeliveryOrders = async (req, res) => {
  const orders = await deliveryOrderService.getAllDeliveryOrders();
  return res.success("Get all delivery orders success", orders);
};

const handleGetAllDeliveryOrdersByStatus = async (req, res) => {
  const status = req.params.status;
  const orders = await deliveryOrderService.getAllDeliveryOrdersByStatus(status);
  return res.success("Get all delivery orders success", orders);
};

module.exports = {
  handleCreateDeliveryOrder,
  handleGetDeliveryOrderInfo,
  handleCancelDeliveryOrder,
  handleUpdateDeliveryOrder,
  handleGetAllDeliveryOrdersBySeller,
  handleGetAllDeliveryOrders,
  handleGetAllProvinces,
  handleGetAllDistrictsByProvince,
  handleGetAllWardsByDistrict,
  handlePreviewOrderWithoutOrderCode,
  handleGetAllDeliveryOrdersByBuyer,
  handleGetAllDeliveryOrdersByStatus,
  handleCreateDeliveryOrderFromTransaction,
};
