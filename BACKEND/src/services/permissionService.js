const permissionRepo = require("../repositories/permissionRepository");
const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");

const createPermission = async (action, subject) => {
  return await permissionRepo.create({ action, subject }, { raw: true, nest: true });
};

const getPermissionById = async (id) => {
  if (!id) throw new BadRequestError("Permission ID is required");

  const result = await permissionRepo.findById(id, { raw: true, nest: true });
  if (!result) throw new NotFoundError("Permission not found");

  return result;
};

const getAllPermissions = async () => {
  return await permissionRepo.findAll({ raw: true, nest: true });
};

const updatePermission = async (id, data) => {
  const permission = await permissionRepo.findById(id, { raw: true, nest: true });
  if (!permission) throw new NotFoundError("Permission not found");

  const updatedPermission = await permissionRepo.updateById(id, data);
  return updatedPermission;
};

const deletePermission = async (id) => {
  const permission = await permissionRepo.findById(id, { raw: true, nest: true });
  if (!permission) throw new NotFoundError("Permission not found");

  await permissionRepo.destroy(id);
  return { message: "Permission deleted successfully" };
};

module.exports = {
  createPermission,
  getPermissionById,
  getAllPermissions,
  updatePermission,
  deletePermission,
};
