const db = require("../models/index.js");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const { TRANSACTION_STATUS } = require("../constants/transactionStatus");
const { ITEM_STATUS } = require("../constants/itemStatus");
const Transaction = db.Transaction;
const ReceiverInformation = db.ReceiverInformation;
const Item = db.Item;
const User = db.User;
const { updateIncreaseCoin } = require("./coinService.js");
const { getUserByID } = require("./userService.js");
const { emitStockUpdate } = require("./socketService");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const AppError = require("../errors/AppError");

const cacheItemAll = CACHE_KEYS.COMMERCE.ALL_ITEMS;
const cacheItemId = (id) => CACHE_KEYS.COMMERCE.ITEM_BY_ID(id);
const cacheItemUserId = (id) => CACHE_KEYS.COMMERCE.ITEMS_BY_USER_ID(id);

const createTransaction = async (transactionData) => {
  try {
    const { name, quantity, buyer_id, item_id, status } = transactionData;

    if (!name || !buyer_id || !item_id) {
      throw new BadRequestError("Name, buyer_id, and item_id are required fields.");
    }

    const parsedQuantity = Number(quantity);
    const parsedBuyerId = Number(buyer_id);
    const parsedItemId = Number(item_id);

    if (isNaN(parsedBuyerId) || isNaN(parsedItemId)) {
      throw new BadRequestError("buyer_id, and item_id must be valid numbers.");
    }

    // Nếu `quantity` không hợp lệ, mặc định là 1
    const finalQuantity = isNaN(parsedQuantity) || parsedQuantity <= 0 ? 1 : parsedQuantity;

    // Nếu `status` không hợp lệ, mặc định là "pending"
    const finalStatus = status?.trim() ? status : TRANSACTION_STATUS.PENDING;

    const item = await Item.findOne({ where: { id: parsedItemId } });
    if (!item) {
      throw new NotFoundError("Item not found.");
    }

    if (!item.price || isNaN(item.price)) {
      throw new BadRequestError("Invalid item price.");
    }

    const total_price = item.price * finalQuantity;

    const transaction = await Transaction.create({
      name,
      buyer_id: parsedBuyerId,
      item_id: parsedItemId,
      total_price,
      quantity: finalQuantity,
      status: finalStatus,
    });

    // Add transaction to Redis
    const redisKey = CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transaction.id);
    await setCache(redisKey, transaction);

    return transaction;
  } catch (error) {
    if (error.statusCode) throw error;
    throw new AppError("Failed to create transaction", 500);
  }
};

const getTransactionByBuyerId = async (buyer_id) => {
  try {
    const buyerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_BUYER(buyer_id);
    const listBuyerTransactioncacheId = await getCache(buyerCacheKey);
    if (listBuyerTransactioncacheId) {
      console.log("listBuyerTransactioncacheId", listBuyerTransactioncacheId);
      const listTransactionId = listBuyerTransactioncacheId;
      let result = [];
      for (const transactionId of listTransactionId) {
        const transactionCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transactionId);
        const transactionCache = await getCache(transactionCacheKey);
        if (transactionCache) {
          result.push(transactionCache);
        } else {
          const transaction = await Transaction.findOne({
            where: { id: transactionId },
          });
          if (transaction) {
            result.push(transaction.toJSON());
            await setCache(transactionCacheKey, transaction.toJSON());
          } else {
            throw new NotFoundError("Transaction not found.");
          }
        }
      }
      return result;
    }
    const transaction = await Transaction.findAll({
      where: { buyer_id: buyer_id },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: ReceiverInformation,
          as: "receiver_information",
        },
      ],
    });
    if (!transaction) {
      throw new NotFoundError("Transaction not found.");
    }
    const transactionIds = transaction.map((item) => item.id);
    await setCache(buyerCacheKey, transactionIds);
    for (const newTransaction of transaction) {
      const transactionData = newTransaction.toJSON();
      await setCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(newTransaction.id), transactionData);
    }

    return transaction.map((t) => t.toJSON());
  } catch (error) {
    if (error.statusCode) throw error;
    throw new AppError("Failed to retrieve buyer transactions", 500);
  }
};

