const db = require("../models/index");
const eventRepo = require("../repositories/eventRepository");
const userRepo = require("../repositories/userRepository");
const imageRepo = require("../repositories/imageRepository");
const { nanoid } = require("nanoid");
const { uploadImages, deleteImages } = require("./imageService");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
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

  const event = await eventRepo.findOne(
    {
      where: { id: eventId },
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    },
    { raw: true, nest: true },
  );

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const uploadedImages = await imageRepo.findAll(
    {
      where: {
        reference_id: eventId,
        reference_type: "event",
      },
      attributes: ["id", "url"],
    },
    { raw: true, nest: true },
  );
  console.log(`images of event ${eventId} : `, uploadedImages);

  const imagesFormat = uploadedImages.map((image) => image.url);

  //Cache event
  const cachedEventFormat = {
    ...event,
    imagesId: uploadedImages.map((image) => image.id),
  };
  delete cachedEventFormat.images;
  delete cachedEventFormat.creator;
  await setCache(cacheEventId(eventId), cachedEventFormat);

  return {
    ...event,
    images: imagesFormat,
  };
};

const getAllEvents = async () => {
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

  const events = await eventRepo.findAll(
    {
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: ["username"],
        },
      ],
    },
    { raw: true, nest: true },
  );

  const eventsWithImages = [];
  const eventIds = [];
  for (const event of events) {
    const uploadedImages = await imageRepo.findAll(
      {
        where: {
          reference_id: event.id,
          reference_type: "event",
        },
        attributes: ["url"],
      },
      { raw: true, nest: true },
    );
    const imagesFormat = uploadedImages.map((image) => image.url);
    const eventFormat = {
      ...event,
      images: imagesFormat,
    };
    eventsWithImages.push(eventFormat);

    eventIds.push(event.id);
  }

  // Cache all events
  await setCache(cacheEventAll, eventIds);

  return eventsWithImages;
};

const getEventUserById = async (id) => {
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

  const eventuser = await eventRepo.findEventUserById(
    id,
    {
      include: [
        {
          model: db.User,
        },
        {
          model: db.Event,
        },
      ],
    },
    { raw: true, nest: true },
  );

  if (!eventuser) {
    throw new NotFoundError(`eventuser id ${id} doesn't exit`);
  }

  const eventuserFormat = {
    ...eventuser,
  };
  delete eventuserFormat.events;
  delete eventuserFormat.users;
  await setCache(cacheEventUserId(id), eventuserFormat);

  return eventuser;
};

const getAllEventUser = async () => {
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

  const allEventUsers = await eventRepo.findAllEventUsers(
    {
      include: [
        {
          model: db.User,
        },
        {
          model: db.Event,
        },
      ],
    },
    { raw: true, nest: true },
  );

  let eventUserIds = allEventUsers.map((eventUser) => eventUser.id);
  await setCache(cacheEventUserAll, eventUserIds);

  return allEventUsers;
};

const getEventSigned = async (user_id) => {
  const allEventUsers = await getAllEventUser();
  let result = [];

  for (const eventuser of allEventUsers) {
    if (Number(eventuser.user_id) === Number(user_id)) {
      const eventuserFormat = {
        ...eventuser,
      };

      delete eventuserFormat.users;
      result.push(eventuserFormat);
    }
  }

  return result;
};

const getEventsOfCreator = async (creator_id) => {
  const allevents = await getAllEvents();
  const result = [];
  for (const event of allevents) {
    if (Number(event.creator_id) === Number(creator_id)) result.push(event);
  }

  return result;
};

const getEventUserByEventId = async (event_id) => {
  const allEventUser = await getAllEventUser();
  console.log("allEventUser :", allEventUser);
  const eventUsers = allEventUser.filter(
    (eventUser) => Number(eventUser.event_id) === Number(event_id),
  );

  return eventUsers;
};

const createEvent = async (Data, user_id, images) => {
  const { title, description, location, capacity, end_sign, start_time, end_time, coins } = Data;

  const creator = await getUserByID(user_id);

  const event = await eventRepo.create(
    {
      public_id: nanoid(),
      creator_id: user_id,
      title,
      description,
      location,
      capacity,
      end_sign,
      start_time,
      end_time,
      coins,
    },
    { raw: true, nest: true },
  );

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

  const eventCacheFormat = {
    ...event,
    imagesId: uploadedImages.map((image) => image.id),
  };

  await setCache(cacheEventId(event.id), eventCacheFormat);
  await deleteCache(cacheEventAll);
  return {
    ...event,
    creator: {
      id: creator.id,
      username: creator.username,
    },
    images: imagesFormat,
  };
};

