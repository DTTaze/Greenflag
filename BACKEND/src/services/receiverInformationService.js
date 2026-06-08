const db = require("../models/index");
const ReceiverInformation = db.ReceiverInformation;
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

// CREATE
const createReceiverInfo = async (data) => {
  const {
    user_id,
    to_name,
    to_phone,
    to_address,
    to_ward_name,
    to_district_name,
    to_province_name,
    account_type = "home",
    is_default = false,
  } = data;

  if (
    !user_id ||
    !to_name ||
    !to_phone ||
    !to_address ||
    !to_ward_name ||
    !to_district_name ||
    !to_province_name
  ) {
    throw new BadRequestError("Missing required fields");
  }

  const validAccountTypes = ["home", "office"];
  if (!validAccountTypes.includes(account_type)) {
    throw new BadRequestError("Invalid account_type. Must be 'home' or 'office'");
  }

  const newReceiverInfo = await ReceiverInformation.create({
    user_id,
    to_name,
    to_phone,
    to_address,
    to_ward_name,
    to_district_name,
    to_province_name,
    account_type,
    is_default,
  });

  await setCache(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(newReceiverInfo.id), newReceiverInfo);
  await deleteCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);

  return newReceiverInfo;
};

// READ
const getReceiverInfoById = async (id) => {
  const cacheKey = CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(id);
  let receiverInfo = await getCache(cacheKey);

  if (receiverInfo) {
    return receiverInfo;
  }

  receiverInfo = await ReceiverInformation.findByPk(id);
  if (receiverInfo) {
    await setCache(cacheKey, receiverInfo);
  } else {
    throw new NotFoundError(`ReceiverInformation ${id} not found`);
  }

  return receiverInfo;
};

const getAllReceiverInfo = async () => {
  const cachedReceiverIds = await getCache(`receiverInfo:all`);
  if (cachedReceiverIds) {
    console.log("cachedReceiverIds", cachedReceiverIds);
    const receivers = [];
    for (const receiverId of cachedReceiverIds) {
      const receiver = await getReceiverInfoById(receiverId);
      if (receiver) {
        receivers.push(receiver);
      }
    }
    return receivers;
  }

  const receiverRecords = await ReceiverInformation.findAll();
  const receiverIds = [];

  for (const receiver of receiverRecords) {
    const receiverData = receiver.toJSON();
    receiverIds.push(receiverData.id);

    const cacheKey = CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(receiverData.id);
    await setCache(cacheKey, receiverData);
  }

  await setCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO, receiverIds);

  return receiverRecords;
};

const getReceiverInfoByUserId = async (user_id) => {
  const allInfo = await getAllReceiverInfo();
  return allInfo.filter((item) => item.user_id === user_id);
};

// UPDATE
const updateReceiverInfoById = async (id, data) => {
  const receiverInfo = await ReceiverInformation.findByPk(id);
  if (!receiverInfo) {
    throw new NotFoundError(`Receiver Info not found by id: ${id}`);
  }

  const updatableFields = [
    "to_name",
    "to_phone",
    "to_address",
    "to_ward_name",
    "to_district_name",
    "to_province_name",
    "account_type",
    "is_default",
  ];

  const updateData = {};
  for (const key of updatableFields) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      updateData[key] = data[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError("No valid fields provided for update");
  }

  await receiverInfo.update(updateData);
  const updated = await ReceiverInformation.findByPk(id);

  await deleteCache(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(id));
  await deleteCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);
  return updated;
};

const setDefaultReceiverInfoById = async (id) => {
  const info = await ReceiverInformation.findOne({
    where: { id },
  });
  if (!info) throw new NotFoundError("Receiver information not found");

  const user_id = info.user_id;

  const allAccounts = await ReceiverInformation.findAll({
    where: { user_id },
    attributes: ["id"],
  });

  await ReceiverInformation.update({ is_default: false }, { where: { user_id } });

  await info.update({ is_default: true });

  await Promise.all(
    allAccounts.map((acc) => deleteCache(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(acc.id))),
  );

  await deleteCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);

  return info;
};

// DELETE
const deleteReceiverInfoById = async (id) => {
  const deletedCount = await ReceiverInformation.destroy({
    where: { id },
  });

  if (deletedCount > 0) {
    await deleteCache(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(id));
    await deleteCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);
    return true;
  }

  throw new NotFoundError(`Receiver information not found or already deleted`);
};

module.exports = {
  createReceiverInfo,
  getReceiverInfoById,
  getReceiverInfoByUserId,
  updateReceiverInfoById,
  setDefaultReceiverInfoById,
  deleteReceiverInfoById,
};
