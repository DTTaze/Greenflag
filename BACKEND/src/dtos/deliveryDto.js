const { z } = require("zod");
const { CARRIER_TYPES } = require("../constants/carriers");
const { emptyToUndefined } = require("./zodHelpers");

/**
 * @typedef {z.infer<typeof createDeliveryAccountDto>} CreateDeliveryAccountDto
 * @typedef {z.infer<typeof updateDeliveryAccountDto>} UpdateDeliveryAccountDto
 * @typedef {z.infer<typeof createDeliveryOrderDto>} CreateDeliveryOrderDto
 * @typedef {z.infer<typeof createDeliveryOrderFromTransactionDto>} CreateDeliveryOrderFromTransactionDto
 * @typedef {z.infer<typeof updateDeliveryOrderDto>} UpdateDeliveryOrderDto
 */

const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

// --- Delivery Account DTOs ---
const createDeliveryAccountDto = z.object({
  name: z.string().min(1, "Account name is required"),
  carrier: emptyToUndefined(z.enum(Object.values(CARRIER_TYPES))).optional(),
  token: z.string().min(1, "Token is required"),
  shop_id: z.string().min(1, "Shop ID is required"),
  is_default: emptyToUndefined(z.coerce.boolean()).optional(),
  user_id: emptyToUndefined(z.coerce.number().int().positive()).optional(),
});

const updateDeliveryAccountDto = createDeliveryAccountDto.partial();

// --- Delivery Order DTOs ---
const createDeliveryOrderDto = z.object({
  to_name: z.string().min(1, "Recipient name is required"),
  to_phone: z.string().regex(phoneRegex, "Recipient phone number is invalid"),
  to_address: z.string().min(1, "Recipient address is required"),
  to_ward_name: z.string().min(1, "Recipient ward name is required"),
  to_district_name: z.string().min(1, "Recipient district name is required"),
  to_province_name: z.string().min(1, "Recipient province name is required"),
  cod_amount: emptyToUndefined(z.coerce.number().min(0)).optional(),
  weight: z.coerce.number().positive("Weight must be positive"),
  payment_type_id: z.coerce.number().int().positive("Payment type ID is required"),
  required_note: emptyToUndefined(z.string()).optional(),
  service_type_id: emptyToUndefined(z.coerce.number().int().positive()).optional(),
});

const createDeliveryOrderFromTransactionDto = z.object({
  payment_type_id: z.coerce.number().int().positive("Payment type ID is required"),
  required_note: z.string().min(1, "Required note is required"),
  weight: z.coerce.number().positive("Weight must be positive"),
});

const updateDeliveryOrderDto = z.object({
  order_code: z.string().min(1, "Order code is required"),
  to_name: emptyToUndefined(z.string().min(1)).optional(),
  to_phone: emptyToUndefined(
    z.string().regex(phoneRegex, "Recipient phone number is invalid"),
  ).optional(),
  to_address: emptyToUndefined(z.string().min(1)).optional(),
  weight: emptyToUndefined(z.coerce.number().positive()).optional(),
  payment_type_id: emptyToUndefined(z.coerce.number().int().positive()).optional(),
});

module.exports = {
  createDeliveryAccountDto,
  updateDeliveryAccountDto,
  createDeliveryOrderDto,
  createDeliveryOrderFromTransactionDto,
  updateDeliveryOrderDto,
};
