const eventService = require("../services/eventService");

const handleGetEventbyId = async (req, res) => {
  const eventId = req.params.event_id;
  const event = await eventService.getEventById(eventId);
  if (!event) {
    return res.error(404, "Event not found");
  }
  return res.success("Event gotten successfully", event);
};

const handleGetAllEvents = async (req, res) => {
  const events = await eventService.getAllEvents();
  return res.success("Events retrieved successfully", events);
};

const handleGetEventSigned = async (req, res) => {
  const userId = req.params.user_id ? req.params.user_id : req.user.id;
  const events = await eventService.getEventSigned(userId);
  return res.success("Events retrieved successfully", events);
};

const handleGetEventSignedByUserId = async (req, res) => {
  const userId = req.params.user_id;
  const events = await eventService.getEventSignedByUserId(userId);
  return res.success("Events retrieved successfully", events);
};

const handGetEventsOfCreator = async (req, res) => {
  const creator_id = req.user.id;
  const events = await eventService.getEventsOfCreator(creator_id);
  return res.success("Events retrieved successfully", events);
};

const handleDeleteEventUserById = async (req, res) => {
  const eventUserId = Number(req.params.eventUser_id);
  const result = await eventService.deleteEventUserById(eventUserId);
  if (!result) {
    return res.error(404, "Event user have not been delete");
  }
  return res.success("Event user delete successfully");
};

const handlegetEventUserByEventId = async (req, res) => {
  const eventId = Number(req.params.event_id);
  const event = await eventService.getEventUserByEventId(eventId);
  if (!event) {
    return res.error(404, "Event not found");
  }
  return res.success("Event users retrieved successfully", event);
};

const handleCreateEvent = async (req, res) => {
  const images = req.files;
  const user_id = req.user.id;
  const event = await eventService.createEvent(req.body, user_id, images);
  if (!event) {
    return res.error(500, "Event creation failed");
  }
  return res.success("Event created successfully", event);
};

const handleAcceptEvent = async (req, res) => {
  const eventId = Number(req.params.event_id);
  const userId = Number(req.user.id);
  const event = await eventService.acceptEvent(eventId, userId);
  if (!event) {
    return res.error(404, "Event not found");
  }
  return res.success("Event accepted successfully", event);
};

const handleUpdateEvent = async (req, res) => {
  const event_id = req.params.event_id;
  const images = req.files;
  const event = await eventService.updateEvent(event_id, req.body, images);
  if (!event) {
    return res.error(404, "Event not found");
  }
  return res.success("Event updated successfully", event);
};

const handleDeleteEvent = async (req, res) => {
  const eventId = Number(req.params.event_id);
  const event = await eventService.deleteEvent(eventId);
  if (!event) {
    return res.error(404, "Event not found");
  }
  return res.success("Event deleted successfully", event);
};

const handleCheckInUserByUserId = async (req, res) => {
  const event_id = Number(req.body.event_id);
  const user_id = Number(req.body.user_id);
  const result = await eventService.checkInUserByUserId(event_id, user_id);
  if (!result) {
    return res.error(404, "EventUser not found");
  }
  return res.success("User checked in successfully", result);
};

const handleCheckOutUserByUserId = async (req, res) => {
  const event_id = Number(req.body.event_id);
  const user_id = Number(req.body.user_id);
  const result = await eventService.checkOutUserByUserId(event_id, user_id);
  return res.success("User checked in successfully", result);
};

module.exports = {
  handleGetEventbyId,
  handleGetAllEvents,
  handleGetEventSigned,
  handleGetEventSignedByUserId,
  handGetEventsOfCreator,
  handlegetEventUserByEventId,
  handleCreateEvent,
  handleAcceptEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleCheckInUserByUserId,
  handleCheckOutUserByUserId,
  handleDeleteEventUserById,
};
