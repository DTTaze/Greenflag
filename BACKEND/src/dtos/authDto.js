const { z } = require("zod");

/**
 * @typedef {z.infer<typeof registerUserDto>} RegisterUserDto
 * @typedef {z.infer<typeof loginUserDto>} LoginUserDto
 * @typedef {z.infer<typeof forgotPasswordDto>} ForgotPasswordDto
 * @typedef {z.infer<typeof resetPasswordDto>} ResetPasswordDto
 */

const registerUserDto = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  username: z.string().min(2, "Username phải có ít nhất 2 ký tự"),
  full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  role_id: z.coerce.number().int().positive("Role ID phải là số nguyên dương").optional(),
});

const loginUserDto = registerUserDto.pick({
  email: true,
  password: true,
});

const forgotPasswordDto = z.object({
  email: z.string().email("Email không hợp lệ"),
});

const resetPasswordDto = z.object({
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  token: z.string().min(1, "Reset token không được để trống"),
});

module.exports = {
  registerUserDto,
  loginUserDto,
  forgotPasswordDto,
  resetPasswordDto,
};
