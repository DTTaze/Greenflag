const { subject } = require("@casl/ability");
const taskService = require("../services/taskService.js");
const taskSubmitService = require("../services/taskSubmitService.js");
const ForbiddenError = require("../errors/ForbiddenError");

const handleGetAllTasks = async (req, res) => {
  let result = await taskService.getAllTasks();
  return res.success("Get list of tasks success", result);
};

const handleCreateTask = async (req, res) => {
  const user_id = req.user.id;
  let result = await taskService.createTask(req.body, user_id);
  return res.success("Create task success", result);
};

const handleDeleteTask = async (req, res) => {
  let result = await taskService.deleteTask(req.params.id);
  return res.success("Delete task success", result);
};

const handleGetTask = async (req, res) => {
  let result = await taskService.getTaskById(req.params.id);
  return res.success("Get task success", result);
};

const handleUpdateTask = async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  if (!req.ability.can("update", subject("Task", task))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa nhiệm vụ của người khác");
  }
  let result = await taskService.updateTask(req.params.id, req.body);
  return res.success("Update task success", result);
};

const handleAcceptTask = async (req, res) => {
  const task_id = req.params.id;
  const user_id = req.user.id;
  let result = await taskService.acceptTask(task_id, user_id);
  return res.success("Accept task success", result);
};

const handleSubmitTask = async (req, res) => {
  const task_id = req.params.task_id;
  const user_id = req.user.id;
  let description = req.body.description;
  description = description ? String(description) : "";

  const files = req.files;

  let result = await taskService.submitTask(task_id, user_id, description, files);

  return res.success("Submit task success", result);
};

const handleDecisionTaskSubmit = async (req, res) => {
  const task_submit_id = req.params.id;
  const decision = req.body.decision;
  let result = await taskService.updateDecisionTaskSubmit(task_submit_id, decision);
  return res.success("Approved task submit success", result);
};

const handleIncreaseProgressCount = async (req, res) => {
  const task_user_id = req.params.task_user_id;
  let result = await taskService.increaseProgressCount(task_user_id);
  return res.success("Increase progress count success", result);
};

const handleGetAllTasksByTypeName = async (req, res) => {
  const type_name = req.params.type_name;
  let result = await taskService.getAllTasksByTypeName(type_name);
  return res.success("Get task by type name success", result);
};

const handleGetAllTasksByDifficultyName = async (req, res) => {
  const difficulty_name = req.params.difficulty_name;
  let result = await taskService.getAllTasksByDifficultyName(difficulty_name);
  return res.success("Get task by difficulty name success", result);
};

const handleGetTaskByPublicId = async (req, res) => {
  let result = await taskService.getTaskByPublicId(req.params.public_id);
  return res.success("Get task by public ID success", result);
};

const handleUpdateTaskByPublicId = async (req, res) => {
  const task = await taskService.getTaskByPublicId(req.params.public_id);
  if (!req.ability.can("update", subject("Task", task))) {
    throw new ForbiddenError("Bạn không có quyền chỉnh sửa nhiệm vụ của người khác");
  }
  let result = await taskService.updateTaskByPublicId(req.params.public_id, req.body);
  return res.success("Update task success", result);
};

const handleDeleteTaskByPublicId = async (req, res) => {
  const task = await taskService.getTaskByPublicId(req.params.public_id);
  if (!req.ability.can("delete", subject("Task", task))) {
    throw new ForbiddenError("Bạn không có quyền xóa nhiệm vụ của người khác");
  }
  let result = await taskService.deleteTaskByPublicId(req.params.public_id);
  return res.success("Delete task success", result);
};

const handleGetTaskSubmitByUserId = async (req, res) => {
  const user_id = req.params.user_id;
  let result = await taskSubmitService.getTaskSubmitByUserId(user_id);
  return res.success("Get task submit by user id success", result);
};

const handleGetTaskSubmitByCustomerId = async (req, res) => {
  const customer_id = req.params.customer_id;
  let result = await taskSubmitService.getTaskSubmitByCustomerId(customer_id);
  return res.success("Get task submit by customer id success", result);
};

const handleGetAllTasksStatusPublic = async (req, res) => {
  let result = await taskService.getAllTasksStatusPublic();
  return res.success("Get all tasks status public success", result);
};

const handleGetAllTasksOfCustomer = async (req, res) => {
  const user_id = req.user.id;
  let result = await taskService.getAllTasksOfCustomer(user_id);
  return res.success("Get all tasks of customer success", result);
};

const handleChangeTaskStatus = async (req, res) => {
  const task_id = req.params.task_id;
  const status = req.body.status;
  let result = await taskService.changeTaskStatus(task_id, status);
  return res.success("Change task status success", result);
};

module.exports = {
  handleGetAllTasks,
  handleCreateTask,
  handleDeleteTask,
  handleGetTask,
  handleUpdateTask,
  handleAcceptTask,
  handleSubmitTask,
  handleDecisionTaskSubmit,
  handleIncreaseProgressCount,
  handleGetAllTasksByTypeName,
  handleGetAllTasksByDifficultyName,
  handleGetTaskByPublicId,
  handleUpdateTaskByPublicId,
  handleDeleteTaskByPublicId,
  handleGetTaskSubmitByUserId,
  handleGetTaskSubmitByCustomerId,
  handleGetAllTasksStatusPublic,
  handleGetAllTasksOfCustomer,
  handleChangeTaskStatus,
};
