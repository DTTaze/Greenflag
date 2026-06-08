const db = require("../models");
const Image = db.Image;

/**
 * Finds an image by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Image|null>}
 */
const findById = async (id, options = {}) => {
  return Image.findByPk(id, options);
};

/**
 * Finds a single image matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Image|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Image.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all images matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Image[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return Image.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new image record.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Image>}
 */
const create = async (data, options = {}) => {
  return Image.create(data, options);
};

/**
 * Updates an image record by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Image.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes images matching conditions.
 * @param {object} conditions
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (conditions, options = {}) => {
  return Image.destroy({
    where: conditions,
    ...options,
  });
};

/**
 * Updates an image record by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Image.update(data, {
    where: { id },
    transaction,
  });
  return Image.findByPk(id, {
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
