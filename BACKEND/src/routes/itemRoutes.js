const express = require("express");
const itemController = require("../controllers/itemController");
const middlewareImage = require("../middlewares/middlewareImage");
const checkItemDailyLimit = require("../middlewares/checkItemDailyLimit");
const validate = require("../middlewares/validate");
const requirePermission = require("../middlewares/requirePermission");
const { createItemDto, updateItemDto, purchaseItemDto } = require("../dtos/itemDto");

const router = express.Router();

router.post(
  "/upload",
  requirePermission("create", "Item"),
  middlewareImage.array("images", 5),
  validate(createItemDto),
  itemController.handleUploadItem,
);
router.get("/", itemController.handleGetAllItems);
router.get("/users/:user_id", itemController.handleGetItemByIdUser);
router.get("/:id", itemController.handleGetItemByIdItem);

router.put(
  "/:id",
  requirePermission("update", "Item"),
  middlewareImage.array("images", 5),
  validate(updateItemDto),
  itemController.handleUpdateItem,
);

router.delete("/:id", requirePermission("delete", "Item"), itemController.handleDeleteItem);

router.post(
  "/purchase/:item_id",
  checkItemDailyLimit,
  validate(purchaseItemDto),
  itemController.handlePurchaseItem,
);

router.get("/public/:public_id", itemController.handleGetItemByPublicId);

router.put(
  "/public/:public_id",
  requirePermission("update", "Item"),
  middlewareImage.array("images", 5),
  validate(updateItemDto),
  itemController.handleUpdateItemByPublicId,
);

router.delete(
  "/public/:public_id",
  requirePermission("delete", "Item"),
  itemController.handleDeleteItemByPublicId,
);

module.exports = router;
