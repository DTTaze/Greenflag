const db = require("../models");
const Role = db.Role;
const RolePermission = db.RolePermission;

// --- Role Basic Operations ---

/**
 * Finds a role by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Role|null>}
 */
const findById = async (id, options = {}) => {
  return Role.findByPk(id, options);
};

/**
 * Finds a single role matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Role|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Role.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all roles.
 * @param {object} [options]
 * @returns {Promise<Role[]>}
 */
const findAll = async (options = {}) => {
  return Role.findAll(options);
};

/**
 * Creates a new role.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Role>}
 */
const create = async (data, options = {}) => {
  const instance = await Role.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a role by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Role.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a role by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Role.destroy({
    where: { id },
    ...options,
  });
};

// --- RolePermission Pivot Operations ---

/**
 * Assigns a permission to a role.
 * @param {number} roleId
 * @param {number} permissionId
 * @param {object} [options]
 * @returns {Promise<RolePermission>}
 */
const assignPermission = async (roleId, permissionId, options = {}) => {
  const instance = await RolePermission.create(
    {
      role_id: roleId,
      permission_id: permissionId,
    },
    options,
  );
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Finds a specific RolePermission link.
 * @param {number} roleId
 * @param {number} permissionId
 * @param {object} [options]
 * @returns {Promise<RolePermission|null>}
 */
const findRolePermission = async (roleId, permissionId, options = {}) => {
  return RolePermission.findOne({
    where: { role_id: roleId, permission_id: permissionId },
    ...options,
  });
};

/**
 * Finds all RolePermissions with custom query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<RolePermission[]>}
 */
const findAllRolePermissions = async (queryOptions = {}, options = {}) => {
  return RolePermission.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Updates a RolePermission permission_id.
 * @param {number} roleId
 * @param {number} permissionId
 * @param {number} newPermissionId
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const updateRolePermission = async (roleId, permissionId, newPermissionId, options = {}) => {
  return RolePermission.update(
    { permission_id: newPermissionId },
    {
      where: { role_id: roleId, permission_id: permissionId },
      ...options,
    },
  );
};

/**
 * Removes a permission from a role.
 * @param {number} roleId
 * @param {number} permissionId
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const removeRolePermission = async (roleId, permissionId, options = {}) => {
  return RolePermission.destroy({
    where: { role_id: roleId, permission_id: permissionId },
    ...options,
  });
};

/**
 * Updates a role by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Role.update(data, {
    where: { id },
    transaction,
  });
  return Role.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

module.exports = {
  findById,
  findOne,
  findAll,
  create,
  update,
  updateById,
  destroy,
  assignPermission,
  findRolePermission,
  findAllRolePermissions,
  updateRolePermission,
  removeRolePermission,
};
