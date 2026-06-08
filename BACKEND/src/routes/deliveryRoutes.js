const express = require("express");
const deliveryAccountController = require("../controllers/deliveryAccountController");
const deliveryOrderController = require("../controllers/deliveryOrderController");
const validate = require("../middlewares/validate");
const requirePermission = require("../middlewares/requirePermission");
const {
  createDeliveryAccountDto,
  updateDeliveryAccountDto,
  createDeliveryOrderDto,
  createDeliveryOrderFromTransactionDto,
  updateDeliveryOrderDto,
} = require("../dtos/deliveryDto");

const router = express.Router();

router.post(
  "/carrier/ghn/create-order",
  requirePermission("create", "DeliveryOrder"),
  validate(createDeliveryOrderDto),
  deliveryOrderController.handleCreateDeliveryOrder,
);
router.post(
  "/carrier/ghn/create-order-from-transaction/:transaction_id",
  requirePermission("create", "DeliveryOrder"),
  validate(createDeliveryOrderFromTransactionDto),
  deliveryOrderController.handleCreateDeliveryOrderFromTransaction,
);
router.get("/carrier/ghn/detail/:order_code", deliveryOrderController.handleGetDeliveryOrderInfo);
router.post(
  "/carrier/ghn/update",
  requirePermission("update", "DeliveryOrder"),
  validate(updateDeliveryOrderDto),
  deliveryOrderController.handleUpdateDeliveryOrder,
);
router.post(
  "/carrier/ghn/cancel/:order_code",
  requirePermission("update", "DeliveryOrder"),
  deliveryOrderController.handleCancelDeliveryOrder,
);
router.post(
  "/carrier/ghn/order/preview",
  deliveryOrderController.handlePreviewOrderWithoutOrderCode,
);
router.get("/carrier/ghn/orders", deliveryOrderController.handleGetAllDeliveryOrders);
router.get(
  "/carrier/ghn/orders/seller",
  deliveryOrderController.handleGetAllDeliveryOrdersBySeller,
);
router.get("/carrier/ghn/orders/buyer", deliveryOrderController.handleGetAllDeliveryOrdersByBuyer);
router.get(
  "/carrier/ghn/orders/:status",
  deliveryOrderController.handleGetAllDeliveryOrdersByStatus,
);
router.get("/carrier/ghn/master-data/province", deliveryOrderController.handleGetAllProvinces);
router.post(
  "/carrier/ghn/master-data/district",
  deliveryOrderController.handleGetAllDistrictsByProvince,
);
router.get("/carrier/ghn/master-data/ward", deliveryOrderController.handleGetAllWardsByDistrict);

// manage shipping account
router.get("/accounts/user", deliveryAccountController.handleGetAllDeliveryAccounts);
router.get("/accounts/:id", deliveryAccountController.handleGetDeliveryAccountById);
router.post(
  "/accounts/create",
  requirePermission("create", "DeliveryAccount"),
  validate(createDeliveryAccountDto),
  deliveryAccountController.handleCreateDeliveryAccount,
);
router.put(
  "/accounts/:id",
  requirePermission("update", "DeliveryAccount"),
  validate(updateDeliveryAccountDto),
  deliveryAccountController.handleUpdateDeliveryAccount,
);
router.delete(
  "/accounts/:id",
  requirePermission("delete", "DeliveryAccount"),
  deliveryAccountController.handleDeleteDeliveryAccount,
);
router.patch(
  "/accounts/user/set-default/:id",
  requirePermission("update", "DeliveryAccount"),
  deliveryAccountController.handleSetDefaultDeliveryAccount,
);

module.exports = router;
