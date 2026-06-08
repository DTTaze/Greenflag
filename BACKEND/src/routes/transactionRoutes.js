const express = require("express");
const transactionController = require("../controllers/transactionController");
const validate = require("../middlewares/validate");
const requirePermission = require("../middlewares/requirePermission");
const { createTransactionDto } = require("../dtos/transactionDto");

const router = express.Router();

router.get("/", transactionController.handleGetAllTransactions);
router.get("/status/:status", transactionController.handleGetAllTransactionsByStatus);
router.get("/buyer", transactionController.handleGetTransactionByBuyerId);
router.get("/seller", transactionController.handleGetTransactionBySellerId);

router.post(
  "/create",
  requirePermission("create", "Transaction"),
  validate(createTransactionDto),
  transactionController.handleCreateTransaction,
);

router.patch(
  "/cancel/:id",
  requirePermission("update", "Transaction"),
  transactionController.handleCancelTransactionById,
);

router.patch(
  "/decision/:id/:decision",
  requirePermission("update", "Transaction"),
  transactionController.handleTransactionMakeDicision,
);

router.delete(
  "/:id",
  requirePermission("delete", "Transaction"),
  transactionController.handleDeleteTransaction,
);

router.get("/:id", transactionController.handleGetTransactionById);

module.exports = router;
