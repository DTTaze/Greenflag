const db = require("../models/index.js");
const { getCache, setCache, deleteCache } = require("../utils/cache.js");
const { CACHE_KEYS } = require("../constants/cacheKeys.js");
const { TRANSACTION_STATUS } = require("../constants/transactionStatus.js");
const { ITEM_STATUS } = require("../constants/itemStatus.js");
const transactionRepo = require("../repositories/transactionRepository");
const itemRepo = require("../repositories/itemRepository");
const { updateIncreaseCoin } = require("./coinService.js");
const { getUserByID } = require("./userService.js");
const { emitStockUpdate } = require("./socketService.js");
const BadRequestError = require("../errors/BadRequestError.js");
const NotFoundError = require("../errors/NotFoundError.js");

const cacheItemAll = CACHE_KEYS.COMMERCE.ALL_ITEMS;
const cacheItemId = (id) => CACHE_KEYS.COMMERCE.ITEM_BY_ID(id);
const cacheItemUserId = (id) => CACHE_KEYS.COMMERCE.ITEMS_BY_USER_ID(id);

const createTransaction = async (transactionData) => {
  const { name, quantity, buyer_id, item_id, status } = transactionData;

  const finalQuantity = quantity || 1;
  const finalStatus = status || TRANSACTION_STATUS.PENDING;

  const item = await itemRepo.findOne({ where: { id: item_id } }, { raw: true, nest: true });
  if (!item) {
    throw new NotFoundError("Item not found.");
  }

  if (!item.price || isNaN(item.price)) {
    throw new BadRequestError("Invalid item price.");
  }

  const total_price = item.price * finalQuantity;

  const transaction = await transactionRepo.create(
    {
      name,
      buyer_id,
      item_id,
      total_price,
      quantity: finalQuantity,
      status: finalStatus,
    },
    { raw: true, nest: true },
  );

  const redisKey = CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transaction.id);
  await setCache(redisKey, transaction);

  return transaction;
};

const getTransactionsByRole = async (userId, role) => {
  const isBuyer = role === "buyer";
  const cacheKey = isBuyer
    ? CACHE_KEYS.COMMERCE.TRANSACTION_BUYER(userId)
    : CACHE_KEYS.COMMERCE.TRANSACTION_SELLER(userId);

  const cachedTransactionIds = await getCache(cacheKey);
  if (cachedTransactionIds) {
    const result = [];
    for (const transactionId of cachedTransactionIds) {
      const txCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transactionId);
      let transaction = await getCache(txCacheKey);
      if (!transaction) {
        const dbTx = await transactionRepo.findOne(
          {
            where: { id: transactionId },
          },
          { raw: true, nest: true },
        );
        if (dbTx) {
          transaction = dbTx;
          await setCache(txCacheKey, transaction);
        } else {
          throw new NotFoundError("Transaction not found.");
        }
      }
      if (transaction) {
        result.push(transaction);
      }
    }
    return result;
  }

  const filter = isBuyer ? { buyer_id: userId } : { seller_id: userId };
  const transactions = await transactionRepo.findAll(
    {
      where: filter,
      include: [
        {
          model: db.User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: db.User,
          as: "seller",
          attributes: ["id", "full_name", "username"],
        },
        {
          model: db.ReceiverInformation,
          as: "receiver_information",
        },
      ],
    },
    { raw: true, nest: true },
  );

  if (!transactions || transactions.length === 0) {
    throw new NotFoundError("Transaction not found.");
  }

  const transactionIds = transactions.map((t) => t.id);
  await setCache(cacheKey, transactionIds);
  const transactionsData = [];
  for (const t of transactions) {
    await setCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(t.id), t);
    transactionsData.push(t);
  }

  return transactionsData;
};

const getTransactionByBuyerId = (id) => getTransactionsByRole(id, "buyer");
const getTransactionBySellerId = (id) => getTransactionsByRole(id, "seller");

const getAllTransactions = async () => {
  const transactions = await transactionRepo.findAll(
    {
      include: [
        {
          model: db.User,
          as: "buyer",
          attributes: ["id", "full_name", "username"],
        },
      ],
    },
    { raw: true, nest: true },
  );
  return transactions;
};

const getTransactionById = async (id) => {
  if (!id) {
    throw new BadRequestError("Missing parameters");
  }
  return await transactionRepo.findOne(
    {
      where: { id },
      include: [
        {
          model: db.ReceiverInformation,
          as: "receiver_information",
        },
        {
          model: db.Item,
          as: "item",
        },
      ],
    },
    { raw: true, nest: true },
  );
};

