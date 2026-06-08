const transactionService = require("../services/transactionService");

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

  return res.success("Transaction retrieved successfully", transaction);
};

const handleCancelTransactionById = async (req, res) => {
  const { id } = req.params;
  const transaction = await transactionService.cancelTransactionById(id);

  return res.success("Transaction cancelled successfully", transaction);
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
  const message = await transactionService.deleteTransaction(transaction_id);
  return res.success("Transaction deleted successfully", message);
};

const handleTransactionMakeDicision = async (req, res) => {
  const transaction_id = req.params.id;
  const decision = req.params.decision;

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
