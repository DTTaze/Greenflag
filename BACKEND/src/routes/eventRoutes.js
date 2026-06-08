const express = require("express");
const router = express.Router();
const middlewareImage = require("../middlewares/middlewareImage");

const eventController = require("../controllers/eventController");
const checkPermission = require("../middlewares/checkPermission");

router.get(
  "/information/:event_id",
  // checkPermission('read', 'event'),
  eventController.handleGetEventbyId,
);

router.get(
  "/informations",
  // checkPermission('read', 'event'),
  eventController.handleGetAllEvents,
);

router.get(
  "/signed/:user_id?",
  // checkPermission('read', 'event'),
  eventController.handleGetEventSigned,
);

router.get(
  "/creator",
  // checkPermission('read', 'event'),
  eventController.handGetEventsOfCreator,
);
router.delete(
  "/user/delete/:eventUser_id",
  // checkPermission('read', 'event'),
  eventController.handleDeleteEventUserById,
);

router.get(
  "/user/:event_id",
  // checkPermission('read', 'event'),
  eventController.handlegetEventUserByEventId,
);

router.post(
  "/create",
  //   checkPermission('create', 'event'),
  middlewareImage.array("images", 5),
  eventController.handleCreateEvent,
);

router.post(
  "/accept/:event_id",
  // checkPermission('update', 'event'),
  eventController.handleAcceptEvent,
);

router.put(
  "/update/:event_id",
  // checkPermission('update', 'event'),
  middlewareImage.array("images", 5),
  eventController.handleUpdateEvent,
);

router.put("/check_in", eventController.handleCheckInUserByUserId);

router.put("/check_out", eventController.handleCheckOutUserByUserId);

router.delete(
  "/delete/:event_id",
  // checkPermission('delete', 'event'),
  eventController.handleDeleteEvent,
);

module.exports = router;
