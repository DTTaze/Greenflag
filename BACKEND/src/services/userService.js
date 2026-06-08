require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const db = require("../models/index.js");
const User = db.User;
const Role = db.Role;
const Coin = db.Coin;
const Rank = db.Rank;
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const rateLimitService = require("./rateLimitService.js");
const { getCache, setCache, deleteCache } = require("../utils/cache.js");
const { CACHE_KEYS } = require("../constants/cacheKeys.js");
const { ASSIGNABLE_ROLES, DEFAULT_ROLE_ID } = require("../constants/roles.js");
const { removeSpecialChars } = require("../utils/stringUtils.js");

const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");
const UnauthorizedError = require("../errors/UnauthorizedError.js");
const ConflictError = require("../errors/ConflictError.js");
const ForbiddenError = require("../errors/ForbiddenError.js");

const deleteCacheAll = async (id = null, public_id = null) => {
  if (public_id) {
    await deleteCache(CACHE_KEYS.IDENTITY.USER_BY_PUBLIC_ID(public_id));
  }
  if (id) {
    await deleteCache(CACHE_KEYS.IDENTITY.USER_BY_ID(id));
  }
};

const setUserCache = async (user) => {
  const userData = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  delete userData.password;
  await setCache(CACHE_KEYS.IDENTITY.USER_BY_ID(userData.id), userData);
  await setCache(CACHE_KEYS.IDENTITY.USER_BY_PUBLIC_ID(userData.public_id), String(userData.id));

  if (userData.roles) {
    await setCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(userData.role_id), userData.roles);
  }
  if (userData.coins) {
    await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(userData.coins_id), userData.coins);
  }
  if (userData.ranks) {
    await setCache(CACHE_KEYS.IDENTITY.RANK_BY_ID(userData.rank_id), userData.ranks);
  }
};

const createUser = async (data) => {
  try {
    let { username, full_name, role_id, email, password } = data;

    role_id = Number(role_id);

    if (isNaN(role_id)) throw new BadRequestError("Invalid Role ID");

    let roledata = await getCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(role_id));
    if (!roledata) {
      roledata = await Role.findByPk(role_id);
      if (!roledata) throw new NotFoundError("Role does not exist");
      await setCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(role_id), roledata);
    }
    if (!ASSIGNABLE_ROLES.includes(roledata.name.toLowerCase())) {
      throw new ForbiddenError("Cannot assign this role");
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (existingUser) {
      if (existingUser.email === email) throw new ConflictError("Email already exists");
      if (existingUser.username === username) throw new ConflictError("Username already exists");
    }

    const hashPassword = bcrypt.hashSync(password, salt);

    const maxOrderRank = await Rank.findOne({ order: [["order", "DESC"]] });
    const newOrder = maxOrderRank ? maxOrderRank.order + 1 : 1;
    const newRank = await Rank.create({
      amount: 0,
      order: newOrder,
      user_id: null,
    });

    const newUser = await User.create({
      public_id: nanoid(),
      role_id,
      rank_id: newRank.id,
      email,
      password: hashPassword,
      username,
      full_name,
    });

    await newRank.update({ user_id: newUser.id });

    const newCoin = await Coin.create({
      amount: 0,
      user_id: newUser.id,
    });

    const userWithIncludes = {
      ...newUser.toJSON(),
      roles: roledata,
      coins: newCoin,
      ranks: newRank,
    };
    await setUserCache(userWithIncludes);

    //delete password
    delete newUser.password;
    return newUser;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

const loginUser = async (user, email, password, clientIP, userAgent) => {
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await rateLimitService.recordFailedLogin(email, clientIP, userAgent);
    throw new UnauthorizedError("Invalid password");
  }

  const payload = {
    id: user.id,
    role_id: user.role_id,
    role_name: user.roles?.name,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    phone_number: user.phone_number,
    address: user.address,
    coins_id: user.coins_id,
    last_completed_task: user.last_completed_task,
    streak: user.streak,
    avatar_url: user.avatar_url,
  };

  const access_token = jwt.sign(payload, process.env.JWT_AT_SECRET, {
    expiresIn: process.env.JWT_AT_EXPIRE,
  });
  const refresh_token = jwt.sign(payload, process.env.JWT_RF_SECRET, {
    expiresIn: process.env.JWT_RF_EXPIRE,
  });

  await rateLimitService.resetLoginAttempts(email, clientIP, userAgent);

  return { access_token, refresh_token, user: payload };
};

