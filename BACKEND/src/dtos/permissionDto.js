const { z } = require("zod");
const { emptyToUndefined } = require("./zodHelpers");

/**
 * @typedef {z.infer<typeof createPermissionDto>} CreatePermissionDto
 * @typedef {z.infer<typeof updatePermissionDto>} UpdatePermissionDto
 */

const createPermissionDto = z.object({
  action: z.string().min(1, "Permission action is required"),
  subject: emptyToUndefined(z.string()).optional(),
});

const updatePermissionDto = createPermissionDto.partial();

module.exports = {
  createPermissionDto,
  updatePermissionDto,
};
