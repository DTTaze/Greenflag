const db = require("../models");
const Rank = db.Rank;

/**
 * Finds a rank by its ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Rank|null>}
 */
const findById = async (id, options = {}) => {
  return Rank.findByPk(id, options);
};

/**
 * Finds a single rank matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Rank|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Rank.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all ranks matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Rank[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return Rank.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new rank record.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Rank>}
 */
const create = async (data, options = {}) => {
  const instance = await Rank.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a rank by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Rank.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a rank by ID or conditions.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Rank.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a rank by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Rank.update(data, {
    where: { id },
    transaction,
  });
  return Rank.findByPk(id, {
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
