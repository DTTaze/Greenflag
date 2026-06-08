const express = require("express");
const taskController = require("../controllers/taskController");
const middlewareImage = require("../middlewares/middlewareImage");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

router.get("/", taskController.handleGetAllTasks);
router.get("/customer", taskController.handleGetAllTasksOfCustomer);
router.get("/:id", taskController.handleGetTask);
router.get("/type/:type_name", taskController.handleGetAllTasksByTypeName);
router.get("/difficulty/:difficulty_name", taskController.handleGetAllTasksByDifficultyName);
router.get("/submit/user/:user_id", taskController.handleGetTaskSubmitByUserId);
router.get("/submit/customer/:customer_id", taskController.handleGetTaskSubmitByCustomerId);
router.get("/public/:public_id", taskController.handleGetTaskByPublicId);
router.get("/status/public", taskController.handleGetAllTasksStatusPublic);

router.post(
  "/upload",
  // checkPermission("post", "task"),
  taskController.handleCreateTask,
);
router.post(
  "/accept/:id",
  // checkPermission("accept", "task_id"),
  taskController.handleAcceptTask,
);
router.post(
  "/progress/increase/:task_user_id",
  // checkPermission("progress_count", "task_user_id"),
  taskController.handleIncreaseProgressCount,
);
router.post(
  "/submit/:task_id",
  middlewareImage.array("images", 5),
  taskController.handleSubmitTask,
);
router.post("/status/change/:task_id", taskController.handleChangeTaskStatus);

router.put(
  "/submit/decision/:id",
  // checkPermission("delete", "task_id"),
  taskController.handleDecisionTaskSubmit,
);
router.put(
  "/:id",
  // checkPermission("put", "task_id"),
  taskController.handleUpdateTask,
);
router.put("/public/:public_id", taskController.handleUpdateTaskByPublicId);

router.delete("/public/:public_id", taskController.handleDeleteTaskByPublicId);
module.exports = router;
