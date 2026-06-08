const { subject } = require("@casl/ability");
const itemService = require("../services/itemService");
const ForbiddenError = require("../errors/ForbiddenError");

const handleUploadItem = async (req, res) => {
  const user_id = Number(req.user.id);
  const itemData = req.body;
  const images = req.files;
  const item = await itemService.createItem(itemData, user_id, images);
  return res.success("Item uploaded successfully", item);
};

const handleGetAllItems = async (req, res) => {
  const items = await itemService.getAllItems();
  return res.success("Items retrieved successfully", items);
};

const handleGetItemByIdItem = async (req, res) => {
  const item_id = Number(req.params.id);
  const item = await itemService.getItemByIdItem(item_id);
  return res.success("Item retrieved successfully", item);
};

const handleGetItemByIdUser = async (req, res) => {
  const user_id = Number(req.params.user_id);
  const items = await itemService.getItemByIdUser(user_id);
  return res.success("Items retrieved successfully", items);
};

const handleUpdateItem = async (req, res) => {
  const item_id = Number(req.params.id);
  const itemData = req.body;
  const images = req.files;

  const item = await itemService.getItemByIdItem(item_id);
  if (!req.ability.can("update", subject("Item", item))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa vật phẩm của người khác");
  }

  const updatedItem = await itemService.updateItem(item_id, itemData, images);
  return res.success("Item updated successfully", updatedItem);
};

const handleDeleteItem = async (req, res) => {
  const item_id = Number(req.params.id);

  const item = await itemService.getItemByIdItem(item_id);
  if (!req.ability.can("delete", subject("Item", item))) {
    throw new ForbiddenError("Bạn không có quyền xóa vật phẩm của người khác");
  }

  const message = await itemService.deleteItem(item_id);
  return res.success("Item deleted successfully", message);
};

const handlePurchaseItem = async (req, res) => {
  const user_id = req.user.id;
  const item_id = Number(req.params.item_id);
  const data = req.body;
  const result = await itemService.purchaseItem(user_id, item_id, data);
  return res.success("Item purchased successfully", result);
};

const handlePurchaseQueue = async (req, res) => {
  const user_id = req.user.id;
  const item_id = Number(req.params.item_id);
  const data = req.body;
  const result = await itemService.requestPurchase(user_id, item_id, data);
  return res.success("Item purchased successfully", result);
};

const handleGetItemByPublicId = async (req, res) => {
  const public_id = req.params.public_id;
  const item = await itemService.getItemByPublicId(public_id);
  return res.success("Item retrieved successfully", item);
};

const handleUpdateItemByPublicId = async (req, res) => {
  const public_id = req.params.public_id;
  const itemData = req.body;
  const images = req.files;

  const item = await itemService.getItemByPublicId(public_id);
  if (!req.ability.can("update", subject("Item", item))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa vật phẩm của người khác");
  }

  const updatedItem = await itemService.updateItemByPublicId(public_id, itemData, images);
  return res.success("Item updated successfully", updatedItem);
};

const handleDeleteItemByPublicId = async (req, res) => {
  const public_id = req.params.public_id;

  const item = await itemService.getItemByPublicId(public_id);
  if (!req.ability.can("delete", subject("Item", item))) {
    throw new ForbiddenError("Bạn không có quyền xóa vật phẩm của người khác");
  }

  const message = await itemService.deleteItemByPublicId(public_id);
  return res.success("Item deleted successfully", message);
};

module.exports = {
  handleUploadItem,
  handleGetAllItems,
  handleGetItemByIdItem,
  handleGetItemByIdUser,
  handleUpdateItem,
  handleDeleteItem,
  handlePurchaseItem,
  handlePurchaseQueue,
  handleGetItemByPublicId,
  handleUpdateItemByPublicId,
  handleDeleteItemByPublicId,
};
