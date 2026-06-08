const db = require("../models/index");
const Event = db.Event;
const EventUser = db.EventUser;
const User = db.User;
const Image = db.Image;
const { nanoid } = require("nanoid");
const { uploadImages, deleteImages } = require("./imageService");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const { EVENT_STATUS } = require("../constants/eventStatus");
const { getImageById } = require("./imageService");
const { getUserByID } = require("./userService");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const AppError = require("../errors/AppError");

const cacheEventId = (id) => CACHE_KEYS.EVENT.CAMPAIGN_BY_ID(id);
const cacheEventAll = CACHE_KEYS.EVENT.ALL_CAMPAIGNS;
const cacheEventUserId = (id) => CACHE_KEYS.EVENT.CAMPAIGN_USER_BY_ID(id);
const cacheEventUserAll = CACHE_KEYS.EVENT.ALL_CAMPAIGN_USERS;

const getEventById = async (eventId) => {
  try {
    const cachedEvent = await getCache(cacheEventId(eventId));
    if (cachedEvent) {
      console.log("cachedEvent", cachedEvent);
      console.log("imageIds:", cachedEvent.imagesId);
      const event = cachedEvent;
      let uploadedImages = [];
      for (const imageId of event.imagesId) {
        if (!imageId) {
          continue;
        }
        // Check if imageId is valid
        const image = await getImageById(imageId);
        if (image) {
          uploadedImages.push(image);
        }
      }
      const creator = await getUserByID(event.creator_id);

      const imagesFormat = uploadedImages.map((image) => image.url);

      const eventFormat = {
        ...event,
        images: imagesFormat,
        creator: {
          username: creator.username,
        },
      };
      delete eventFormat.imagesId;
      return eventFormat;
    }

    const event = await Event.findOne({
      where: { id: eventId },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const uploadedImages = await Image.findAll({
      where: {
        reference_id: eventId,
        reference_type: "event",
      },
      attributes: ["id", "url"],
    });
    console.log(`images of event ${eventId} : `, uploadedImages);

    const imagesFormat = uploadedImages.map((image) => image.url);

    //Cache event
    const cachedEventFormat = {
      ...event.toJSON(),
      imagesId: uploadedImages.map((image) => image.id),
    };
    delete cachedEventFormat.images;
    delete cachedEventFormat.creator;
    await setCache(cacheEventId(eventId), cachedEventFormat);

    return {
      ...event.toJSON(),
      images: imagesFormat,
    };
  } catch (error) {
    console.error("Error retrieving event:", error);
    throw error;
  }
};

const getAllEvents = async () => {
  try {
    const cachedEventIds = await getCache(cacheEventAll);
    if (cachedEventIds) {
      console.log("cachedEventIds", cachedEventIds);
      const events = [];
      for (const eventId of cachedEventIds) {
        const event = await getEventById(eventId);
        if (event) {
          events.push(event);
        }
      }
      return events;
    }

    const events = await Event.findAll({
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    });
    const eventsWithImages = [];
    const eventIds = [];
    for (const event of events) {
      const uploadedImages = await Image.findAll({
        where: {
          reference_id: event.id,
          reference_type: "event",
        },
        attributes: ["url"],
      });
      const imagesFormat = uploadedImages.map((image) => image.url);
      const eventFormat = {
        ...event.toJSON(),
        images: imagesFormat,
      };
      eventsWithImages.push(eventFormat);

      eventIds.push(event.id);
    }

    // Cache all events
    await setCache(cacheEventAll, eventIds);

    return eventsWithImages;
  } catch (error) {
    console.error("Error retrieving events:", error);
    throw error;
  }
};

const getEventUserById = async (id) => {
  try {
    if (!id) throw new BadRequestError(`eventuser id is required`);
    const eventuserCache = await getCache(cacheEventUserId(id));
    if (eventuserCache) {
      console.log("eventuserCache", eventuserCache);
      const User = await getUserByID(eventuserCache.user_id);
      const Event = await getEventById(eventuserCache.event_id);
      const eventuserformat = {
        ...eventuserCache,
        User,
        Event,
      };
      return eventuserformat;
    }

    const eventuser = await EventUser.findByPk(id, {
      include: [
        {
          model: User,
        },
        {
          model: Event,
        },
      ],
    });

    if (!eventuser) {
      throw new NotFoundError(`eventuser id ${id} doesn't exit`);
    }

    //Cache eventuser
    const eventuserFormat = {
      ...eventuser.toJSON(),
    };
    delete eventuserFormat.events;
    delete eventuserFormat.users;
    await setCache(cacheEventUserId(id), eventuserFormat);

    return eventuser;
  } catch (error) {
    console.log(`error get event user id ${id} :`, error);
    throw error;
  }
};

const getAllEventUser = async () => {
  try {
    const allEventUserIds = await getCache(cacheEventUserAll);
    if (allEventUserIds) {
      console.log("allEventUserIds", allEventUserIds);
      let result = [];
      for (const eventUserid of allEventUserIds) {
        const eventuser = await getEventUserById(Number(eventUserid));
        result.push(eventuser);
      }
      return result;
    }

    const allEventUsers = await EventUser.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Event,
        },
      ],
    });

    //Cache eventuser
    let eventUserIds = allEventUsers.map((eventUser) => eventUser.id);
    await setCache(cacheEventUserAll, eventUserIds);

    return allEventUsers;
  } catch (error) {
    console.log("error get all event user : ", error);
    throw error;
  }
};

