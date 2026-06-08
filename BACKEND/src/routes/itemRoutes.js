const express = require("express");
const itemController = require("../controllers/itemController");
const middlewareImage = require("../middlewares/middlewareImage");
const checkItemDailyLimit = require("../middlewares/checkItemDailyLimit");

const router = express.Router();

router.post("/upload", middlewareImage.array("images", 5), itemController.handleUploadItem);
router.get("/", itemController.handleGetAllItems);
router.get("/users/:user_id", itemController.handleGetItemByIdUser);
router.get(
  "/:id",
  // checkPermission("get", "item_id"),
  itemController.handleGetItemByIdItem,
);
router.put(
  "/:id",
  // checkPermission("put", "item_id"),
  middlewareImage.array("images", 5),
  itemController.handleUpdateItem,
);
router.delete(
  "/:id",
  // checkPermission("delete", "item_id"),
  itemController.handleDeleteItem,
);
router.post("/purchase/:item_id", checkItemDailyLimit, itemController.handlePurchaseItem);

router.get("/public/:public_id", itemController.handleGetItemByPublicId);
router.put(
  "/public/:public_id",
  middlewareImage.array("images", 5),
  itemController.handleUpdateItemByPublicId,
);
router.delete("/public/:public_id", itemController.handleDeleteItemByPublicId);
module.exports = router;
