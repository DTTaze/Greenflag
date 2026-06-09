const db = require("../models");
const TaskSubmit = db.TaskSubmit;

/**
 * Finds a task submission by its ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<TaskSubmit|null>}
 */
const findById = async (id, options = {}) => {
  return TaskSubmit.findByPk(id, options);
};

/**
 * Finds a single task submission matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<TaskSubmit|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return TaskSubmit.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all task submissions matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<TaskSubmit[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return TaskSubmit.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new task submission.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<TaskSubmit>}
 */
const create = async (data, options = {}) => {
  const instance = await TaskSubmit.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates a task submission by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return TaskSubmit.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Deletes a task submission by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return TaskSubmit.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Updates a task submission by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await TaskSubmit.update(data, {
    where: { id },
    transaction,
  });
  return TaskSubmit.findByPk(id, {
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
