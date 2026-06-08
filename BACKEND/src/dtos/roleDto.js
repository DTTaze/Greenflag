const { z } = require("zod");
const { emptyToUndefined } = require("./zodHelpers");

/**
 * @typedef {z.infer<typeof createRoleDto>} CreateRoleDto
 * @typedef {z.infer<typeof updateRoleDto>} UpdateRoleDto
 */

const createRoleDto = z.object({
  name: z.string().min(1, "Role name is required"),
  description: emptyToUndefined(z.string()).optional(),
});

const updateRoleDto = createRoleDto.partial();

module.exports = {
  createRoleDto,
  updateRoleDto,
};
