const express = require("express");
const taskController = require("../controllers/taskController");
const middlewareImage = require("../middlewares/middlewareImage");
const validate = require("../middlewares/validate");
const {
  createTaskDto,
  updateTaskDto,
  submitTaskDto,
  decisionTaskSubmitDto,
  changeTaskStatusDto,
} = require("../dtos/taskDto");

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

router.post("/upload", validate(createTaskDto), taskController.handleCreateTask);
router.post("/accept/:id", taskController.handleAcceptTask);
router.post("/progress/increase/:task_user_id", taskController.handleIncreaseProgressCount);
router.post(
  "/submit/:task_id",
  middlewareImage.array("images", 5),
  validate(submitTaskDto),
  taskController.handleSubmitTask,
);
router.post(
  "/status/change/:task_id",
  validate(changeTaskStatusDto),
  taskController.handleChangeTaskStatus,
);

router.put(
  "/submit/decision/:id",
  validate(decisionTaskSubmitDto),
  taskController.handleDecisionTaskSubmit,
);
router.put("/:id", validate(updateTaskDto), taskController.handleUpdateTask);
router.put(
  "/public/:public_id",
  validate(updateTaskDto),
  taskController.handleUpdateTaskByPublicId,
);

router.delete("/public/:public_id", taskController.handleDeleteTaskByPublicId);
module.exports = router;