const getEventSigned = async (user_id) => {
  try {
    const allEventUsers = await getAllEventUser();
    let result = [];

    for (const eventuser of allEventUsers) {
      if (Number(eventuser.user_id) === Number(user_id)) {
        const eventuserFormat = {
          ...(typeof eventuser.toJSON === "function" ? eventuser.toJSON() : eventuser),
        };

        delete eventuserFormat.users;
        result.push(eventuserFormat);
      }
    }

    return result;
  } catch (error) {
    console.error("Error retrieving signed events:", error);
    throw error;
  }
};

const getEventsOfCreator = async (creator_id) => {
  try {
    const allevents = await getAllEvents();
    const result = [];
    for (const event of allevents) {
      if (Number(event.creator_id) === Number(creator_id)) result.push(event);
    }

    return result;
  } catch (error) {
    console.error("Error get events of creator:", error);
    throw error;
  }
};

const getEventUserByEventId = async (event_id) => {
  try {
    const allEventUser = await getAllEventUser();
    console.log("allEventUser :", allEventUser);
    const eventUsers = allEventUser.filter(
      (eventUser) => Number(eventUser.event_id) === Number(event_id),
    );

    return eventUsers;
  } catch (error) {
    console.error("Error retrieving event users:", error);
    throw error;
  }
};

