const { subject } = require("@casl/ability");
const userService = require("../services/userService");
const taskService = require("../services/taskService");
const transactionService = require("../services/transactionService");
const {
  setAuthCookies,
  clearAuthCookies,
  setAccessTokenCookie,
} = require("../helpers/cookieHelper");
const ForbiddenError = require("../errors/ForbiddenError");

const handleGetAllUsers = async (req, res) => {
  const result = await userService.getAllUsers();
  return res.success("Get list of users success", result);
};

const handleCreateUser = async (req, res) => {
  const result = await userService.createUser(req.body);
  return res.success("Create user success", result);
};

const handleLoginUser = async (req, res) => {
  const user = req.user;
  const email = req.body.email;
  const password = req.body.password;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"] || "unknown";
  const result = await userService.loginUser(user, email, password, clientIP, userAgent);
  setAuthCookies(res, result);
  return res.success("Login success", result);
};

const handleRefreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const newAccessToken = userService.refreshAccessToken(refreshToken);

  setAccessTokenCookie(res, newAccessToken);

  return res.success("Access token refreshed", {
    access_token: newAccessToken,
  });
};

const handleLogoutUser = async (req, res) => {
  clearAuthCookies(res);
  return res.success("Logout success");
};

const handleDeleteUser = async (req, res) => {
  const user = await userService.getUserByID(Number(req.params.id));
  if (!req.ability.can("delete", subject("User", user))) {
    throw new ForbiddenError("Bạn không có quyền xóa người dùng này");
  }
  const result = await userService.deleteUser(req.params.id);
  return res.success("Delete user success", result);
};

const handleGetUser = async (req, res) => {
  const result = await userService.getUserByID(Number(req.params.id));
  return res.success("Get user by ID success", result);
};

const handleUpdateUserById = async (req, res) => {
  const user = await userService.getUserByID(Number(req.params.id));
  if (!req.ability.can("update", subject("User", user))) {
    throw new ForbiddenError("Bạn không có quyền cập nhật người dùng này");
  }
  const result = await userService.updateUserById(req.params.id, req.body);
  return res.success("Update user success", result);
};

const handleGetProfile = async (req, res) => {
  return res.success("Get user profile success", req.user);
};

const handleGetTaskCompleted = async (req, res) => {
  const result = await taskService.getCompletedTasksByUserId(req.user.id);
  return res.success("Get task completed success", result);
};

const handleGetAllTasksById = async (req, res) => {
  const result = await taskService.getAllTasksByUserId(req.user.id);
  return res.success("Get all task by ID success", result);
};

const handleGetItemByIdUser = async (req, res) => {
  const result = await transactionService.getItemsByUserId(req.params.user_id);
  return res.success("Get item by user ID success", result);
};

const handleGetUserByPublicId = async (req, res) => {
  const result = await userService.getUserByPublicID(req.params.public_id);
  return res.success("Get user by public ID success", result);
};

const handleUpdateUserByPublicId = async (req, res) => {
  const user = await userService.getUserByPublicID(req.params.public_id);
  if (!req.ability.can("update", subject("User", user))) {
    throw new ForbiddenError("Bạn không có quyền cập nhật người dùng này");
  }
  const result = await userService.updateUserByPublicID(req.params.public_id, req.body);
  return res.success("Update user success", result);
};

const handleDeleteUserByPublicId = async (req, res) => {
  const user = await userService.getUserByPublicID(req.params.public_id);
  if (!req.ability.can("delete", subject("User", user))) {
    throw new ForbiddenError("Bạn không có quyền xóa người dùng này");
  }
  const result = await userService.deleteUserByPublicID(req.params.public_id);
  return res.success("Delete user success", result);
};

module.exports = {
  handleGetAllUsers,
  handleCreateUser,
  handleLogoutUser,
  handleDeleteUser,
  handleGetUser,
  handleUpdateUserById,
  handleLoginUser,
  handleGetProfile,
  handleGetTaskCompleted,
  handleGetAllTasksById,
  handleGetItemByIdUser,
  handleGetUserByPublicId,
  handleUpdateUserByPublicId,
  handleDeleteUserByPublicId,
  handleRefreshAccessToken,
};
