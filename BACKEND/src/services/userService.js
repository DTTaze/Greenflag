require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const db = require("../models/index.js");
const userRepo = require("../repositories/userRepository.js");
const roleRepo = require("../repositories/roleRepository.js");
const coinRepo = require("../repositories/coinRepository.js");
const rankRepo = require("../repositories/rankRepository.js");
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
  let { username, full_name, role_id, email, password } = data;

  role_id = Number(role_id);

  if (isNaN(role_id)) throw new BadRequestError("Invalid Role ID");

  let roledata = await getCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(role_id));
  if (!roledata) {
    roledata = await roleRepo.findById(role_id, { raw: true, nest: true });
    if (!roledata) throw new NotFoundError("Role does not exist");
    await setCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(role_id), roledata);
  }
  if (!ASSIGNABLE_ROLES.includes(roledata.name.toLowerCase())) {
    throw new ForbiddenError("Cannot assign this role");
  }

  const existingUser = await userRepo.findOne(
    {
      where: { [Op.or]: [{ email }, { username }] },
    },
    { raw: true, nest: true },
  );
  if (existingUser) {
    if (existingUser.email === email) throw new ConflictError("Email already exists");
    if (existingUser.username === username) throw new ConflictError("Username already exists");
  }

  const hashPassword = bcrypt.hashSync(password, salt);

  const maxOrderRank = await rankRepo.findOne(
    { order: [["order", "DESC"]] },
    { raw: true, nest: true },
  );
  const newOrder = maxOrderRank ? maxOrderRank.order + 1 : 1;
  const newRank = await rankRepo.create(
    {
      amount: 0,
      order: newOrder,
      user_id: null,
    },
    { raw: true, nest: true },
  );

  const newUser = await userRepo.create(
    {
      public_id: nanoid(),
      role_id,
      rank_id: newRank.id,
      email,
      password: hashPassword,
      username,
      full_name,
    },
    { raw: true, nest: true },
  );

  await rankRepo.updateById(newRank.id, { user_id: newUser.id });

  const newCoin = await coinRepo.create(
    {
      amount: 0,
      user_id: newUser.id,
    },
    { raw: true, nest: true },
  );

  const userWithIncludes = {
    ...newUser,
    roles: roledata,
    coins: newCoin,
    ranks: newRank,
  };
  await setUserCache(userWithIncludes);

  const responseUser = { ...newUser };
  delete responseUser.password;
  return responseUser;
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
  const users = await userRepo.findAll(
    {
      attributes: { exclude: ["password"] },
      include: [
        { model: db.Role, as: "roles", attributes: ["id", "name"] },
        { model: db.Coin, as: "coins", attributes: ["id", "amount"] },
      ],
    },
    { raw: true, nest: true },
  );
  return users;
};

