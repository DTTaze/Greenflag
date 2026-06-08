const db = require("../models");
const Product = db.Product;

/**
 * Finds a product by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Product|null>}
 */
const findById = async (id, options = {}) => {
  return Product.findByPk(id, options);
};

/**
 * Finds a product by public ID.
 * @param {string} publicId
 * @param {object} [options]
 * @returns {Promise<Product|null>}
 */
const findByPublicId = async (publicId, options = {}) => {
  return Product.findOne({
    where: { public_id: publicId },
    ...options,
  });
};

/**
 * Finds a single product matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Product|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Product.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all products matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Product[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return Product.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new product.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Product>}
 */
const create = async (data, options = {}) => {
  return Product.create(data, options);
};

/**
 * Updates a product by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Product.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a product by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Product.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a product by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Product.update(data, {
    where: { id },
    transaction,
  });
  return Product.findByPk(id, {
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