const getTransactionBySellerId = async (seller_id) => {
  try {
    const sellerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_SELLER(seller_id);
    const listSellerTransactionCacheId = await getCache(sellerCacheKey);
    if (listSellerTransactionCacheId) {
      console.log("listSellerTransactionCacheId", listSellerTransactionCacheId);
      const listTransactionId = listSellerTransactionCacheId;
      let result = [];
      for (const transactionId of listTransactionId) {
        const transactionCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transactionId);
        const transactionCache = await getCache(transactionCacheKey);
        if (transactionCache) {
          result.push(transactionCache);
        } else {
          const transaction = await Transaction.findOne({
            where: { id: transactionId },
          });
          if (transaction) {
            result.push(transaction.toJSON());
            await setCache(transactionCacheKey, transaction.toJSON());
          } else {
            throw new NotFoundError("Transaction not found.");
          }
        }
      }
      return result;
    }
    const transaction = await Transaction.findAll({
      where: { seller_id: seller_id },
      include: [
        {
          model: User,
          as: "seller",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: ReceiverInformation,
          as: "receiver_information",
        },
      ],
    });
    if (!transaction || transaction.length === 0) {
      throw new NotFoundError("Transaction not found.");
    }
    const transactionIds = transaction.map((item) => item.id);
    await setCache(sellerCacheKey, transactionIds);
    for (const newTransaction of transaction) {
      const transactionData = newTransaction.toJSON();
      await setCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(newTransaction.id), transactionData);
    }

    return transaction.map((t) => t.toJSON());
  } catch (error) {
    if (error.statusCode) throw error;
    throw new AppError("Failed to retrieve seller transactions", 500);
  }
};

const getAllTransactions = async () => {
  try {
    return await Transaction.findAll({
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
      ],
    });
  } catch (e) {
    if (e.statusCode) throw e;
    throw new AppError("Failed to retrieve all transactions", 500);
  }
};

const getTransactionById = async (id) => {
  try {
    if (!id) {
      throw new BadRequestError("Missing parameters");
    }
    return await Transaction.findByPk(id, {
      include: [
        {
          model: ReceiverInformation,
          as: "receiver_information",
        },
        {
          model: Item,
          as: "item",
        },
      ],
    });
  } catch (e) {
    if (e.statusCode) throw e;
    throw new AppError("Failed to retrieve transaction by ID", 500);
  }
};

const cancelTransactionById = async (id) => {
  if (typeof id !== "number" && typeof id !== "string") {
    throw new BadRequestError("Invalid id type");
  }
  if (!id) {
    throw new BadRequestError("Missing parameters");
  }

  const t = await Transaction.sequelize.transaction();
  try {
    const transaction = await Transaction.findByPk(id, { transaction: t });
    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }
    if (transaction.status === TRANSACTION_STATUS.CANCELLED) {
      throw new BadRequestError("Transaction is already cancelled");
    }
    if (transaction.status === TRANSACTION_STATUS.ACCEPTED) {
      throw new BadRequestError("Cannot cancel accepted transaction");
    }
    if (!transaction.item_snapshot || typeof transaction.item_snapshot.price !== "number") {
      throw new BadRequestError("Invalid transaction price");
    }

    transaction.status = TRANSACTION_STATUS.CANCELLED;
    await transaction.save({ transaction: t });
    await deleteCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(id));

    const data = await getUserByID(transaction.buyer_id);
    if (!data || !data.coins.id) {
      throw new BadRequestError("Invalid user or coin_id");
    }
    await updateIncreaseCoin(data.coins.id, transaction.item_snapshot.price, {
      transaction: t,
    });
    const item = await Item.findByPk(transaction.item_id, { transaction: t });
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const originalStock = item.stock;
    const originalStatus = item.status;

    item.stock += transaction.quantity;
    item.status = item.stock > 0 ? ITEM_STATUS.AVAILABLE : ITEM_STATUS.SOLD_OUT;

    if (originalStock !== item.stock || originalStatus !== item.status) {
      emitStockUpdate(item.id, item.stock, {
        name: item.name,
        price: item.price,
        status: item.status,
      });
    }

    await item.save({ transaction: t });

    await deleteCache(cacheItemId(item.id));
    await deleteCache(cacheItemUserId(item.creator_id));
    await deleteCache(cacheItemAll);

    await t.commit();
    return transaction;
  } catch (e) {
    await t.rollback();
    if (e.statusCode) throw e;
    throw new AppError("Failed to cancel transaction", 500);
  }
};

