const { Worker } = require("bullmq");
const db = require("../../models/index");
const { QUEUE_NAMES } = require("../../constants/queueNames");
const { sequelize } = db;
const itemRepo = require("../../repositories/itemRepository");
const userRepo = require("../../repositories/userRepository");
const coinRepo = require("../../repositories/coinRepository");
const transactionRepo = require("../../repositories/transactionRepository");
const { redis } = require("../../config/configRedis");
const Redis = require("ioredis");
const { generateCode } = require("../../utils/generateCode");
const { getCache, setCache, deleteCache } = require("../../utils/cache");
const { CACHE_KEYS } = require("../../constants/cacheKeys");
require("dotenv").config();

const publisher = new Redis(redis);

const worker = new Worker(
  QUEUE_NAMES.PURCHASE,
  async (job) => {
    const { receiver_information_id, user_id, item_id, quantity, name } = job.data;

    if (!user_id || !item_id || !quantity || quantity <= 0) {
      throw new Error("Invalid job data: missing or invalid user_id, item_id, or quantity");
    }

    try {
      return await sequelize.transaction(async (t) => {
        const cacheKeyItem = CACHE_KEYS.COMMERCE.ITEM_BY_ID(item_id);
        let item = await getCache(cacheKeyItem);

        if (!item) {
          item = await itemRepo.findById(item_id, {
            transaction: t,
            lock: true,
            raw: true,
            nest: true,
          });
          if (!item) throw new Error("Item not found");
          await setCache(cacheKeyItem, item, 300);
        }

        if (!item.creator) {
          item.creator = await userRepo.findById(item.creator_id, {
            attributes: ["id", "full_name", "username"],
            transaction: t,
            raw: true,
            nest: true,
          });
        }

        if (item.status !== "available" || item.stock < quantity) {
          throw new Error("Item not available or insufficient stock");
        }

        const cacheKeyUser = CACHE_KEYS.IDENTITY.USER_BY_ID(user_id);
        let user = await getCache(cacheKeyUser);

        if (!user) {
          user = await userRepo.findById(user_id, {
            include: [
              {
                model: db.Coin,
                as: "coins",
                attributes: ["id", "amount"],
              },
            ],
            transaction: t,
            lock: true,
            raw: true,
            nest: true,
          });
          if (!user) throw new Error("User not found");
          await setCache(cacheKeyUser, user, 300);
        }

        if (!user.coins) {
          user.coins = await coinRepo.findOne(
            {
              where: { user_id },
            },
            {
              transaction: t,
              lock: true,
              raw: true,
              nest: true,
            },
          );
        }

        if (!user.coins || user.coins.amount < item.price * quantity) {
          throw new Error("Insufficient balance");
        }

        await coinRepo.updateById(
          user.coins.id,
          {
            amount: user.coins.amount - item.price * quantity,
          },
          { transaction: t },
        );

        const newStock = item.stock - quantity;
        await itemRepo.updateById(
          item.id,
          {
            stock: newStock,
            status: newStock === 0 ? "sold_out" : "available",
          },
          { transaction: t },
        );

        await deleteCache(cacheKeyItem);
        await deleteCache(cacheKeyUser);
        await deleteCache(CACHE_KEYS.COMMERCE.ALL_ITEMS);
        await deleteCache(CACHE_KEYS.COMMERCE.ITEMS_BY_USER_ID(item.creator.id));
        await deleteCache(CACHE_KEYS.COMMERCE.ITEM_BY_PUBLIC_ID(item.public_id));

        await publisher.publish(
          "stock-update",
          JSON.stringify({
            itemId: item_id,
            newStock: newStock,
            name: item.name,
            price: item.price,
            status: newStock === 0 ? "sold_out" : "available",
          }),
        );

        let uniqueCode, exists;
        do {
          uniqueCode = generateCode();
          exists = await transactionRepo.findOne(
            {
              where: { public_id: uniqueCode },
            },
            {
              transaction: t,
              raw: true,
              nest: true,
            },
          );
        } while (exists !== null);

        const itemSnapshot = {
          public_id: item.public_id,
          creator: item.creator,
          name: item.name,
          description: item.description,
          price: item.price,
        };

        const transaction = await transactionRepo.create(
          {
            public_id: uniqueCode,
            receiver_information_id,
            buyer_id: user.id,
            seller_id: item.creator.id,
            item_id: item.id,
            name,
            item_snapshot: itemSnapshot,
            total_price: item.price * quantity,
            quantity,
            status: "pending",
          },
          { transaction: t, raw: true, nest: true },
        );

        await setCache(CACHE_KEYS.COMMERCE.TRANSACTION_BY_ID(transaction.id), transaction, 300);

        const buyerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_BUYER(user.id);
        await deleteCache(buyerCacheKey);

        const sellerCacheKey = CACHE_KEYS.COMMERCE.TRANSACTION_SELLER(item.creator.id);
        await deleteCache(sellerCacheKey);

        await deleteCache(CACHE_KEYS.COMMERCE.COIN_BY_ID(user.coins.id));

        return transaction;
      });
    } catch (error) {
      console.error(`Job ${job.id} failed with error:`, error);
      throw error;
    }
  },
  { connection: redis },
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});
