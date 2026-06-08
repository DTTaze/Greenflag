const { z } = require("zod");
const { emptyToUndefined } = require("./zodHelpers");

/**
 * @typedef {z.infer<typeof createReceiverInfoDto>} CreateReceiverInfoDto
 * @typedef {z.infer<typeof updateReceiverInfoDto>} UpdateReceiverInfoDto
 */

const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

const createReceiverInfoDto = z.object({
  user_id: z.coerce.number().int().positive("User ID must be a positive integer"),
  to_name: z.string().min(1, "Name is required"),
  to_phone: z.string().regex(phoneRegex, "Phone number is invalid"),
  to_address: z.string().min(1, "Address is required"),
  to_ward_name: z.string().min(1, "Ward is required"),
  to_district_name: z.string().min(1, "District is required"),
  to_province_name: z.string().min(1, "Province is required"),
  account_type: emptyToUndefined(z.enum(["home", "office"])).optional(),
  is_default: emptyToUndefined(z.coerce.boolean()).optional(),
});

const updateReceiverInfoDto = createReceiverInfoDto.omit({ user_id: true }).partial();

module.exports = {
  createReceiverInfoDto,
  updateReceiverInfoDto,
};
