const { z } = require("zod");
const { ITEM_STATUS } = require("../constants/itemStatus");

/**
 * @typedef {z.infer<typeof createItemDto>} CreateItemDto
 * @typedef {z.infer<typeof updateItemDto>} UpdateItemDto
 * @typedef {z.infer<typeof purchaseItemDto>} PurchaseItemDto
 */

const createItemDto = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().int().min(1, "Stock must be at least 1"),
  description: z.string().optional(),
  status: z.enum(Object.values(ITEM_STATUS)).optional(),
  purchase_limit_per_day: z.coerce.number().int().min(1, "Limit must be at least 1").optional(),
  weight: z.coerce.number().min(1, "Weight must be at least 1"),
  length: z.coerce.number().min(1, "Length must be at least 1"),
  width: z.coerce.number().min(1, "Width must be at least 1"),
  height: z.coerce.number().min(1, "Height must be at least 1"),
});

const updateItemDto = createItemDto.partial();

const purchaseItemDto = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  receiver_information_id: z.coerce
    .number()
    .int()
    .positive("Receiver Info ID must be positive")
    .optional(),
  to_name: z.string().min(1, "Receiver name is required"),
  to_phone: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Phone number is invalid"),
  to_address: z.string().min(1, "Address is required"),
});

module.exports = {
  createItemDto,
  updateItemDto,
  purchaseItemDto,
};
