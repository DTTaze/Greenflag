const { z } = require("zod");
const { GHN_ACTIVE_STATUSES } = require("../constants/deliveryStatus");

/**
 * @typedef {z.infer<typeof ghnWebhookDto>} GhnWebhookDto
 */

const ghnWebhookDto = z
  .object({
    OrderCode: z.string().min(1, "OrderCode is required"),
    Status: z.enum(Object.values(GHN_ACTIVE_STATUSES), {
      errorMap: () => ({ message: "Status must be a valid GHN active status" }),
    }),
    TotalFee: z.coerce.number().optional(),
  })
  .passthrough(); // allows foreign/extra fields in webhook payloads

module.exports = { ghnWebhookDto };
