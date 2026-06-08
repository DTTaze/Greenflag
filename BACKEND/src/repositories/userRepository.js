const db = require("../models");
const User = db.User;

/**
 * Finds a user by their primary ID.
 * @param {number} id
 * @param {object} [options] - Sequelize query options (e.g. transaction, include, raw)
 * @returns {Promise<User|null>}
 */
const findById = async (id, options = {}) => {
  return User.findOne({
    where: { id },
    ...options,
  });
};

/**
 * Finds a user by their public ID.
 * @param {string} publicId
 * @param {object} [options]
 * @returns {Promise<User|null>}
 */
const findByPublicId = async (publicId, options = {}) => {
  return User.findOne({
    where: { public_id: publicId },
    ...options,
  });
};

/**
 * Finds a single user matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<User|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return User.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all users matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<User[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return User.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new user.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<User>}
 */
const create = async (data, options = {}) => {
  const instance = await User.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a user by their ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return User.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a user by their ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return User.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a user by their ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await User.update(data, {
    where: { id },
    transaction,
  });
  return User.findByPk(id, {
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
