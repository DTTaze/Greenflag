const avatarService = require("../services/avatarService");

const handleUploadAvatar = async (req, res) => {
  const { file } = req;
  const userId = req.params.user_id || req.user?.id;

  if (!file) {
    return res.error(400, "No file uploaded");
  }

  const result = await avatarService.uploadAvatar(file, userId);
  return res.success("Avatar uploaded successfully", result);
};

const handleGetAllAvatars = async (req, res) => {
  const result = await avatarService.getAllAvatars();
  return res.success("Fetched all avatars successfully", result);
};

const handleGetAvatarByUserId = async (req, res) => {
  const userId = req.params.user_id || req.user?.id;
  const result = await avatarService.getAvatarById(userId);
  return res.success("Fetched avatar successfully", result);
};

const handleUpdateAvatar = async (req, res) => {
  const { file } = req;
  const userId = req.params.user_id || req.user?.id;

  if (!file) {
    return res.error(400, "No file uploaded");
  }

  const result = await avatarService.updateAvatar(userId, file);
  return res.success("Avatar updated successfully", result);
};

const handleDeleteAvatar = async (req, res) => {
  const userId = req.params.user_id || req.user?.id;
  const result = await avatarService.deleteAvatar(userId);
  return res.success("Avatar deleted successfully", result.message);
};

module.exports = {
  handleUploadAvatar,
  handleGetAllAvatars,
  handleGetAvatarByUserId,
  handleUpdateAvatar,
  handleDeleteAvatar,
};
