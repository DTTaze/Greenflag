const { Queue } = require("bullmq");
const { redis } = require("../config/configRedis");
const { QUEUE_NAMES } = require("../constants/queueNames");

const queues = {};

const getQueue = (name) => {
  if (!queues[name]) {
    queues[name] = new Queue(name, { connection: redis });
  }
  return queues[name];
};

module.exports = {
  getQueue,
  purchaseQueue: getQueue(QUEUE_NAMES.PURCHASE),
  orderSyncQueue: getQueue(QUEUE_NAMES.ORDER_SYNC),
};
