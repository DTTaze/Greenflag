const db = require("../models");
const DeliveryAccount = db.DeliveryAccount;
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const NotFoundError = require("../errors/NotFoundError");

const getAllDeliveryAccounts = async (userId) => {
  const cacheKey = CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(userId);
  const cached = await getCache(cacheKey);
  if (cached) {
    console.log("Cache hit for delivery accounts of user", userId);
    return cached;
  }

  const accounts = await DeliveryAccount.findAll({
    where: { user_id: userId },
  });
  await setCache(cacheKey, accounts, 60 * 60);
  return accounts;
};

const getDeliveryAccountById = async (id) => {
  const cacheKey = CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(id);
  const cached = await getCache(cacheKey);
  if (cached) {
    console.log("Cache hit for delivery account", id);
    return cached;
  }

  const account = await DeliveryAccount.findByPk(id);
  if (!account) throw new NotFoundError("Delivery account not found");

  await setCache(cacheKey, account, 60 * 60);
  return account;
};

const createDeliveryAccount = async (data) => {
  const account = await DeliveryAccount.create(data);
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(data.user_id));
  return account;
};

const updateDeliveryAccount = async (id, data) => {
  const account = await DeliveryAccount.findByPk(id);
  if (!account) throw new NotFoundError("Delivery account not found");

  await account.update(data);
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(id));
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(account.user_id));
  return account;
};

const deleteDeliveryAccount = async (id) => {
  const account = await DeliveryAccount.findByPk(id);
  if (!account) throw new NotFoundError("Delivery account not found");

  await account.destroy();
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(id));
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(account.user_id));
  return { message: "Deleted successfully" };
};

const setDefaultDeliveryAccount = async (id) => {
  const account = await DeliveryAccount.findOne({
    where: { id },
  });
  if (!account) throw new NotFoundError("Delivery account not found or not owned by user");

  await DeliveryAccount.update({ is_default: false }, { where: { user_id: account.user_id } });

  const allAccounts = await DeliveryAccount.findAll({
    where: { user_id: account.user_id },
    attributes: ["id"],
  });

  await account.update({ is_default: true });

  for (const acc of allAccounts) {
    await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(acc.id));
  }

  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(account.user_id));

  return account;
};

module.exports = {
  getAllDeliveryAccounts,
  getDeliveryAccountById,
  createDeliveryAccount,
  updateDeliveryAccount,
  deleteDeliveryAccount,
  setDefaultDeliveryAccount,
};
