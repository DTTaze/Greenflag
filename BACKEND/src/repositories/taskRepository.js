const db = require("../models");
const Task = db.Task;
const TaskUser = db.TaskUser;

// --- Task Basic Operations ---

/**
 * Finds a task by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Task|null>}
 */
const findById = async (id, options = {}) => {
  return Task.findByPk(id, options);
};

/**
 * Finds a task by public ID.
 * @param {string} publicId
 * @param {object} [options]
 * @returns {Promise<Task|null>}
 */
const findByPublicId = async (publicId, options = {}) => {
  return Task.findOne({
    where: { public_id: publicId },
    ...options,
  });
};

/**
 * Finds a single task matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Task|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Task.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all tasks matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Task[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return Task.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new task.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Task>}
 */
const create = async (data, options = {}) => {
  return Task.create(data, options);
};

/**
 * Updates a task by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Task.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Updates a task by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Task.update(data, {
    where: { id },
    transaction,
  });
  return Task.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

/**
 * Deletes a task by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Task.destroy({
    where: { id },
    ...options,
  });
};

// --- TaskUser Pivot Operations ---

/**
 * Finds a TaskUser link by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<TaskUser|null>}
 */
const findTaskUserById = async (id, options = {}) => {
  return TaskUser.findByPk(id, options);
};

/**
 * Finds a specific TaskUser link by user ID and task ID.
 * @param {number} userId
 * @param {number} taskId
 * @param {object} [options]
 * @returns {Promise<TaskUser|null>}
 */
const findTaskUser = async (userId, taskId, options = {}) => {
  return TaskUser.findOne({
    where: { user_id: userId, task_id: taskId },
    ...options,
  });
};

/**
 * Assigns a task to a user (creates a TaskUser link).
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<TaskUser>}
 */
const createTaskUser = async (data, options = {}) => {
  return TaskUser.create(data, options);
};

/**
 * Updates a TaskUser record by its ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateTaskUserById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await TaskUser.update(data, {
    where: { id },
    transaction,
  });
  return TaskUser.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

/**
 * Deletes a TaskUser record.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroyTaskUser = async (id, options = {}) => {
  return TaskUser.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Finds all TaskUser records matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<TaskUser[]>}
 */
const findAllTaskUsers = async (queryOptions = {}, options = {}) => {
  return TaskUser.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all tasks belonging to a specific type name.
 * @param {string} typeName
 * @param {object} [options]
 * @returns {Promise<object[]>}
 */
const findTasksByTypeName = async (typeName, options = {}) => {
  const { transaction, ...otherOptions } = options;
  const type = await db.Type.findOne({
    where: { name: typeName },
    transaction,
  });
  if (!type) return [];
  const taskTypes = await db.TaskType.findAll({
    where: { type_id: type.id },
    include: [{ model: Task }],
    transaction,
    ...otherOptions,
  });
  return taskTypes
    .map((tt) => (tt.Task ? (tt.Task.get ? tt.Task.get({ plain: true }) : tt.Task) : null))
    .filter(Boolean);
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
  findTaskUserById,
  findTaskUser,
  createTaskUser,
  updateTaskUserById,
  destroyTaskUser,
  findAllTaskUsers,
  findTasksByTypeName,
};
