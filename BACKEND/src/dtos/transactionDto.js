const { z } = require("zod");
const { TRANSACTION_STATUS } = require("../constants/transactionStatus");
const { emptyToUndefined } = require("./zodHelpers");

/**
 * @typedef {z.infer<typeof createTransactionDto>} CreateTransactionDto
 * @typedef {z.infer<typeof updateTransactionDto>} UpdateTransactionDto
 */

const createTransactionDto = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: emptyToUndefined(
    z.coerce.number().int().min(1, "Quantity must be at least 1"),
  ).optional(),
  buyer_id: z.coerce.number().int().positive("Buyer ID must be a positive integer"),
  item_id: z.coerce.number().int().positive("Item ID must be a positive integer"),
  status: emptyToUndefined(z.enum(Object.values(TRANSACTION_STATUS))).optional(),
});

const updateTransactionDto = createTransactionDto.partial();

module.exports = {
  createTransactionDto,
  updateTransactionDto,
};
