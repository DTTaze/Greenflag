const receiverInformationRepo = require("../repositories/receiverInformationRepository");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const { cacheThrough } = require("../helpers/cacheHelper");
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

  const newReceiverInfo = await receiverInformationRepo.create(
    {
      user_id,
      to_name,
      to_phone,
      to_address,
      to_ward_name,
      to_district_name,
      to_province_name,
      account_type,
      is_default,
    },
    { raw: true, nest: true },
  );

  await setCache(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(newReceiverInfo.id), newReceiverInfo);
  await deleteCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);

  return newReceiverInfo;
};

// READ
const getReceiverInfoById = async (id) => {
  return cacheThrough(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(id), async () => {
    const receiverInfo = await receiverInformationRepo.findById(id, { raw: true, nest: true });
    if (!receiverInfo) {
      throw new NotFoundError(`ReceiverInformation ${id} not found`);
    }
    return receiverInfo;
  });
};

const getAllReceiverInfo = async () => {
  const cachedReceiverIds = await getCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);
  if (cachedReceiverIds) {
    const receivers = [];
    for (const receiverId of cachedReceiverIds) {
      const receiver = await getReceiverInfoById(receiverId);
      if (receiver) {
        receivers.push(receiver);
      }
    }
    return receivers;
  }

  const receiverRecords = await receiverInformationRepo.findAll({}, { raw: true, nest: true });
  const receiverIds = [];
  const receiversData = [];

  for (const receiverData of receiverRecords) {
    receiverIds.push(receiverData.id);

    const cacheKey = CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(receiverData.id);
    await setCache(cacheKey, receiverData);
    receiversData.push(receiverData);
  }

  await setCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO, receiverIds);

  return receiversData;
};

const getReceiverInfoByUserId = async (user_id) => {
  const allInfo = await getAllReceiverInfo();
  return allInfo.filter((item) => item.user_id === user_id);
};

// UPDATE
const updateReceiverInfoById = async (id, data) => {
  const receiverInfo = await receiverInformationRepo.findById(id, { raw: true, nest: true });
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

  const updated = await receiverInformationRepo.updateById(id, updateData);

  await deleteCache(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(id));
  await deleteCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);
  return updated;
};

const setDefaultReceiverInfoById = async (id) => {
  const info = await receiverInformationRepo.findOne(
    {
      where: { id },
    },
    { raw: true, nest: true },
  );
  if (!info) throw new NotFoundError("Receiver information not found");

  const user_id = info.user_id;

  const allAccounts = await receiverInformationRepo.findAll(
    {
      where: { user_id },
      attributes: ["id"],
    },
    { raw: true, nest: true },
  );

  await receiverInformationRepo.updateByConditions({ user_id }, { is_default: false });

  const updatedInfo = await receiverInformationRepo.updateById(id, { is_default: true });

  await Promise.all(
    allAccounts.map((acc) => deleteCache(CACHE_KEYS.COMMERCE.RECEIVER_INFO_BY_ID(acc.id))),
  );

  await deleteCache(CACHE_KEYS.COMMERCE.ALL_RECEIVER_INFO);

  return updatedInfo;
};

// DELETE
const deleteReceiverInfoById = async (id) => {
  const deletedCount = await receiverInformationRepo.destroy(id);

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