const createEvent = async (Data, user_id, images) => {
  try {
    const { title, description, location, capacity, end_sign, start_time, end_time, coins } = Data;

    // Validate required fields
    if (!title || !description || !start_time || !end_time || !location || !capacity || !coins) {
      throw new BadRequestError("All fields are required");
    }

    // Check creator_id
    const creator = await getUserByID(user_id);

    // Validate datetime format
    const isValidDate = (date) => !isNaN(Date.parse(date));
    if (!isValidDate(start_time) || !isValidDate(end_time)) {
      console.log("start_time", start_time);
      console.log("end_time", end_time);
      throw new BadRequestError("Invalid date format for start_time or end_time");
    }

    const event = await Event.create({
      public_id: nanoid(),
      creator_id: user_id,
      title,
      description,
      location,
      capacity,
      end_sign: new Date(end_sign),
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      coins: Number(coins),
    });

    let uploadedImages = [];
    if (images && images.length > 0) {
      uploadedImages = await uploadImages(images, event.id, "event");
    }

    const imagesFormat = uploadedImages.reduce((acc, image) => {
      if (!acc[image.reference_id]) {
        acc[image.reference_id] = [];
      }
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    // Cache the event
    const eventCacheFormat = {
      ...event.toJSON(),
      imagesId: uploadedImages.map((image) => image.id),
    };

    //delete cache
    await setCache(cacheEventId(event.id), eventCacheFormat);
    await deleteCache(cacheEventAll);
    return {
      ...event.toJSON(),
      creator: {
        id: creator.id,
        username: creator.username,
      },
      images: imagesFormat,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const createEventUser = async (eventId, userId) => {
  try {
    const eventUser = await EventUser.create({
      event_id: eventId,
      user_id: userId,
    });

    //Cache eventuser
    await setCache(cacheEventUserId(eventUser.id));
    await deleteCache(cacheEventUserAll);

    return eventUser;
  } catch (error) {
    console.error("Error create eventuser:", error);
    throw error;
  }
};

const acceptEvent = async (eventId, userId) => {
  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const eventUser = await createEventUser(eventId, userId);

    return eventUser;
  } catch (error) {
    console.error("Error accepting event:", error);
    throw error;
  }
};

const updateEvent = async (event_id, Data, images) => {
  try {
    const { title, description, location, capacity, start_time, end_time, status, coins } = Data;
    let updateFields = {};

    if (title) {
      updateFields.title = title;
    }
    if (description) {
      updateFields.description = description;
    }
    if (location) {
      updateFields.location = location;
    }

    if (capacity) {
      if (Number(capacity !== capacity)) {
        throw new BadRequestError("Capacity must be a number");
      }
      if (Number(capacity) <= 0) {
        throw new BadRequestError("Capacity must be greater than 0");
      }
      updateFields.capacity = capacity;
    }

    const isValidDate = (date) => !isNaN(Date.parse(date));
    if (start_time) {
      if (!isValidDate(start_time)) {
        console.log("start_time", start_time);
        throw new BadRequestError("Invalid date format for start_time");
      }
      updateFields.start_time = new Date(start_time);
    }

    if (end_time) {
      if (!isValidDate(end_time)) {
        console.log("end_time", end_time);
        throw new BadRequestError("Invalid date format for end_time");
      }
      updateFields.end_time = new Date(end_time);
    }

    if (status) {
      const validStatuses = Object.values(EVENT_STATUS);
      if (!validStatuses.includes(status)) {
        throw new BadRequestError("Invalid status value");
      }
      updateFields.status = status;
    }

    if (coins) {
      if (typeof coins === "number" && !isNaN(coins)) {
        updateFields.coins = coins;
      }
    }

    const event = await Event.findByPk(event_id);

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    await event.update(updateFields);

    //delete cache
    await deleteCache(cacheEventId(event_id));
    await deleteCache(cacheEventAll);
    const eventuserByEventId = await EventUser.findAll({
      where: {
        event_id,
      },
      attributes: ["id"],
    });

    for (const eventUser of eventuserByEventId) {
      await deleteCache(cacheEventUserId(eventUser.id));
    }

    let uploadedImages = [];

    if (images && images.length > 0) {
      // Delete old images and cache
      await deleteImages(event.id, "event");
      // Upload new images and cache
      uploadedImages = await uploadImages(images, event.id, "event");

      if (!uploadedImages || uploadedImages.length === 0) {
        throw new AppError("Failed to upload images", 500);
      }
    } else {
      uploadedImages = await Image.findAll({
        where: {
          reference_id: event.id,
          reference_type: "event",
        },
        attributes: ["url"],
      });
    }

    return {
      ...event.toJSON(),
      images: uploadedImages.map((image) => image.url),
    };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

const deleteEvent = async (event_id) => {
  try {
    const event = await Event.findByPk(event_id);
    if (!event) {
      throw new NotFoundError("Event not found");
    }

    let listImagesBeforeDelete = await deleteImages(event_id, "event");

    listImagesBeforeDelete = listImagesBeforeDelete.map((image) => image.url);

    //delete cache
    await deleteCache(cacheEventId(event_id));
    await deleteCache(cacheEventAll);
    await deleteCache(cacheEventUserAll);
    const eventuserByEventId = await EventUser.findAll({
      where: {
        event_id,
      },
      attributes: ["id"],
    });

    for (const eventUser of eventuserByEventId) {
      await deleteCache(cacheEventUserId(eventUser.id));
    }

    await event.destroy();

    return {
      ...event.toJSON(),
      images: listImagesBeforeDelete,
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const checkInUserByUserId = async (event_id, user_id) => {
  try {
    if (!event_id || !user_id) {
      throw new BadRequestError("Event ID and User ID are required");
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const event = await Event.findByPk(event_id);
    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const eventUser = await EventUser.findOne({
      where: { event_id, user_id },
    });

    if (!eventUser) {
      throw new NotFoundError("User not found in this event");
    }

    await eventUser.update({ joined_at: new Date() });

    //del cache eventuser id
    await deleteCache(cacheEventUserId(eventUser.id));

    return eventUser;
  } catch (error) {
    console.error("Error checking in user:", error);
    throw error;
  }
};

const checkOutUserByUserId = async (event_id, user_id) => {
  try {
    if (!event_id || !user_id) {
      throw new BadRequestError("Event ID and User ID are required");
    }
    user_id = Number(user_id);
    event_id = Number(event_id);

    const user = await getUserByID(user_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const event = await getEventById(event_id);
    if (!event) {
      throw new NotFoundError("Event not found");
    }

    const eventUser = await EventUser.findOne({
      where: { event_id, user_id },
    });

    if (!eventUser) {
      throw new NotFoundError("User not found in this event");
    }

    await eventUser.update({ completed_at: new Date() });

    //del cache eventuser id
    await deleteCache(cacheEventUserId(eventUser.id));

    return eventUser;
  } catch (error) {
    console.error("Error checking in user:", error);
    throw error;
  }
};

const deleteEventUserById = async (eventUserId) => {
  try {
    const result = await EventUser.destroy({
      where: {
        id: eventUserId,
      },
    });

    if (result === 0) {
      throw new NotFoundError(`No event user found with the given event UserId : ${eventUserId}`);
    }

    await deleteCache(cacheEventUserId(eventUserId));
    await deleteCache(cacheEventUserAll);
    return result;
  } catch (error) {
    console.error("Error deleting event user:", error);
    throw error;
  }
};

module.exports = {
  getEventById,
  getAllEvents,
  getEventSigned,
  getEventsOfCreator,
  getEventUserByEventId,
  createEvent,
  acceptEvent,
  updateEvent,
  deleteEvent,
  checkInUserByUserId,
  checkOutUserByUserId,
  deleteEventUserById,
};
