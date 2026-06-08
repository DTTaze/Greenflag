const { Queue } = require("bullmq");
const { redis } = require("../config/configRedis");
const { QUEUE_NAMES } = require("../constants/queueNames");
require("dotenv").config();

const purchaseQueue = new Queue(QUEUE_NAMES.PURCHASE, { connection: redis });

module.exports = purchaseQueue;
