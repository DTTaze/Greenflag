// workers/orderSyncWorker.js
const { Worker } = require("bullmq");
const db = require("../models");
const { DeliveryOrder } = db;
const { redis } = require("../config/configRedis");
const { getDeliveryOrderInfo } = require("../services/deliveryOrderService");

const worker = new Worker(
  "orderSync",
  async (job) => {
    const { orderCode, deliveryAccountId } = job.data;
    const apiRes = await getDeliveryOrderInfo(
      orderCode,
      deliveryAccountId.token,
      deliveryAccountId.shop_id,
    );
    console.log("check api res", apiRes);
    if (apiRes.message != "Success") {
      throw new Error("Failed to fetch GHN order detail");
    }

    const data = apiRes.data;

    const existing = await DeliveryOrder.findOne({
      where: { order_code: orderCode },
    });
    if (!existing) return;
    const updatedFields = {
      status: data.status,
      to_name: data.to_name,
      to_phone: data.to_phone,
      to_address: data.to_address,
      is_printed: data.is_printed,
      created_date: data.created_date,
      cod_amount: data.cod_amount,
      weight: data.weight,
      payment_type_id: data.payment_type_id,
      total_amount: data.total_fee,
    };

    let shouldUpdate = false;
    for (const key in updatedFields) {
      if (existing[key] !== updatedFields[key]) {
        shouldUpdate = true;
        break;
      }
    }

    if (shouldUpdate) {
      await existing.update(updatedFields);
    }

    return { updated: true, orderCode };
  },
  { connection: redis },
);

worker.on("completed", (job) => {
  console.log(`✅ Synced order: ${job.data.orderCode}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Failed to sync ${job.data.orderCode}: ${JSON.stringify(err.message)}`);
});
