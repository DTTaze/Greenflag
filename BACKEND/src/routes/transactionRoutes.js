const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/", transactionController.handleGetAllTransactions);
router.get("/status/:status", transactionController.handleGetAllTransactionsByStatus);
router.patch("/cancel/:id", transactionController.handleCancelTransactionById);
router.get("/buyer", transactionController.handleGetTransactionByBuyerId);
router.get("/seller", transactionController.handleGetTransactionBySellerId);
router.post("/create", transactionController.handleCreateTransaction);
router.patch("/decision/:id/:decision", transactionController.handleTransactionMakeDicision);
router.delete("/:id", transactionController.handleDeleteTransaction);
router.get("/:id", transactionController.handleGetTransactionById);

module.exports = router;
