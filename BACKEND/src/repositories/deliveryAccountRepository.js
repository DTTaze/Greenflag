const db = require("../models");
const DeliveryAccount = db.DeliveryAccount;

/**
 * Finds a delivery account by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<DeliveryAccount|null>}
 */
const findById = async (id, options = {}) => {
  return DeliveryAccount.findByPk(id, options);
};

/**
 * Finds a single delivery account matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<DeliveryAccount|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return DeliveryAccount.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all delivery accounts matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<DeliveryAccount[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return DeliveryAccount.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new delivery account.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<DeliveryAccount>}
 */
const create = async (data, options = {}) => {
  const instance = await DeliveryAccount.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a delivery account by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return DeliveryAccount.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Updates delivery accounts by custom conditions.
 * @param {object} conditions
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const updateByConditions = async (conditions, data, options = {}) => {
  return DeliveryAccount.update(data, {
    where: conditions,
    ...options,
  });
};

/**
 * Deletes a delivery account by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return DeliveryAccount.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a delivery account by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await DeliveryAccount.update(data, {
    where: { id },
    transaction,
  });
  return DeliveryAccount.findByPk(id, {
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
  updateByConditions,
  updateById,
  destroy,
};
