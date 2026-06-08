const express = require("express");
const userController = require("../controllers/userController");
const receiverController = require("../controllers/receiverController");
const validate = require("../middlewares/validate");
const requirePermission = require("../middlewares/requirePermission");
const { updateUserProfileDto } = require("../dtos/userDto");
const { createReceiverInfoDto, updateReceiverInfoDto } = require("../dtos/receiverInfoDto");

const router = express.Router();

router.get("/", userController.handleGetAllUsers);
router.get("/me", userController.handleGetProfile);
router.get("/task/completed", userController.handleGetTaskCompleted);
router.get("/tasks/all/:id", userController.handleGetAllTasksById);
router.get("/items/:user_id", userController.handleGetItemByIdUser);

router.get("/public/:public_id", userController.handleGetUserByPublicId);
router.put(
  "/public/:public_id",
  requirePermission("update", "User"),
  validate(updateUserProfileDto),
  userController.handleUpdateUserByPublicId,
);
router.delete(
  "/public/:public_id",
  requirePermission("delete", "User"),
  userController.handleDeleteUserByPublicId,
);

router.get("/:id", userController.handleGetUser);

router.put(
  "/:id",
  requirePermission("update", "User"),
  validate(updateUserProfileDto),
  userController.handleUpdateUserById,
);
router.delete("/:id", requirePermission("delete", "User"), userController.handleDeleteUser);

router.post(
  "/receiver/create",
  requirePermission("create", "ReceiverInformation"),
  validate(createReceiverInfoDto),
  receiverController.handleCreateReceiverInfo,
);
router.get("/receiver/info/:id", receiverController.handleGetReceiverInfoById);
router.get("/receiver/info/user/:user_id", receiverController.handleGetReceiverInfoByUserId);

router.patch(
  "/receiver/update/:id",
  requirePermission("update", "ReceiverInformation"),
  validate(updateReceiverInfoDto),
  receiverController.handleUpdateReceiverInfoById,
);

router.delete(
  "/receiver/info/:id",
  requirePermission("delete", "ReceiverInformation"),
  receiverController.handleDeleteReceiverInfoById,
);

router.patch(
  "/receiver/set-default/:id",
  requirePermission("update", "ReceiverInformation"),
  receiverController.handleSetDefaultReceiverInfoById,
);

module.exports = router;
