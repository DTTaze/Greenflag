const db = require("../models");
const Transaction = db.Transaction;

/**
 * Finds a transaction by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Transaction|null>}
 */
const findById = async (id, options = {}) => {
  return Transaction.findByPk(id, options);
};

/**
 * Finds a transaction by public ID.
 * @param {string} publicId
 * @param {object} [options]
 * @returns {Promise<Transaction|null>}
 */
const findByPublicId = async (publicId, options = {}) => {
  return Transaction.findOne({
    where: { public_id: publicId },
    ...options,
  });
};

/**
 * Finds a single transaction matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Transaction|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Transaction.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all transactions matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Transaction[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return Transaction.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new transaction.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Transaction>}
 */
const create = async (data, options = {}) => {
  const instance = await Transaction.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a transaction by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Transaction.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a transaction by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Transaction.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a transaction by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Transaction.update(data, {
    where: { id },
    transaction,
  });
  return Transaction.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

module.exports = {
  findById,
  findByPublicId,
  findOne,
  findAll,
  create,
  update,
  updateById,
  destroy,
};
