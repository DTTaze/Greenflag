const { z } = require("zod");

/**
 * @typedef {z.infer<typeof updateUserProfileDto>} UpdateUserProfileDto
 * @typedef {z.infer<typeof adminUpdateUserDto>} AdminUpdateUserDto
 */

const updateUserProfileDto = z.object({
  username: z.string().min(2, "Username phải có ít nhất 2 ký tự").optional(),
  full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").optional(),
  phone_number: z
    .string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ")
    .optional(),
  email: z.string().email("Email không hợp lệ").optional(),
});

const adminUpdateUserDto = updateUserProfileDto.extend({
  role_id: z.coerce.number().int().positive("Role ID phải là số nguyên dương").optional(),
});

module.exports = {
  updateUserProfileDto,
  adminUpdateUserDto,
};
