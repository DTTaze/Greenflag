const db = require("../models");
const Coin = db.Coin;

/**
 * Finds a coin record by its primary ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Coin|null>}
 */
const findById = async (id, options = {}) => {
  return Coin.findByPk(id, options);
};

/**
 * Creates a new coin record.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Coin>}
 */
const create = async (data, options = {}) => {
  const instance = await Coin.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a coin record by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Coin.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a coin record by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Coin.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a coin record by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Coin.update(data, {
    where: { id },
    transaction,
  });
  return Coin.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

/**
 * Finds a single coin record matching the query criteria.
 * @param {object} [queryOptions]
 * @param {object} [options]
 * @returns {Promise<Coin|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Coin.findOne({
    ...queryOptions,
    ...options,
  });
};

module.exports = {
  findById,
  create,
  update,
  updateById,
  destroy,
  findOne,
};