const createEventUser = async (eventId, userId) => {
  const { eventUser } = await eventRepo.addUserToEvent(eventId, userId);

  await setCache(cacheEventUserId(eventUser.id), eventUser);
  await deleteCache(cacheEventUserAll);

  return eventUser;
};

const acceptEvent = async (eventId, userId) => {
  const event = await eventRepo.findById(eventId, { raw: true, nest: true });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const user = await userRepo.findById(userId, { raw: true, nest: true });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const eventUser = await createEventUser(eventId, userId);

  return eventUser;
};

const updateEvent = async (event_id, Data, images) => {
  const { title, description, location, capacity, start_time, end_time, status, coins } = Data;
  let updateFields = {};

  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (location !== undefined) updateFields.location = location;
  if (capacity !== undefined) updateFields.capacity = capacity;
  if (start_time !== undefined) updateFields.start_time = start_time;
  if (end_time !== undefined) updateFields.end_time = end_time;
  if (status !== undefined) updateFields.status = status;
  if (coins !== undefined) updateFields.coins = coins;

  const event = await eventRepo.findById(event_id, { raw: true, nest: true });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const updatedEvent = await eventRepo.updateById(event_id, updateFields);

  await deleteCache(cacheEventId(event_id));
  await deleteCache(cacheEventAll);
  const eventuserByEventId = await eventRepo.findAllEventUsers(
    {
      where: {
        event_id,
      },
      attributes: ["id"],
    },
    { raw: true, nest: true },
  );

  for (const eventUser of eventuserByEventId) {
    await deleteCache(cacheEventUserId(eventUser.id));
  }

  let uploadedImages;

  if (images && images.length > 0) {
    await deleteImages(event_id, "event");
    uploadedImages = await uploadImages(images, event_id, "event");

    if (!uploadedImages || uploadedImages.length === 0) {
      throw new AppError("Failed to upload images", 500);
    }
  } else {
    uploadedImages = await imageRepo.findAll(
      {
        where: {
          reference_id: event_id,
          reference_type: "event",
        },
        attributes: ["url"],
      },
      { raw: true, nest: true },
    );
  }

  return {
    ...updatedEvent,
    images: uploadedImages.map((image) => image.url),
  };
};

const deleteEvent = async (event_id) => {
  const event = await eventRepo.findById(event_id, { raw: true, nest: true });
  if (!event) {
    throw new NotFoundError("Event not found");
  }

  let listImagesBeforeDelete = await deleteImages(event_id, "event");

  const imageUrls = listImagesBeforeDelete.map((image) => image.url);

  await deleteCache(cacheEventId(event_id));
  await deleteCache(cacheEventAll);
  await deleteCache(cacheEventUserAll);
  const eventuserByEventId = await eventRepo.findAllEventUsers(
    {
      where: {
        event_id,
      },
      attributes: ["id"],
    },
    { raw: true, nest: true },
  );

  for (const eventUser of eventuserByEventId) {
    await deleteCache(cacheEventUserId(eventUser.id));
  }

  await eventRepo.destroy(event_id);

  return {
    ...event,
    images: imageUrls,
  };
};

const checkInUserByUserId = async (event_id, user_id) => {
  if (!event_id || !user_id) {
    throw new BadRequestError("Event ID and User ID are required");
  }
  const user = await userRepo.findById(user_id, { raw: true, nest: true });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const event = await eventRepo.findById(event_id, { raw: true, nest: true });
  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const eventUser = await eventRepo.findEventUser(user_id, event_id, { raw: true, nest: true });

  if (!eventUser) {
    throw new NotFoundError("User not found in this event");
  }

  const updatedEventUser = await eventRepo.updateEventUserById(eventUser.id, {
    joined_at: new Date(),
  });

  await deleteCache(cacheEventUserId(eventUser.id));

  return updatedEventUser;
};

const checkOutUserByUserId = async (event_id, user_id) => {
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

  const eventUser = await eventRepo.findEventUser(user_id, event_id, { raw: true, nest: true });

  if (!eventUser) {
    throw new NotFoundError("User not found in this event");
  }

  const updatedEventUser = await eventRepo.updateEventUserById(eventUser.id, {
    completed_at: new Date(),
  });

  await deleteCache(cacheEventUserId(eventUser.id));

  return updatedEventUser;
};

const deleteEventUserById = async (eventUserId) => {
  const result = await eventRepo.destroyEventUser(eventUserId);

  if (result === 0) {
    throw new NotFoundError(`No event user found with the given event UserId : ${eventUserId}`);
  }

  await deleteCache(cacheEventUserId(eventUserId));
  await deleteCache(cacheEventUserAll);
  return result;
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
