const db = require("../models");
const ReceiverInformation = db.ReceiverInformation;

/**
 * Finds a receiver information record by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<ReceiverInformation|null>}
 */
const findById = async (id, options = {}) => {
  return ReceiverInformation.findByPk(id, options);
};

/**
 * Finds a single receiver information record matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<ReceiverInformation|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return ReceiverInformation.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all receiver information records matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<ReceiverInformation[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return ReceiverInformation.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new receiver information record.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<ReceiverInformation>}
 */
const create = async (data, options = {}) => {
  const instance = await ReceiverInformation.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a receiver information record by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return ReceiverInformation.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Updates receiver information records by custom conditions.
 * @param {object} conditions
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const updateByConditions = async (conditions, data, options = {}) => {
  return ReceiverInformation.update(data, {
    where: conditions,
    ...options,
  });
};

/**
 * Deletes a receiver information record by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return ReceiverInformation.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a receiver information record by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await ReceiverInformation.update(data, {
    where: { id },
    transaction,
  });
  return ReceiverInformation.findByPk(id, {
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
