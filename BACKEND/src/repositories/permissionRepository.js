const db = require("../models");
const Permission = db.Permission;

/**
 * Finds a permission by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Permission|null>}
 */
const findById = async (id, options = {}) => {
  return Permission.findByPk(id, options);
};

/**
 * Finds a single permission matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Permission|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Permission.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all permissions.
 * @param {object} [options]
 * @returns {Promise<Permission[]>}
 */
const findAll = async (options = {}) => {
  return Permission.findAll(options);
};

/**
 * Creates a new permission.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Permission>}
 */
const create = async (data, options = {}) => {
  const instance = await Permission.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a permission by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Permission.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a permission by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Permission.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a permission by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Permission.update(data, {
    where: { id },
    transaction,
  });
  return Permission.findByPk(id, {
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
};
