const { subject } = require("@casl/ability");
const ReceiverInformationService = require("../services/receiverInformationService");
const ForbiddenError = require("../errors/ForbiddenError");

const handleCreateReceiverInfo = async (req, res) => {
  const result = await ReceiverInformationService.createReceiverInfo(req.body);
  return res.success("Receiver information created successfully", result);
};

const handleGetReceiverInfoById = async (req, res) => {
  const id = req.params.id || req.body.id;
  if (!id) return res.error(400, "Missing receiver ID");

  const result = await ReceiverInformationService.getReceiverInfoById(Number(id));
  if (!req.ability.can("read", subject("ReceiverInformation", result))) {
    throw new ForbiddenError("Bạn không có quyền xem thông tin người nhận này");
  }
  return res.success("Receiver information fetched successfully", result);
};

const handleGetReceiverInfoByUserId = async (req, res) => {
  const id = req.params.user_id;
  if (!id) return res.error(400, "Missing receiver ID");

  if (!req.ability.can("read", subject("ReceiverInformation", { user_id: Number(id) }))) {
    throw new ForbiddenError("Bạn không có quyền xem thông tin người nhận của người dùng này");
  }

  const result = await ReceiverInformationService.getReceiverInfoByUserId(Number(id));
  return res.success("Receiver informations fetched successfully", result);
};

const handleUpdateReceiverInfoById = async (req, res) => {
  const id = req.params.id || req.body.id;
  const updateData = req.body;

  if (!id) return res.error(400, "Missing receiver ID");

  const receiverInfo = await ReceiverInformationService.getReceiverInfoById(Number(id));
  if (!req.ability.can("update", subject("ReceiverInformation", receiverInfo))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa thông tin người nhận này");
  }

  const result = await ReceiverInformationService.updateReceiverInfoById(Number(id), updateData);
  return res.success("Receiver information updated successfully", result);
};

const handleDeleteReceiverInfoById = async (req, res) => {
  const id = req.params.id || req.body.id;
  if (!id) return res.error(400, "Missing receiver ID");

  const receiverInfo = await ReceiverInformationService.getReceiverInfoById(Number(id));
  if (!req.ability.can("delete", subject("ReceiverInformation", receiverInfo))) {
    throw new ForbiddenError("Bạn không có quyền xóa thông tin người nhận này");
  }

  await ReceiverInformationService.deleteReceiverInfoById(Number(id));
  return res.success("Receiver information deleted successfully");
};

const handleSetDefaultReceiverInfoById = async (req, res) => {
  const id = req.params.id || req.body.id;
  if (!id) return res.error(400, "Missing receiver ID");

  const receiverInfo = await ReceiverInformationService.getReceiverInfoById(Number(id));
  if (!req.ability.can("update", subject("ReceiverInformation", receiverInfo))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa thông tin người nhận này");
  }

  const result = await ReceiverInformationService.setDefaultReceiverInfoById(Number(id));
  return res.success("Receiver information set default successfully", result);
};

module.exports = {
  handleCreateReceiverInfo,
  handleGetReceiverInfoById,
  handleGetReceiverInfoByUserId,
  handleUpdateReceiverInfoById,
  handleDeleteReceiverInfoById,
  handleSetDefaultReceiverInfoById,
};