const deleteTransaction = async (transaction_id) => {
  try {
    if (!transaction_id) {
      throw new BadRequestError("Missing parameters");
    }
    const transaction = await Transaction.findByPk(transaction_id);
    if (!transaction) {
      throw new NotFoundError("Transaction not found.");
    }
    await Transaction.destroy({
      where: { id: transaction_id },
    });
    const buyerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_BUYER(transaction.buyer_id);
    await deleteCache(buyerCacheKey);

    const sellerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_SELLER(transaction.seller_id);
    await deleteCache(sellerCacheKey);

    await deleteCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transaction_id));

    return "Transaction deleted successfully.";
  } catch (error) {
    if (error.statusCode) throw error;
    throw new AppError("Failed to delete transaction", 500);
  }
};

const getAllTransactionsByStatus = async (status) => {
  try {
    if (!status) {
      throw new BadRequestError("Missing parameters");
    }

    const transactions = await Transaction.findAll({
      where: { status },
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundError("Transaction not found with the specified status");
    }

    return transactions;
  } catch (error) {
    if (error.statusCode) throw error;
    throw new AppError("Failed to retrieve transactions by status", 500);
  }
};

const makeDecision = async (transaction_id, decision) => {
  if (typeof transaction_id !== "number" && typeof transaction_id !== "string") {
    throw new BadRequestError("Invalid transaction_id type");
  }
  if (typeof decision !== "string") {
    throw new BadRequestError("Invalid decision type");
  }
  if (!transaction_id || !decision) {
    throw new BadRequestError("Missing parameters");
  }
  if (
    ![
      TRANSACTION_STATUS.ACCEPTED,
      TRANSACTION_STATUS.REJECTED,
      TRANSACTION_STATUS.PENDING,
    ].includes(decision)
  ) {
    throw new BadRequestError("Wrong new status to make decision");
  }

  const t = await Transaction.sequelize.transaction();
  try {
    const transaction = await Transaction.findByPk(transaction_id, {
      transaction: t,
    });
    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }
    if (transaction.status === decision) {
      throw new BadRequestError("Transaction is already in this status");
    }
    if (
      transaction.status === TRANSACTION_STATUS.ACCEPTED &&
      decision === TRANSACTION_STATUS.PENDING
    ) {
      throw new BadRequestError("Cannot revert accepted transaction to pending");
    }
    if (!transaction.item_snapshot || typeof transaction.item_snapshot.price !== "number") {
      throw new BadRequestError("Invalid transaction price");
    }

    transaction.status = decision;
    await transaction.save({ transaction: t });

    await deleteCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transaction_id));
    const item = await Item.findByPk(transaction.dataValues.item_id, {
      transaction: t,
    });

    if (decision === TRANSACTION_STATUS.REJECTED) {
      const data = await getUserByID(transaction.buyer_id);
      if (!data || !data.coins.id) {
        throw new BadRequestError("Invalid user or coin_id");
      }
      await updateIncreaseCoin(data.coins.id, transaction.item_snapshot.price, {
        transaction: t,
      });
      const originalStock = item.stock;
      const originalStatus = item.status;
      item.stock += transaction.dataValues.quantity;
      item.status = item.stock > 0 ? ITEM_STATUS.AVAILABLE : ITEM_STATUS.SOLD_OUT;
      if (originalStock !== item.stock || originalStatus !== item.status) {
        emitStockUpdate(item.id, item.stock, {
          name: item.name,
          price: item.price,
          status: item.status,
        });
      }
      await item.save({ transaction: t });
      await deleteCache(cacheItemId(item.id));
      await deleteCache(cacheItemUserId(item.creator_id));
      await deleteCache(cacheItemAll);
    }

    await t.commit();
    return transaction;
  } catch (error) {
    await t.rollback();
    if (error.statusCode) throw error;
    throw new AppError("Failed to make decision on transaction", 500);
  }
};

module.exports = {
  createTransaction,
  getTransactionByBuyerId,
  getTransactionBySellerId,
  deleteTransaction,
  getAllTransactions,
  makeDecision,
  getAllTransactionsByStatus,
  getTransactionById,
  cancelTransactionById,
};
