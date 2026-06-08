const express = require("express");
const userController = require("../controllers/userController");
const checkPermission = require("../middlewares/checkPermission");
const receiverController = require("../controllers/receiverController");
const router = express.Router();

router.get("/", userController.handleGetAllUsers);
router.get("/me", userController.handleGetProfile);
router.get("/task/completed", userController.handleGetTaskCompleted);
router.get("/tasks/all/:id", userController.handleGetAllTasksById);
router.get("/items/:user_id", userController.handleGetItemByIdUser);

router.get("/public/:public_id", userController.handleGetUserByPublicId);
router.put("/public/:public_id", userController.handleUpdateUserByPublicId);
router.delete("/public/:public_id", userController.handleDeleteUserByPublicId);

router.get(
  "/:id",
  // checkPermission("get", "user_id"),
  userController.handleGetUser,
);

router.put(
  "/:id",
  // checkPermission("put", "user_id"),
  userController.handleUpdateUserById,
);
router.delete(
  "/:id",
  // checkPermission("delete", "user_id"),
  userController.handleDeleteUser,
);

router.post("/receiver/create", receiverController.handleCreateReceiverInfo);
router.get("/receiver/info/:id", receiverController.handleGetReceiverInfoById);
router.get("/receiver/info/user/:user_id", receiverController.handleGetReceiverInfoByUserId);
router.patch("/receiver/update/:id", receiverController.handleUpdateReceiverInfoById);
router.delete("/receiver/info/:id", receiverController.handleDeleteReceiverInfoById);
router.patch("/receiver/set-default/:id", receiverController.handleSetDefaultReceiverInfoById);

module.exports = router;
