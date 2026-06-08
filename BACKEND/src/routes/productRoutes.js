const express = require("express");
const productController = require("../controllers/productController");
const middlewareImage = require("../middlewares/middlewareImage");
const validate = require("../middlewares/validate");
const { createProductDto, updateProductDto } = require("../dtos/productDto");

const router = express.Router();

router.post(
  "/upload",
  middlewareImage.array("images", 5),
  validate(createProductDto),
  productController.handleUploadProduct,
);
router.get("/", productController.handleGetAllProducts);
router.get("/available", productController.handleGetAllAvailableProducts);
router.get("/users/:user_id", productController.handleGetProductByIdUser);
router.put(
  "/:id",
  middlewareImage.array("images", 5),
  validate(updateProductDto),
  productController.handleUpdateProductById,
);
router.delete("/:id", productController.handleDeleteProduct);
router.put(
  "/public/:public_id",
  middlewareImage.array("images", 5),
  validate(updateProductDto),
  productController.handleUpdateProductByPublicId,
);
module.exports = router;
