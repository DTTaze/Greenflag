const express = require("express");
const itemController = require("../controllers/itemController");
const middlewareImage = require("../middlewares/middlewareImage");
const checkItemDailyLimit = require("../middlewares/checkItemDailyLimit");
const validate = require("../middlewares/validate");
const { createItemDto, updateItemDto, purchaseItemDto } = require("../dtos/itemDto");

const router = express.Router();

router.post(
  "/upload",
  middlewareImage.array("images", 5),
  validate(createItemDto),
  itemController.handleUploadItem,
);
router.get("/", itemController.handleGetAllItems);
router.get("/users/:user_id", itemController.handleGetItemByIdUser);
router.get("/:id", itemController.handleGetItemByIdItem);
router.put(
  "/:id",
  middlewareImage.array("images", 5),
  validate(updateItemDto),
  itemController.handleUpdateItem,
);
router.delete("/:id", itemController.handleDeleteItem);
router.post(
  "/purchase/:item_id",
  checkItemDailyLimit,
  validate(purchaseItemDto),
  itemController.handlePurchaseItem,
);

router.get("/public/:public_id", itemController.handleGetItemByPublicId);
router.put(
  "/public/:public_id",
  middlewareImage.array("images", 5),
  validate(updateItemDto),
  itemController.handleUpdateItemByPublicId,
);
router.delete("/public/:public_id", itemController.handleDeleteItemByPublicId);
module.exports = router;
