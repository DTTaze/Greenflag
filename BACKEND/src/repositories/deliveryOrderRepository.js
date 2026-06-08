const db = require("../models");
const DeliveryOrder = db.DeliveryOrder;

/**
 * Finds a delivery order by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<DeliveryOrder|null>}
 */
const findById = async (id, options = {}) => {
  return DeliveryOrder.findByPk(id, options);
};

/**
 * Finds a single delivery order matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<DeliveryOrder|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return DeliveryOrder.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all delivery orders matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<DeliveryOrder[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return DeliveryOrder.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new delivery order.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<DeliveryOrder>}
 */
const create = async (data, options = {}) => {
  const instance = await DeliveryOrder.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a delivery order by custom conditions (e.g. order_code).
 * @param {object} conditions
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (conditions, data, options = {}) => {
  return DeliveryOrder.update(data, {
    where: conditions,
    ...options,
  });
};

/**
 * Deletes a delivery order by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return DeliveryOrder.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a delivery order by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await DeliveryOrder.update(data, {
    where: { id },
    transaction,
  });
  return DeliveryOrder.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

/**
 * Updates a delivery order by custom conditions and returns the updated plain object.
 * @param {object} conditions
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateByConditions = async (conditions, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await DeliveryOrder.update(data, {
    where: conditions,
    transaction,
  });
  return DeliveryOrder.findOne({
    where: conditions,
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
  updateByConditions,
  destroy,
};
