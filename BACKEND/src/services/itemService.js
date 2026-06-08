const { nanoid } = require("nanoid");
const db = require("../models/index");
const itemRepo = require("../repositories/itemRepository");
const imageRepo = require("../repositories/imageRepository");
const purchaseQueue = require("../queues/purchaseQueue");
const { uploadImages } = require("./imageService");
const { emitStockUpdate } = require("./socketService");
const { deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const { ITEM_STATUS } = require("../constants/itemStatus");
const { cacheThrough } = require("../helpers/cacheHelper");
const { destroyImagesByReference } = require("../helpers/imageHelper");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const AppError = require("../errors/AppError");

const cacheItemAll = CACHE_KEYS.COMMERCE.ALL_ITEMS;
const cacheItemId = (id) => CACHE_KEYS.COMMERCE.ITEM_BY_ID(id);
const cacheItemPublicId = (id) => CACHE_KEYS.COMMERCE.ITEM_BY_PUBLIC_ID(id);
const cacheItemUserId = (id) => CACHE_KEYS.COMMERCE.ITEMS_BY_USER_ID(id);

const _applyItemUpdates = (data) => {
  const {
    name,
    price,
    stock,
    description,
    status,
    purchase_limit_per_day,
    weight,
    length,
    width,
    height,
  } = data;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (price !== undefined) updateData.price = price;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (purchase_limit_per_day !== undefined) {
    updateData.purchase_limit_per_day = purchase_limit_per_day;
  }
  if (stock !== undefined) {
    if (stock < 0) {
      throw new BadRequestError("Stock cannot be negative");
    }
    updateData.stock = stock;
  }
  if (weight !== undefined) updateData.weight = weight;
  if (length !== undefined) updateData.length = length;
  if (width !== undefined) updateData.width = width;
  if (height !== undefined) updateData.height = height;

  return updateData;
};

const createItem = async (itemData, user_id, images) => {
  const {
    name,
    price,
    stock,
    description,
    status,
    purchase_limit_per_day,
    weight,
    length,
    width,
    height,
  } = itemData;

  if (!name || !price || !stock || !weight || !length || !width || !height) {
    throw new BadRequestError(
      "Missing required fields (name, price, stock, weight, length, width, height)",
    );
  }
  if (user_id === undefined) {
    throw new BadRequestError("Creator ID is required");
  }
  if (Number(price) < 1 || Number(stock) < 1 || Number(purchase_limit_per_day) < 1) {
    throw new BadRequestError("Price, stock and purchase_limit_per_day must be at least 1");
  }

  const result = await db.sequelize.transaction(async (t) => {
    const newItem = await itemRepo.create(
      {
        public_id: nanoid(),
        name,
        price,
        stock,
        description,
        status,
        creator_id: user_id,
        purchase_limit_per_day,
        weight,
        length,
        width,
        height,
      },
      { transaction: t },
    );
    const newItemData = newItem.get ? newItem.get({ plain: true }) : newItem;

    if (images && images.length > 0) {
      const uploadedImages = await uploadImages(images, newItemData.id, "item");
      if (uploadedImages.length === 0) {
        throw new AppError("Failed to upload images", 500);
      }
    }
    return newItemData;
  });

  //cache
  await deleteCache(cacheItemAll);
  await deleteCache(cacheItemUserId(user_id));

  return result;
};

const getAllItems = async () => {
  return cacheThrough(cacheItemAll, async () => {
    const dbItems = await itemRepo.findAll({}, { raw: true, nest: true });
    const itemIds = dbItems.map((item) => item.id);
    const images = await imageRepo.findAll(
      {
        where: { reference_id: itemIds, reference_type: "item" },
      },
      { raw: true, nest: true },
    );

    return dbItems.map((item) => ({
      ...item,
      images: images.filter((img) => img.reference_id === item.id).map((img) => img.url),
    }));
  });
};

const getItemByIdItem = async (item_id) => {
  return cacheThrough(cacheItemId(item_id), async () => {
    const dbItem = await itemRepo.findById(item_id, { raw: true, nest: true });
    if (!dbItem) throw new NotFoundError("Item not found");

    const images = await imageRepo.findAll(
      {
        where: { reference_id: item_id, reference_type: "item" },
      },
      { raw: true, nest: true },
    );

    return {
      ...dbItem,
      images: images.map((img) => img.url),
    };
  });
};

const getItemByIdUser = async (user_id) => {
  return cacheThrough(cacheItemUserId(user_id), async () => {
    const dbItems = await itemRepo.findAll(
      { where: { creator_id: user_id } },
      { raw: true, nest: true },
    );
    const itemIds = dbItems.map((item) => item.id);
    const images = await imageRepo.findAll(
      {
        where: { reference_id: itemIds, reference_type: "item" },
      },
      { raw: true, nest: true },
    );

    return dbItems.map((item) => ({
      ...item,
      images: images.filter((img) => img.reference_id === item.id).map((img) => img.url),
    }));
  });
};

const updateItem = async (id, data, images) => {
  const item = await itemRepo.findById(id, { raw: true, nest: true });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  const originalStock = item.stock;
  const originalStatus = item.status;

  const updateData = _applyItemUpdates(data);

  const updatedStock = updateData.stock !== undefined ? updateData.stock : item.stock;
  const updatedStatus = updateData.status !== undefined ? updateData.status : item.status;

  if (originalStock !== updatedStock || originalStatus !== updatedStatus) {
    emitStockUpdate(id, updatedStock, {
      name: updateData.name !== undefined ? updateData.name : item.name,
      price: updateData.price !== undefined ? updateData.price : item.price,
      status: updatedStatus,
    });
  }

  let uploadedImages = [];

  if (images && images.length > 0) {
    await destroyImagesByReference(id, "item");
    uploadedImages = await uploadImages(images, id, "item");
    if (!uploadedImages || uploadedImages.length === 0) {
      throw new AppError("Failed to upload images", 500);
    }
  }

  const updatedItem = await itemRepo.updateById(id, updateData);

  //cache
  await deleteCache(cacheItemId(item.id));
  await deleteCache(cacheItemUserId(item.creator_id));
  await deleteCache(cacheItemAll);

  return {
    ...updatedItem,
    images: uploadedImages.map((image) => image.url),
  };
};

const deleteItem = async (item_id) => {
  if (!item_id) {
    throw new BadRequestError("Item ID is required");
  }
  const item = await itemRepo.findById(item_id, { raw: true, nest: true });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  await destroyImagesByReference(item_id, "item");
  await itemRepo.destroy(item_id);

  await deleteCache(cacheItemId(item_id));
  await deleteCache(cacheItemAll);
  await deleteCache(cacheItemUserId(item.creator_id));
  await deleteCache(cacheItemPublicId(item.public_id));
  return { message: "Item and associated images deleted successfully" };
};

const purchaseItem = async (user_id, item_id, data) => {
  let { name, quantity, receiver_information_id } = data;
  if (!user_id || !item_id || quantity <= 0) {
    throw new BadRequestError("Invalid input data");
  }
  if (!data.to_name || !data.to_phone || !data.to_address) {
    throw new BadRequestError("Missing receiver information");
  }
  const result = await purchaseQueue.add("purchase", {
    receiver_information_id,
    user_id,
    item_id,
    name,
    quantity,
  });

  return { message: "Purchase request is in queue", job_id: result.id };
};

const getItemByPublicId = async (public_id) => {
  const itemId = await cacheThrough(cacheItemPublicId(public_id), async () => {
    const dbItem = await itemRepo.findOne({ where: { public_id } }, { raw: true, nest: true });
    if (!dbItem) throw new NotFoundError("Item not found");
    return dbItem.id;
  });
  return await getItemByIdItem(itemId);
};

const updateItemByPublicId = async (public_id, data, images) => {
  const item = await itemRepo.findOne({ where: { public_id } }, { raw: true, nest: true });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  const originalStock = item.stock;
  const originalStatus = item.status;

  const updateData = _applyItemUpdates({ ...data, status: ITEM_STATUS.PENDING });

  const updatedStock = updateData.stock !== undefined ? updateData.stock : item.stock;
  const updatedStatus = updateData.status !== undefined ? updateData.status : item.status;

  if (originalStock !== updatedStock || originalStatus !== updatedStatus) {
    emitStockUpdate(item.id, updatedStock, {
      name: updateData.name !== undefined ? updateData.name : item.name,
      price: updateData.price !== undefined ? updateData.price : item.price,
      status: updatedStatus,
    });
  }

  let uploadedImages = [];

  if (images && images.length > 0) {
    await destroyImagesByReference(item.id, "item");
    uploadedImages = await uploadImages(images, item.id, "item");
    if (!uploadedImages || uploadedImages.length === 0) {
      throw new AppError("Failed to upload images", 500);
    }
  }

  const updatedItem = await itemRepo.updateById(item.id, updateData);
  await deleteCache(cacheItemId(item.id));
  await deleteCache(cacheItemAll);
  await deleteCache(cacheItemUserId(item.creator_id));
  return {
    ...updatedItem,
    images: uploadedImages.map((image) => image.url),
  };
};

const deleteItemByPublicId = async (public_id) => {
  const item = await itemRepo.findOne({ where: { public_id } }, { raw: true, nest: true });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  return await deleteItem(item.id);
};

module.exports = {
  createItem,
  getAllItems,
  getItemByIdItem,
  getItemByIdUser,
  updateItem,
  deleteItem,
  purchaseItem,
  getItemByPublicId,
  updateItemByPublicId,
  deleteItemByPublicId,
};