const cancelTransactionById = async (id) => {
  if (typeof id !== "number" && typeof id !== "string") {
    throw new BadRequestError("Invalid id type");
  }
  if (!id) {
    throw new BadRequestError("Missing parameters");
  }

  const t = await db.sequelize.transaction();
  try {
    const transaction = await transactionRepo.findById(id, {
      transaction: t,
      raw: true,
      nest: true,
    });
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

    const updatedTx = await transactionRepo.updateById(
      id,
      { status: TRANSACTION_STATUS.CANCELLED },
      { transaction: t },
    );
    await deleteCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(id));

    const data = await getUserByID(transaction.buyer_id);
    if (!data || !data.coins?.id) {
      throw new BadRequestError("Invalid user or coin_id");
    }
    await updateIncreaseCoin(data.coins.id, transaction.item_snapshot.price, {
      transaction: t,
    });

    const item = await itemRepo.findById(transaction.item_id, {
      transaction: t,
      raw: true,
      nest: true,
    });
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const originalStock = item.stock;
    const originalStatus = item.status;

    const newStock = item.stock + transaction.quantity;
    const newStatus = newStock > 0 ? ITEM_STATUS.AVAILABLE : ITEM_STATUS.SOLD_OUT;

    if (originalStock !== newStock || originalStatus !== newStatus) {
      emitStockUpdate(item.id, newStock, {
        name: item.name,
        price: item.price,
        status: newStatus,
      });
    }

    await itemRepo.updateById(item.id, { stock: newStock, status: newStatus }, { transaction: t });

    await deleteCache(cacheItemId(item.id));
    await deleteCache(cacheItemUserId(item.creator_id));
    await deleteCache(cacheItemAll);

    await t.commit();
    return updatedTx;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

const deleteTransaction = async (transaction_id) => {
  if (!transaction_id) {
    throw new BadRequestError("Missing parameters");
  }
  const transaction = await transactionRepo.findById(transaction_id, { raw: true, nest: true });
  if (!transaction) {
    throw new NotFoundError("Transaction not found.");
  }
  await transactionRepo.destroy(transaction_id);
  const buyerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_BUYER(transaction.buyer_id);
  await deleteCache(buyerCacheKey);

  const sellerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_SELLER(transaction.seller_id);
  await deleteCache(sellerCacheKey);

  await deleteCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transaction_id));

  return "Transaction deleted successfully.";
};

const getAllTransactionsByStatus = async (status) => {
  if (!status) {
    throw new BadRequestError("Missing parameters");
  }

  const transactions = await transactionRepo.findAll(
    {
      where: { status },
    },
    { raw: true, nest: true },
  );

  if (!transactions || transactions.length === 0) {
    throw new NotFoundError("Transaction not found with the specified status");
  }

  return transactions;
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

  const t = await db.sequelize.transaction();
  try {
    const transaction = await transactionRepo.findById(transaction_id, {
      transaction: t,
      raw: true,
      nest: true,
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

    const updatedTx = await transactionRepo.updateById(
      transaction_id,
      { status: decision },
      { transaction: t },
    );

    await deleteCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transaction_id));

    const item = await itemRepo.findById(transaction.item_id, {
      transaction: t,
      raw: true,
      nest: true,
    });

    if (decision === TRANSACTION_STATUS.REJECTED) {
      const data = await getUserByID(transaction.buyer_id);
      if (!data || !data.coins?.id) {
        throw new BadRequestError("Invalid user or coin_id");
      }
      await updateIncreaseCoin(data.coins.id, transaction.item_snapshot.price, {
        transaction: t,
      });
      const originalStock = item.stock;
      const originalStatus = item.status;
      const newStock = item.stock + transaction.quantity;
      const newStatus = newStock > 0 ? ITEM_STATUS.AVAILABLE : ITEM_STATUS.SOLD_OUT;

      if (originalStock !== newStock || originalStatus !== newStatus) {
        emitStockUpdate(item.id, newStock, {
          name: item.name,
          price: item.price,
          status: newStatus,
        });
      }
      await itemRepo.updateById(
        item.id,
        { stock: newStock, status: newStatus },
        { transaction: t },
      );
      await deleteCache(cacheItemId(item.id));
      await deleteCache(cacheItemUserId(item.creator_id));
      await deleteCache(cacheItemAll);
    }

    await t.commit();
    return updatedTx;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const getItemsByUserId = async (user_id) => {
  const cacheKey = CACHE_KEYS.COMMERCE.TRANSACTIONS_BY_USER_ID(user_id);
  const cachedTransactionIds = await getCache(cacheKey);
  if (cachedTransactionIds) {
    const transactions = [];
    for (const transactionId of cachedTransactionIds) {
      let transaction = await getCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transactionId));
      if (!transaction) {
        transaction = await transactionRepo.findOne(
          {
            where: { id: transactionId },
            attributes: ["id", "total_price", "quantity", "status"],
            include: [
              {
                model: db.Item,
                attributes: ["id", "name", "description", "price"],
              },
            ],
          },
          { raw: true, nest: true },
        );
        if (transaction) {
          await setCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transactionId), transaction);
          transactions.push(transaction);
        }
      } else {
        transactions.push(transaction);
      }
    }
    return transactions;
  }

  const items = await transactionRepo.findAll(
    {
      where: { buyer_id: user_id, status: ["pending", "completed"] },
      attributes: ["id", "total_price", "quantity", "status"],
      include: [
        {
          model: db.Item,
          as: "item",
          attributes: ["id", "name", "description", "price"],
        },
      ],
    },
    { raw: true, nest: true },
  );
  if (!items || items.length === 0) throw new NotFoundError("User not found");

  const transactionIds = items.map((item) => item.id);
  await setCache(cacheKey, transactionIds);
  for (const item of items) {
    await setCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(item.id), item);
  }

  return items;
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
  getItemsByUserId,
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
  getItemsByUserId,
};