const _deleteUserInternal = async (user) => {
  const t = await db.sequelize.transaction();
  try {
    await rankRepo.destroy(user.rank_id, { transaction: t });
    await coinRepo.destroy(user.coins_id, { transaction: t });
    await userRepo.destroy(user.id, { transaction: t });

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
  const user = await userRepo.findOne({ where: { id } }, { raw: true, nest: true });
  if (!user) throw new NotFoundError("User not found");
  return _deleteUserInternal(user);
};

const deleteUserByPublicID = async (public_id) => {
  const user = await userRepo.findOne({ where: { public_id } }, { raw: true, nest: true });
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
    dataRole = await roleRepo.findById(data_user.role_id, {
      attributes: ["id", "name"],
      raw: true,
      nest: true,
    });
    if (dataRole) await setCache(CACHE_KEYS.IDENTITY.ROLE_BY_ID(data_user.role_id), dataRole);
  }
  if (!dataRole) throw new NotFoundError(`Role not found for role_id ${data_user.role_id}`);

  // Coin
  let dataCoin = await getCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(data_user.coin_id));
  if (!dataCoin) {
    dataCoin = await coinRepo.findById(data_user.coin_id, {
      attributes: ["id", "amount"],
      raw: true,
      nest: true,
    });
    if (dataCoin) await setCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(data_user.coin_id), dataCoin);
  }
  if (!dataCoin) throw new NotFoundError(`Coin not found for coin_id ${data_user.coin_id}`);

  // Rank
  let dataRank = await getCache(CACHE_KEYS.IDENTITY.RANK_BY_ID(data_user.rank_id));
  if (!dataRank) {
    dataRank = await rankRepo.findById(data_user.rank_id, {
      attributes: ["id", "amount", "order"],
      raw: true,
      nest: true,
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

  const user = await userRepo.findOne(
    {
      where: { id },
      attributes: { exclude: ["password"] },
      include: [
        { model: db.Role, as: "roles", attributes: ["id", "name"] },
        { model: db.Coin, as: "coins", attributes: ["id", "amount"] },
        { model: db.Rank, as: "ranks", attributes: ["id", "amount", "order"] },
      ],
    },
    { raw: true, nest: true },
  );
  if (!user) throw new NotFoundError("User not found");

  const userFormat = {
    ...user,
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

  const user = await userRepo.findOne(
    {
      where: { public_id },
      attributes: { exclude: ["password"] },
      include: [
        { model: db.Role, as: "roles", attributes: ["id", "name"] },
        { model: db.Coin, as: "coins", attributes: ["id", "amount"] },
        { model: db.Rank, as: "ranks", attributes: ["id", "amount", "order"] },
      ],
    },
    { raw: true, nest: true },
  );
  if (!user) throw new NotFoundError("User not found");

  await setUserCache(user);
  return user;
};

const updateUser = async (user, data) => {
  let { full_name, username, phone_number, email } = data;
  const updateData = {};

  if (username !== undefined) {
    username = removeSpecialChars(username);
    updateData.username = username;
  }

  if (email !== undefined) {
    const existingUser = await userRepo.findOne(
      {
        where: {
          email,
          id: { [Op.ne]: user.id },
        },
      },
      { raw: true, nest: true },
    );
    if (existingUser) {
      throw new ConflictError("Email is already used by another user");
    }
    updateData.email = email;
  }

  if (full_name !== undefined) {
    full_name = removeSpecialChars(full_name);
    updateData.full_name = full_name;
  }

  if (phone_number !== undefined) {
    updateData.phone_number = phone_number;
  }

  const updatedUserResult = await userRepo.updateById(user.id, updateData);
  if (!updatedUserResult) throw new NotFoundError("User not found");

  const coindata = await coinRepo.findOne(
    { where: { user_id: user.id } },
    { raw: true, nest: true },
  );
  if (!coindata) throw new NotFoundError("Coin does not exist");

  const roledata = await roleRepo.findById(updatedUserResult.role_id, { raw: true, nest: true });
  if (!roledata) throw new NotFoundError("Role does not exist");

  const rankdata = await rankRepo.findOne(
    { where: { user_id: user.id } },
    { raw: true, nest: true },
  );
  if (!rankdata) throw new NotFoundError("Rank does not exist");

  const updatedUser = {
    ...updatedUserResult,
    coins: coindata,
    roles: roledata,
    ranks: rankdata,
  };

  await deleteCacheAll(user.id, user.public_id);
  return updatedUser;
};

const updateUserById = async (id, data) => {
  let user = await userRepo.findOne({ where: { id } }, { raw: true, nest: true });
  if (!user) throw new NotFoundError("User not found");
  return await updateUser(user, data);
};

const updateUserByPublicID = async (public_id, data) => {
  const user = await userRepo.findOne({ where: { public_id } }, { raw: true, nest: true });
  if (!user) throw new NotFoundError("User not found");
  return await updateUser(user, data);
};

const findOrCreateUser = async (profile) => {
  const existingUser = await userRepo.findOne(
    {
      where: { email: profile.emails[0].value },
      include: [
        { model: db.Role, as: "roles" },
        { model: db.Coin, as: "coins" },
        { model: db.Rank, as: "ranks" },
      ],
    },
    { raw: true, nest: true },
  );

  if (existingUser) {
    await setUserCache(existingUser);
    return existingUser;
  }

  const maxOrderRank = await rankRepo.findOne(
    { order: [["order", "DESC"]] },
    { raw: true, nest: true },
  );
  const newOrder = maxOrderRank ? maxOrderRank.order + 1 : 1;
  const newRank = await rankRepo.create(
    {
      amount: 0,
      order: newOrder,
      user_id: null,
    },
    { raw: true, nest: true },
  );

  const name = removeSpecialChars(profile.displayName);
  const newUser = await userRepo.create(
    {
      role_id: DEFAULT_ROLE_ID,
      rank_id: newRank.id,
      public_id: nanoid(),
      google_id: profile.id,
      email: profile.emails[0].value,
      username: name,
      full_name: name,
      password: null,
    },
    { raw: true, nest: true },
  );

  await rankRepo.updateById(newRank.id, { user_id: newUser.id });

  const newCoin = await coinRepo.create(
    {
      amount: 0,
      user_id: newUser.id,
    },
    { raw: true, nest: true },
  );

  const roledata = await roleRepo.findById(DEFAULT_ROLE_ID, { raw: true, nest: true });

  const userWithIncludes = {
    ...newUser,
    role_id: DEFAULT_ROLE_ID,
    coin_id: newCoin.id,
    rank_id: newRank.id,
    roles: roledata,
    coins: newCoin,
    ranks: newRank,
  };
  await deleteCacheAll(newUser.id, newUser.public_id);
  await setUserCache(userWithIncludes);

  const responseUser = { ...newUser };
  delete responseUser.password;
  return responseUser;
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
