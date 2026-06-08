const { subject } = require("@casl/ability");
const deliveryAccountService = require("../services/deliveryAccountService");
const ForbiddenError = require("../errors/ForbiddenError");

const handleGetAllDeliveryAccounts = async (req, res) => {
  const userId = req.user.id;
  const accounts = await deliveryAccountService.getAllDeliveryAccounts(userId);
  return res.success("Get all delivery accounts success", accounts);
};

const handleGetDeliveryAccountById = async (req, res) => {
  const id = req.params.id;
  const account = await deliveryAccountService.getDeliveryAccountById(id);
  if (!req.ability.can("read", subject("DeliveryAccount", account))) {
    throw new ForbiddenError("Bạn không có quyền xem tài khoản vận chuyển này");
  }
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
  const account = await deliveryAccountService.getDeliveryAccountById(id);
  if (!req.ability.can("update", subject("DeliveryAccount", account))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa tài khoản vận chuyển này");
  }
  const updatedAccount = await deliveryAccountService.updateDeliveryAccount(id, data);
  return res.success("Update delivery account success", updatedAccount);
};

const handleDeleteDeliveryAccount = async (req, res) => {
  const id = req.params.id;
  const account = await deliveryAccountService.getDeliveryAccountById(id);
  if (!req.ability.can("delete", subject("DeliveryAccount", account))) {
    throw new ForbiddenError("Bạn không có quyền xóa tài khoản vận chuyển này");
  }
  const result = await deliveryAccountService.deleteDeliveryAccount(id);
  return res.success("Delete delivery account success", result);
};

const handleSetDefaultDeliveryAccount = async (req, res) => {
  const id = req.params.id;
  const account = await deliveryAccountService.getDeliveryAccountById(id);
  if (!req.ability.can("update", subject("DeliveryAccount", account))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa tài khoản vận chuyển này");
  }
  const updatedAccount = await deliveryAccountService.setDefaultDeliveryAccount(id);
  return res.success("Set default delivery account success", updatedAccount);
};

module.exports = {
  handleGetAllDeliveryAccounts,
  handleGetDeliveryAccountById,
  handleCreateDeliveryAccount,
  handleUpdateDeliveryAccount,
  handleDeleteItem: handleDeleteDeliveryAccount, // Make sure name is consistent or exports are preserved
  handleDeleteDeliveryAccount,
  handleSetDefaultDeliveryAccount,
};