const refreshAccessToken = (refreshToken) => {
  if (!refreshToken) throw new UnauthorizedError("No refresh token provided");
  const decoded = jwt.verify(refreshToken, process.env.JWT_RF_SECRET);
  return jwt.sign({ id: decoded.id }, process.env.JWT_AT_SECRET, {
    expiresIn: process.env.JWT_AT_EXPIRE,
  });
};

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "roles", attributes: ["id", "name"] },
      { model: Coin, as: "coins", attributes: ["id", "amount"] },
    ],
  });
  return users;
};

const _deleteUserInternal = async (user) => {
  const t = await db.sequelize.transaction();
  try {
    await Rank.destroy({ where: { id: user.rank_id }, transaction: t });
    await Coin.destroy({ where: { id: user.coins_id }, transaction: t });
    await User.destroy({ where: { id: user.id }, transaction: t });

    await t.commit();

    await deleteCache(CACHE_KEYS.IDENTITY.USER_BY_ID(user.id));
    await deleteCache(CACHE_KEYS.IDENTITY.USER_BY_PUBLIC_ID(user.public_id));

    return { message: "User deleted successfully" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const deleteUser = async (id) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new NotFoundError("User not found");
  return _deleteUserInternal(user);
};

const deleteUserByPublicID = async (public_id) => {
  const user = await User.findOne({ where: { public_id } });
  if (!user) throw new NotFoundError("User not found");
  return _deleteUserInternal(user);
};

const getUserBycacheId = async (id) => {
  const cacheUser = await getCache(CACHE_KEYS.IDENTITY.USER_BY_ID(id));
  if (!cacheUser) return null;

  const data_user = cacheUser;
  console.log("cacheUser:", cacheUser);

  // Role
  let dataRole = await getCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(data_user.role_id));
  if (!dataRole) {
    dataRole = await Role.findByPk(data_user.role_id, {
      attributes: ["id", "name"],
    });
    if (dataRole) await setCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(data_user.role_id), dataRole);
  }
  if (!dataRole) throw new NotFoundError(`Role not found for role_id ${data_user.role_id}`);

  // Coin
  let dataCoin = await getCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(data_user.coin_id));
  if (!dataCoin) {
    dataCoin = await Coin.findByPk(data_user.coin_id, {
      attributes: ["id", "amount"],
    });
    if (dataCoin) await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(data_user.coin_id), dataCoin);
  }
  if (!dataCoin) throw new NotFoundError(`Coin not found for coin_id ${data_user.coin_id}`);

  // Rank
  let dataRank = await getCache(CACHE_KEYS.IDENTITY.RANK_BY_ID(data_user.rank_id));
  if (!dataRank) {
    dataRank = await Rank.findByPk(data_user.rank_id, {
      attributes: ["id", "amount", "order"],
    });
    if (dataRank) await setCache(CACHE_KEYS.IDENTITY.RANK_BY_ID(data_user.rank_id), dataRank);
  }
  if (!dataRank) throw new NotFoundError(`Rank not found for rank_id ${data_user.rank_id}`);

  const user = {
    id: data_user.id,
    public_id: data_user.public_id,
    avatar_url: data_user.avatar_url,
    google_id: data_user.google_id,
    email: data_user.email,
    username: data_user.username,
    full_name: data_user.full_name,
    phone_number: data_user.phone_number,
    address: data_user.address,
    streak: data_user.streak,
    last_completed_task: data_user.last_completed_task,
    roles: dataRole,
    coins: dataCoin,
    ranks: dataRank,
  };
  return user;
};

const getUserByID = async (id) => {
  const cacheUser = await getUserBycacheId(id);
  if (cacheUser) return cacheUser;

  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "roles", attributes: ["id", "name"] },
      { model: Coin, as: "coins", attributes: ["id", "amount"] },
      { model: Rank, as: "ranks", attributes: ["id", "amount", "order"] },
    ],
  });
  if (!user) throw new NotFoundError("User not found");
  delete user.password;
  const userFormat = {
    ...user.toJSON(),
    role_id: user.roles?.id || null,
    coin_id: user.coins?.id || null,
    rank_id: user.ranks?.id || null,
  };
  delete userFormat.roles;
  delete userFormat.coins;
  delete userFormat.ranks;
  await setUserCache(userFormat);
  return user;
};

