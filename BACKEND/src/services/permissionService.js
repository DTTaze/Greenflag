const db = require("../models/index.js");
const Permission = db.Permission;
const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");

const createPermission = async (action, subject) => {
  return await Permission.create({ action, subject });
};

const getPermissionById = async (id) => {
  if (!id) throw new BadRequestError("Permission ID is required");

  const result = await Permission.findByPk(id);
  if (!result) throw new NotFoundError("Permission not found");

  return result;
};

const getAllPermissions = async () => {
  return await Permission.findAll();
};

const updatePermission = async (id, data) => {
  const permission = await Permission.findByPk(id);
  if (!permission) throw new NotFoundError("Permission not found");

  await permission.update(data);
  return permission;
};

const deletePermission = async (id) => {
  const permission = await Permission.findByPk(id);
  if (!permission) throw new NotFoundError("Permission not found");

  await permission.destroy();
  return { message: "Permission deleted successfully" };
};

module.exports = {
  createPermission,
  getPermissionById,
  getAllPermissions,
  updatePermission,
  deletePermission,
};
