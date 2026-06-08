const { Queue } = require("bullmq");
const { redis } = require("../config/configRedis");
const { QUEUE_NAMES } = require("../constants/queueNames");

const orderSyncQueue = new Queue(QUEUE_NAMES.ORDER_SYNC, { connection: redis });

module.exports = orderSyncQueue;
