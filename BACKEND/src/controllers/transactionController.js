const { subject } = require("@casl/ability");
const transactionService = require("../services/transactionService");
const ForbiddenError = require("../errors/ForbiddenError");

const handleCreateTransaction = async (req, res) => {
  const transaction = await transactionService.createTransaction(req.body);
  if (!transaction) {
    return res.error(400, "Transaction creation failed", req.body);
  }
  return res.success("Transaction created successfully", transaction);
};

const handleGetAllTransactions = async (req, res) => {
  const transaction = await transactionService.getAllTransactions();
  return res.success("Transactions retrieved successfully", transaction);
};

const handleGetTransactionById = async (req, res) => {
  const { id } = req.params;
  const transaction = await transactionService.getTransactionById(id);

  if (!transaction) {
    return res.error(404, "Transaction not found");
  }

  if (!req.ability.can("read", subject("Transaction", transaction))) {
    throw new ForbiddenError("Bạn không có quyền xem chi tiết giao dịch này");
  }

  return res.success("Transaction retrieved successfully", transaction);
};

const handleCancelTransactionById = async (req, res) => {
  const { id } = req.params;

  const transaction = await transactionService.getTransactionById(id);
  if (!transaction) {
    return res.error(404, "Transaction not found");
  }

  if (!req.ability.can("cancel", subject("Transaction", transaction))) {
    throw new ForbiddenError("Bạn không có quyền hủy giao dịch này");
  }

  const updatedTransaction = await transactionService.cancelTransactionById(id);
  return res.success("Transaction cancelled successfully", updatedTransaction);
};

const handleGetTransactionByBuyerId = async (req, res) => {
  const user_id = Number(req.user.id);
  const transaction = await transactionService.getTransactionByBuyerId(user_id);
  return res.success("Transaction retrieved successfully", transaction);
};

const handleGetTransactionBySellerId = async (req, res) => {
  const user_id = Number(req.user.id);
  const transaction = await transactionService.getTransactionBySellerId(user_id);
  return res.success("Transaction retrieved successfully", transaction);
};

const handleDeleteTransaction = async (req, res) => {
  const transaction_id = req.params.id;

  const transaction = await transactionService.getTransactionById(transaction_id);
  if (!transaction) {
    return res.error(404, "Transaction not found");
  }

  if (!req.ability.can("delete", subject("Transaction", transaction))) {
    throw new ForbiddenError("Bạn không có quyền xóa giao dịch này");
  }

  const message = await transactionService.deleteTransaction(transaction_id);
  return res.success("Transaction deleted successfully", message);
};

const handleTransactionMakeDicision = async (req, res) => {
  const transaction_id = req.params.id;
  const decision = req.params.decision;

  const transaction = await transactionService.getTransactionById(transaction_id);
  if (!transaction) {
    return res.error(404, "Transaction not found");
  }

  let action = "update";
  if (decision === "accepted") action = "accept";
  else if (decision === "rejected") action = "reject";

  if (!req.ability.can(action, subject("Transaction", transaction))) {
    throw new ForbiddenError(`Bạn không có quyền ${action} giao dịch này`);
  }

  const message = await transactionService.makeDecision(transaction_id, decision);
  return res.success("Get transaction by status success", message);
};

const handleGetAllTransactionsByStatus = async (req, res) => {
  const status = req.params.status;

  const message = await transactionService.getAllTransactionsByStatus(status);
  return res.success("Get transaction by status success", message);
};

module.exports = {
  handleCreateTransaction,
  handleDeleteTransaction,
  handleGetTransactionByBuyerId,
  handleGetAllTransactions,
  handleTransactionMakeDicision,
  handleGetAllTransactionsByStatus,
  handleGetTransactionBySellerId,
  handleGetTransactionById,
  handleCancelTransactionById,
};
