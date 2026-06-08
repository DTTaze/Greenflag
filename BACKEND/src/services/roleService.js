const roleRepo = require("../repositories/roleRepository");
const { deleteCache } = require("../utils/cache.js");
const { CACHE_KEYS } = require("../constants/cacheKeys.js");
const { cacheThrough } = require("../helpers/cacheHelper.js");
const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");

// Global cache keys
const cacheKeyId = (id) => CACHE_KEYS.IDENTITY.ROLE_BY_ID(id);
const cacheKeyAll = CACHE_KEYS.IDENTITY.ALL_ROLES;

const createRole = async (name, description) => {
  const newRole = await roleRepo.create({ name, description }, { raw: true, nest: true });

  // Invalidate cache
  await deleteCache(cacheKeyAll);

  return newRole;
};

const getRoleById = async (id) => {
  if (!id) throw new BadRequestError("Role ID is required");

  return cacheThrough(cacheKeyId(id), async () => {
    const role = await roleRepo.findById(id, { raw: true, nest: true });
    if (!role) throw new NotFoundError("Role not found");
    return role;
  });
};

const getAllRoles = async () => {
  return cacheThrough(cacheKeyAll, async () => {
    return await roleRepo.findAll({ raw: true, nest: true });
  });
};

const updateRole = async (id, data) => {
  const role = await roleRepo.findById(id, { raw: true, nest: true });
  if (!role) throw new NotFoundError("Role not found");

  const updatedRole = await roleRepo.updateById(id, data);

  // Invalidate related cache
  await deleteCache(cacheKeyId(id));
  await deleteCache(cacheKeyAll);

  return updatedRole;
};

const deleteRole = async (id) => {
  const role = await roleRepo.findById(id, { raw: true, nest: true });
  if (!role) throw new NotFoundError("Role not found");

  await roleRepo.destroy(id);

  // Invalidate related cache
  await deleteCache(cacheKeyId(id));
  await deleteCache(cacheKeyAll);

  return { message: "Role deleted successfully" };
};

module.exports = {
  createRole,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
};
