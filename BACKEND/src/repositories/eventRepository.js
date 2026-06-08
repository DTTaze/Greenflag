const db = require("../models");
const Event = db.Event;
const EventUser = db.EventUser;

// --- Event Basic Operations ---

/**
 * Finds an event by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<Event|null>}
 */
const findById = async (id, options = {}) => {
  return Event.findByPk(id, options);
};

/**
 * Finds an event by public ID.
 * @param {string} publicId
 * @param {object} [options]
 * @returns {Promise<Event|null>}
 */
const findByPublicId = async (publicId, options = {}) => {
  return Event.findOne({
    where: { public_id: publicId },
    ...options,
  });
};

/**
 * Finds a single event matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Event|null>}
 */
const findOne = async (queryOptions = {}, options = {}) => {
  return Event.findOne({
    ...queryOptions,
    ...options,
  });
};

/**
 * Finds all events matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<Event[]>}
 */
const findAll = async (queryOptions = {}, options = {}) => {
  return Event.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Creates a new event.
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<Event>}
 */
const create = async (data, options = {}) => {
  const instance = await Event.create(data, options);
  return options.raw ? instance.get({ plain: true }) : instance;
};

/**
 * Updates an event by ID.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<[number]>}
 */
const update = async (id, data, options = {}) => {
  return Event.update(data, {
    where: { id },
    ...options,
  });
};

/**
 * Updates an event by ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await Event.update(data, {
    where: { id },
    transaction,
  });
  return Event.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

/**
 * Deletes an event by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroy = async (id, options = {}) => {
  return Event.destroy({
    where: { id },
    ...options,
  });
};

// --- EventUser Pivot Operations ---

/**
 * Finds an EventUser by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<EventUser|null>}
 */
const findEventUserById = async (id, options = {}) => {
  return EventUser.findByPk(id, options);
};

/**
 * Finds an EventUser link by user ID and event ID.
 * @param {number} userId
 * @param {number} eventId
 * @param {object} [options]
 * @returns {Promise<EventUser|null>}
 */
const findEventUser = async (userId, eventId, options = {}) => {
  return EventUser.findOne({
    where: { user_id: userId, event_id: eventId },
    ...options,
  });
};

/**
 * Creates an EventUser record (registers user for an event).
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<EventUser>}
 */
const createEventUser = async (data, options = {}) => {
  return EventUser.create(data, options);
};

/**
 * Updates an EventUser record by its ID and returns the updated plain object.
 * @param {number} id
 * @param {object} data
 * @param {object} [options]
 * @returns {Promise<object|null>}
 */
const updateEventUserById = async (id, data, options = {}) => {
  const { transaction, ...otherOptions } = options;
  await EventUser.update(data, {
    where: { id },
    transaction,
  });
  return EventUser.findByPk(id, {
    transaction,
    raw: true,
    nest: true,
    ...otherOptions,
  });
};

/**
 * Deletes an EventUser record by ID.
 * @param {number} id
 * @param {object} [options]
 * @returns {Promise<number>}
 */
const destroyEventUser = async (id, options = {}) => {
  return EventUser.destroy({
    where: { id },
    ...options,
  });
};

/**
 * Finds all EventUser records matching query options.
 * @param {object} queryOptions
 * @param {object} [options]
 * @returns {Promise<EventUser[]>}
 */
const findAllEventUsers = async (queryOptions = {}, options = {}) => {
  return EventUser.findAll({
    ...queryOptions,
    ...options,
  });
};

/**
 * Idempotently registers a user for an event (graceful bypass using findOrCreate).
 * @param {number} eventId
 * @param {number} userId
 * @param {object} [options]
 * @returns {Promise<{eventUser: object, isNew: boolean}>}
 */
const addUserToEvent = async (eventId, userId, options = {}) => {
  const { transaction } = options;
  const [eventUser, created] = await EventUser.findOrCreate({
    where: { event_id: eventId, user_id: userId },
    defaults: {
      joined_at: new Date(),
    },
    transaction,
  });
  return {
    eventUser: eventUser.get({ plain: true }),
    isNew: created,
  };
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
  findEventUserById,
  findEventUser,
  createEventUser,
  updateEventUserById,
  destroyEventUser,
  findAllEventUsers,
  addUserToEvent,
};
