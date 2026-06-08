const express = require("express");
const router = express.Router();
const middlewareImage = require("../middlewares/middlewareImage");
const validate = require("../middlewares/validate");
const requirePermission = require("../middlewares/requirePermission");
const { createEventDto, updateEventDto, checkInEventDto } = require("../dtos/eventDto");

const eventController = require("../controllers/eventController");

router.get("/information/:event_id", eventController.handleGetEventbyId);
router.get("/informations", eventController.handleGetAllEvents);
router.get("/signed/:user_id?", eventController.handleGetEventSigned);
router.get("/creator", eventController.handGetEventsOfCreator);
router.get("/user/:event_id", eventController.handlegetEventUserByEventId);

router.post(
  "/create",
  requirePermission("create", "Event"),
  middlewareImage.array("images", 5),
  validate(createEventDto),
  eventController.handleCreateEvent,
);

router.post(
  "/accept/:event_id",
  requirePermission("accept", "Event"),
  eventController.handleAcceptEvent,
);

router.put(
  "/update/:event_id",
  requirePermission("update", "Event"),
  middlewareImage.array("images", 5),
  validate(updateEventDto),
  eventController.handleUpdateEvent,
);

router.put(
  "/check_in",
  requirePermission("check_in", "Event"),
  validate(checkInEventDto),
  eventController.handleCheckInUserByUserId,
);

router.put(
  "/check_out",
  requirePermission("check_out", "Event"),
  validate(checkInEventDto),
  eventController.handleCheckOutUserByUserId,
);

router.delete(
  "/delete/:event_id",
  requirePermission("delete", "Event"),
  eventController.handleDeleteEvent,
);

router.delete(
  "/user/delete/:eventUser_id",
  requirePermission("delete", "EventUser"),
  eventController.handleDeleteEventUserById,
);

module.exports = router;
