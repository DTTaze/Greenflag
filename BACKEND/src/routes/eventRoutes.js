const express = require("express");
const router = express.Router();
const middlewareImage = require("../middlewares/middlewareImage");
const validate = require("../middlewares/validate");
const { createEventDto, updateEventDto, checkInEventDto } = require("../dtos/eventDto");

const eventController = require("../controllers/eventController");

router.get("/information/:event_id", eventController.handleGetEventbyId);

router.get("/informations", eventController.handleGetAllEvents);

router.get("/signed/:user_id?", eventController.handleGetEventSigned);

router.get("/creator", eventController.handGetEventsOfCreator);
router.delete("/user/delete/:eventUser_id", eventController.handleDeleteEventUserById);

router.get("/user/:event_id", eventController.handlegetEventUserByEventId);

router.post(
  "/create",
  middlewareImage.array("images", 5),
  validate(createEventDto),
  eventController.handleCreateEvent,
);

router.post("/accept/:event_id", eventController.handleAcceptEvent);

router.put(
  "/update/:event_id",
  middlewareImage.array("images", 5),
  validate(updateEventDto),
  eventController.handleUpdateEvent,
);

router.put("/check_in", validate(checkInEventDto), eventController.handleCheckInUserByUserId);

router.put("/check_out", validate(checkInEventDto), eventController.handleCheckOutUserByUserId);

router.delete("/delete/:event_id", eventController.handleDeleteEvent);

module.exports = router;
