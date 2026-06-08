const { nanoid } = require("nanoid");
const db = require("../models/index");
const Item = db.Item;
const purchaseQueue = require("../queues/purchaseQueue");
const { uploadImages } = require("../services/imageService");
const { sequelize } = require("../models");
const Image = db.Image;
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

const _applyItemUpdates = (item, data) => {
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

  if (name !== undefined) item.name = name;
  if (price !== undefined) item.price = price;
  if (description !== undefined) item.description = description;
  if (status !== undefined) item.status = status;
  if (purchase_limit_per_day !== undefined) {
    item.purchase_limit_per_day = purchase_limit_per_day;
  }
  if (stock !== undefined) {
    if (stock < 0) {
      throw new BadRequestError("Stock cannot be negative");
    }
    item.stock = stock;
  }
  if (weight !== undefined) item.weight = weight;
  if (length !== undefined) item.length = length;
  if (width !== undefined) item.width = width;
  if (height !== undefined) item.height = height;
};

const createItem = async (itemData, user_id, images) => {
  try {
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

    const result = await sequelize.transaction(async (t) => {
      const newItem = await Item.create(
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

      if (images && images.length > 0) {
        const uploadedImages = await uploadImages(images, newItem.id, "item");
        if (uploadedImages.length === 0) {
          throw new AppError("Failed to upload images", 500);
        }
      }
      return newItem;
    });

    //cache
    await deleteCache(cacheItemAll);
    await deleteCache(cacheItemUserId(user_id));

    return result.toJSON();
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

const getAllItems = async () => {
  return cacheThrough(cacheItemAll, async () => {
    const dbItems = await Item.findAll();
    const itemIds = dbItems.map((item) => item.id);
    const images = await Image.findAll({
      where: { reference_id: itemIds, reference_type: "item" },
    });

    return dbItems.map((item) => ({
      ...item.toJSON(),
      images: images.filter((img) => img.reference_id === item.id).map((img) => img.url),
    }));
  });
};

const getItemByIdItem = async (item_id) => {
  return cacheThrough(cacheItemId(item_id), async () => {
    const dbItem = await Item.findByPk(item_id);
    if (!dbItem) throw new NotFoundError("Item not found");

    const images = await Image.findAll({
      where: { reference_id: item_id, reference_type: "item" },
    });

    return {
      ...dbItem.toJSON(),
      images: images.map((img) => img.url),
    };
  });
};

const getItemByIdUser = async (user_id) => {
  return cacheThrough(cacheItemUserId(user_id), async () => {
    const dbItems = await Item.findAll({ where: { creator_id: user_id } });
    const itemIds = dbItems.map((item) => item.id);
    const images = await Image.findAll({
      where: { reference_id: itemIds, reference_type: "item" },
    });

    return dbItems.map((item) => ({
      ...item.toJSON(),
      images: images.filter((img) => img.reference_id === item.id).map((img) => img.url),
    }));
  });
};

const updateItem = async (id, data, images) => {
  const item = await Item.findByPk(id);
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  const originalStock = item.stock;
  const originalStatus = item.status;

  _applyItemUpdates(item, data);

  if (originalStock !== item.stock || originalStatus !== item.status) {
    emitStockUpdate(id, item.stock, {
      name: item.name,
      price: item.price,
      status: item.status,
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

  await item.save();

  //cache
  await deleteCache(cacheItemId(item.id));
  await deleteCache(cacheItemUserId(item.creator_id));
  await deleteCache(cacheItemAll);

  return {
    ...item.toJSON(),
    images: uploadedImages.map((image) => image.url),
  };
};

const deleteItem = async (item_id) => {
  if (!item_id) {
    throw new BadRequestError("Item ID is required");
  }
  const item = await Item.findByPk(item_id);
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  await destroyImagesByReference(item_id, "item");
  await item.destroy();

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
    const dbItem = await Item.findOne({ where: { public_id } });
    if (!dbItem) throw new NotFoundError("Item not found");
    return dbItem.id;
  });
  return await getItemByIdItem(itemId);
};

const updateItemByPublicId = async (public_id, data, images) => {
  const item = await Item.findOne({ where: { public_id } });
  if (!item) {
    throw new NotFoundError("Item not found");
  }

  const originalStock = item.stock;
  const originalStatus = item.status;

  _applyItemUpdates(item, { ...data, status: ITEM_STATUS.PENDING });

  if (originalStock !== item.stock || originalStatus !== item.status) {
    emitStockUpdate(item.id, item.stock, {
      name: item.name,
      price: item.price,
      status: item.status,
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

  await item.save();
  await deleteCache(cacheItemId(item.id));
  await deleteCache(cacheItemAll);
  await deleteCache(cacheItemUserId(item.creator_id));
  return {
    ...item.toJSON(),
    images: uploadedImages.map((image) => image.url),
  };
};

const deleteItemByPublicId = async (public_id) => {
  const item = await Item.findOne({ where: { public_id } });
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