const getUserByPublicID = async (public_id) => {
  const cacheUserPublic = await getCache(CACHE_KEYS.IDENTITY.USER_BY_PUBLIC_ID(public_id));
  if (cacheUserPublic) {
    const cacheUser = await getUserBycacheId(Number(cacheUserPublic));
    if (cacheUser) return cacheUser;
  }

  const user = await User.findOne({
    where: { public_id },
    attributes: { exclude: ["password"] },
    include: [
      { model: Role, as: "roles", attributes: ["id", "name"] },
      { model: Coin, as: "coins", attributes: ["id", "amount"] },
      { model: Rank, as: "ranks", attributes: ["id", "amount", "order"] },
    ],
  });
  if (!user) throw new NotFoundError("User not found");

  await setUserCache(user);
  return user;
};

const updateUser = async (user, data) => {
  let { full_name, username, phone_number, email } = data;

  if (username !== undefined) {
    username = removeSpecialChars(username);
    user.username = username;
  }

  if (email !== undefined) {
    const existingUser = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: user.id },
      },
    });
    if (existingUser) {
      throw new ConflictError("Email is already used by another user");
    }
    user.email = email;
  }

  if (full_name !== undefined) {
    full_name = removeSpecialChars(full_name);
    user.full_name = full_name;
  }

  if (phone_number !== undefined) {
    user.phone_number = phone_number;
  }

  await user.save();

  const user_id = user.id;

  const coindata = await Coin.findOne({ where: { user_id } });
  if (!coindata) throw new NotFoundError("Coin does not exist");

  const roledata = await Role.findByPk(user.role_id);
  if (!roledata) throw new NotFoundError("Role does not exist");

  const rankdata = await Rank.findOne({ where: { user_id } });
  if (!rankdata) throw new NotFoundError("Rank does not exist");

  const updatedUser = {
    ...user.toJSON(),
    coins: coindata,
    roles: roledata,
    ranks: rankdata,
  };

  await deleteCacheAll(user.id, user.public_id);
  return updatedUser;
};

const updateUserById = async (id, data) => {
  let user = await User.findOne({ where: { id } });
  if (!user) throw new NotFoundError("User not found");
  return await updateUser(user, data);
};

const updateUserByPublicID = async (public_id, data) => {
  const user = await User.findOne({ where: { public_id } });
  if (!user) throw new NotFoundError("User not found");
  return await updateUser(user, data);
};

const findOrCreateUser = async (profile) => {
  const existingUser = await User.findOne({
    where: { email: profile.emails[0].value },
    include: [
      { model: Role, as: "roles" },
      { model: Coin, as: "coins" },
      { model: Rank, as: "ranks" },
    ],
  });

  if (existingUser) {
    await setUserCache(existingUser);
    return existingUser;
  }

  const maxOrderRank = await Rank.findOne({ order: [["order", "DESC"]] });
  const newOrder = maxOrderRank ? maxOrderRank.order + 1 : 1;
  const newRank = await Rank.create({
    amount: 0,
    order: newOrder,
    user_id: null,
  });

  const name = removeSpecialChars(profile.displayName);
  const newUser = await User.create({
    role_id: DEFAULT_ROLE_ID,
    rank_id: newRank.id,
    public_id: nanoid(),
    google_id: profile.id,
    email: profile.emails[0].value,
    username: name,
    full_name: name,
    password: null,
  });

  await newRank.update({ user_id: newUser.id });

  const newCoin = await Coin.create({
    amount: 0,
    user_id: newUser.id,
  });

  const roledata = await Role.findByPk(DEFAULT_ROLE_ID);

  const userWithIncludes = {
    ...newUser.toJSON(),
    role_id: DEFAULT_ROLE_ID,
    coin_id: newCoin.id,
    rank_id: newRank.id,
    roles: roledata,
    coins: newCoin,
    ranks: newRank,
  };
  await deleteCacheAll(newUser.id, newUser.public_id);
  await setUserCache(userWithIncludes);

  //delete password
  delete newUser.password;
  return newUser;
};
module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  getUserByID,
  getUserByPublicID,
  updateUserByPublicID,
  deleteUserByPublicID,
  updateUserById,
  findOrCreateUser,
  loginUser,
  refreshAccessToken,
};
