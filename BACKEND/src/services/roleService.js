const db = require("../models/index.js");
const Role = db.Role;
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

// Global cache keys
const cacheKeyId = (id) => CACHE_KEYS.IDENTITY.ROLE_BY_ID(id);
const cacheKeyAll = CACHE_KEYS.IDENTITY.ALL_ROLES;

const createRole = async (name, description) => {
  if (!name) throw new BadRequestError("Role name is required");

  const newRole = await Role.create({ name, description });

  // Invalidate cache
  await deleteCache(cacheKeyAll);

  return newRole;
};

const getRoleById = async (id) => {
  if (!id) throw new BadRequestError("Role ID is required");

  const key = cacheKeyId(id);
  const cached = await getCache(key);
  if (cached) return cached;

  const role = await Role.findByPk(id);
  if (!role) throw new NotFoundError("Role not found");

  await setCache(key, role);
  return role;
};

const getAllRoles = async () => {
  const cached = await getCache(cacheKeyAll);
  if (cached) return cached;

  const roles = await Role.findAll();
  await setCache(cacheKeyAll, roles);
  return roles;
};

const updateRole = async (id, data) => {
  const role = await Role.findByPk(id);
  if (!role) throw new NotFoundError("Role not found");

  await role.update(data);

  // Invalidate related cache
  await deleteCache(cacheKeyId(id));
  await deleteCache(cacheKeyAll);

  return role;
};

const deleteRole = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) throw new NotFoundError("Role not found");

  await role.destroy();

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
