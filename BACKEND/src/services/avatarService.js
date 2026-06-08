const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.User;
const cloudinary = require("../config/cloudinary.js");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const uploadAvatar = async (file, user_id) => {
  if (!file) throw new BadRequestError("No file provided");
  if (!user_id) throw new BadRequestError("User ID is required");

  const user = await User.findByPk(user_id);
  if (!user) throw new NotFoundError("User not found");

  if (user.avatar_url) throw new ConflictError("User already has an avatar");

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "avatars",
  });

  await user.update({ avatar_url: result.secure_url });

  await deleteCache(CACHE_KEYS.IDENTITY.USER_AVATAR(user.id));
  await deleteCache(CACHE_KEYS.IDENTITY.AVATARS_ALL);

  return user;
};

const getAllAvatars = async () => {
  const cachedAvatars = await getCache(CACHE_KEYS.IDENTITY.AVATARS_ALL);
  if (cachedAvatars) {
    return cachedAvatars;
  }

  const avatars = await User.findAll({
    attributes: ["id", "username", "avatar_url"],
    where: { avatar_url: { [Op.ne]: null } },
  });

  await setCache(CACHE_KEYS.IDENTITY.AVATARS_ALL, avatars);

  return avatars;
};

const getAvatarById = async (id) => {
  const cacheKey = CACHE_KEYS.IDENTITY.USER_AVATAR(id);
  const cachedAvatar = await getCache(cacheKey);
  if (cachedAvatar) {
    return cachedAvatar;
  }

  const user = await User.findByPk(id, {
    attributes: ["id", "username", "avatar_url"],
  });

  if (!user) throw new NotFoundError("User not found");

  await setCache(cacheKey, user);

  return user;
};

const updateAvatar = async (id, file) => {
  if (!file) throw new BadRequestError("No file provided");

  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("User not found");

  if (user.avatar_url) {
    const publicId = user.avatar_url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`avatars/${publicId}`);
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "avatars",
    resource_type: "image",
  });

  await user.update({ avatar_url: result.secure_url });

  await deleteCache(CACHE_KEYS.IDENTITY.USER_AVATAR(id));
  await deleteCache(CACHE_KEYS.IDENTITY.AVATARS_ALL);

  return user;
};

const deleteAvatar = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError("User not found");

  if (user.avatar_url) {
    const publicId = user.avatar_url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`avatars/${publicId}`);
  }

  await user.update({ avatar_url: null });

  await deleteCache(CACHE_KEYS.IDENTITY.USER_AVATAR(id));
  await deleteCache(CACHE_KEYS.IDENTITY.AVATARS_ALL);

  return { message: "Avatar deleted successfully" };
};

module.exports = {
  uploadAvatar,
  getAllAvatars,
  getAvatarById,
  updateAvatar,
  deleteAvatar,
};
