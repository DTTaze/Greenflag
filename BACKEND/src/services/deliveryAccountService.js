const deliveryAccountRepo = require("../repositories/deliveryAccountRepository");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS, CACHE_TTL } = require("../constants/cacheKeys");
const NotFoundError = require("../errors/NotFoundError");

const getAllDeliveryAccounts = async (userId) => {
  const cacheKey = CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(userId);
  const cached = await getCache(cacheKey);
  if (cached) {
    console.log("Cache hit for delivery accounts of user", userId);
    return cached;
  }

  const accounts = await deliveryAccountRepo.findAll(
    {
      where: { user_id: userId },
    },
    { raw: true, nest: true },
  );
  await setCache(cacheKey, accounts, CACHE_TTL.ONE_HOUR);
  return accounts;
};

const getDeliveryAccountById = async (id) => {
  const cacheKey = CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(id);
  const cached = await getCache(cacheKey);
  if (cached) {
    console.log("Cache hit for delivery account", id);
    return cached;
  }

  const account = await deliveryAccountRepo.findById(id, { raw: true, nest: true });
  if (!account) throw new NotFoundError("Delivery account not found");

  await setCache(cacheKey, account, CACHE_TTL.ONE_HOUR);
  return account;
};

const createDeliveryAccount = async (data) => {
  const account = await deliveryAccountRepo.create(data, { raw: true, nest: true });
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(data.user_id));
  return account;
};

const updateDeliveryAccount = async (id, data) => {
  const account = await deliveryAccountRepo.findById(id, { raw: true, nest: true });
  if (!account) throw new NotFoundError("Delivery account not found");

  const updatedAccount = await deliveryAccountRepo.updateById(id, data);
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(id));
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(account.user_id));
  return updatedAccount;
};

const deleteDeliveryAccount = async (id) => {
  const account = await deliveryAccountRepo.findById(id, { raw: true, nest: true });
  if (!account) throw new NotFoundError("Delivery account not found");

  await deliveryAccountRepo.destroy(id);
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(id));
  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(account.user_id));
  return { message: "Deleted successfully" };
};

const setDefaultDeliveryAccount = async (id) => {
  const account = await deliveryAccountRepo.findOne(
    {
      where: { id },
    },
    { raw: true, nest: true },
  );
  if (!account) throw new NotFoundError("Delivery account not found or not owned by user");

  await deliveryAccountRepo.updateByConditions({ user_id: account.user_id }, { is_default: false });

  const allAccounts = await deliveryAccountRepo.findAll(
    {
      where: { user_id: account.user_id },
      attributes: ["id"],
    },
    { raw: true, nest: true },
  );

  const updatedAccount = await deliveryAccountRepo.updateById(id, { is_default: true });

  for (const acc of allAccounts) {
    await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_ID(acc.id));
  }

  await deleteCache(CACHE_KEYS.COMMERCE.DELIVERY_BY_USER_ID(account.user_id));

  return updatedAccount;
};

module.exports = {
  getAllDeliveryAccounts,
  getDeliveryAccountById,
  createDeliveryAccount,
  updateDeliveryAccount,
  deleteDeliveryAccount,
  setDefaultDeliveryAccount,
};
