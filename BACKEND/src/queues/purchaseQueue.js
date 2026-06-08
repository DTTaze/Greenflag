const { Queue } = require("bullmq");
const { redis } = require("../config/configRedis");
require("dotenv").config();

const purchaseQueue = new Queue("purchase", { connection: redis });

module.exports = purchaseQueue;
