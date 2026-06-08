const db = require("../models");
const Item = db.Item;

/**
 * Finds an item by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Item|null>}
 */
const findById = async (id, options = {}) => {
  return Item.findByPk(id, options);
};

/**
 * Finds an item by its public ID.
 * @param {string} publicId
 * @param {object} [options]
 * @returns {Promise<Item|null>}
 */
const findByPublicId = async (publicId, options = {}) => {
  return Item.findOne({
    where: { public_id: publicId },
    ...options,
  });
};

/**
 * Finds a single item matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Item|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Item.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all items matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Item[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return Item.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new item.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Item>}
 */
const create = async (data, options = {}) => {
  const instance = await Item.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates an item by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Item.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes an item by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Item.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates an item by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Item.update(data, {
    where: { id },
    transaction,
  });
  return Item.findByPk(id, {
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
