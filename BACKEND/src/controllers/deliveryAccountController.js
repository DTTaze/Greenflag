const deliveryAccountService = require("../services/deliveryAccountService");

const handleGetAllDeliveryAccounts = async (req, res) => {
  const userId = req.user.id;
  const accounts = await deliveryAccountService.getAllDeliveryAccounts(userId);
  return res.success("Get all delivery accounts success", accounts);
};

const handleGetDeliveryAccountById = async (req, res) => {
  const id = req.params.id;
  const account = await deliveryAccountService.getDeliveryAccountById(id);
  return res.success("Get delivery account success", account);
};

const handleCreateDeliveryAccount = async (req, res) => {
  const data = req.body;
  const account = await deliveryAccountService.createDeliveryAccount(data);
  return res.success("Create delivery account success", account);
};

const handleUpdateDeliveryAccount = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const account = await deliveryAccountService.updateDeliveryAccount(id, data);
  return res.success("Update delivery account success", account);
};

const handleDeleteDeliveryAccount = async (req, res) => {
  const id = req.params.id;
  const result = await deliveryAccountService.deleteDeliveryAccount(id);
  return res.success("Delete delivery account success", result);
};

const handleSetDefaultDeliveryAccount = async (req, res) => {
  const id = req.params.id;
  const account = await deliveryAccountService.setDefaultDeliveryAccount(id);
  return res.success("Set default delivery account success", account);
};

module.exports = {
  handleGetAllDeliveryAccounts,
  handleGetDeliveryAccountById,
  handleCreateDeliveryAccount,
  handleUpdateDeliveryAccount,
  handleDeleteDeliveryAccount,
  handleSetDefaultDeliveryAccount,
};
