const express = require("express");
const productController = require("../controllers/productController");
const middlewareImage = require("../middlewares/middlewareImage");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

router.post("/upload", middlewareImage.array("images", 5), productController.handleUploadProduct);
router.get("/", productController.handleGetAllProducts);
router.get("/available", productController.handleGetAllAvailableProducts);
router.get("/users/:user_id", productController.handleGetProductByIdUser);
router.put(
  "/:id",
  // checkPermission("put", "item_id"),
  middlewareImage.array("images", 5),
  productController.handleUpdateProductById,
);
router.delete(
  "/:id",
  // checkPermission("delete", "item_id"),
  productController.handleDeleteProduct,
);
router.put(
  "/public/:public_id",
  middlewareImage.array("images", 5),
  productController.handleUpdateProductByPublicId,
);
module.exports = router;
