const db = require("../models/index.js");
const RolePermission = db.RolePermission;
const Role = db.Role;
const Permission = db.Permission;
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const assignPermissionToRole = async (role_id, permission_id) => {
  const role = await Role.findByPk(role_id);
  const permission = await Permission.findByPk(permission_id);
  if (!role || !permission) throw new NotFoundError("Role or Permission not found");

  await RolePermission.create({
    role_id,
    permission_id,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return { message: "Permission assigned to role successfully" };
};

const getAllRolePermissions = async () => {
  return await RolePermission.findAll({
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"],
      },
      {
        model: Permission,
        as: "permission",
        attributes: ["id", "action", "subject"],
      },
    ],
  });
};

const getPermissionByIdByRole = async (role_id, perm_id) => {
  const rolePermission = await RolePermission.findOne({
    where: { role_id: role_id, permission_id: perm_id },
    include: [{ model: Permission, as: "permissions" }],
  });

  if (!rolePermission) {
    throw new NotFoundError("Permission not found in this role");
  }

  return rolePermission;
};

const getPermissionsByRole = async (role_id) => {
  const role = await Role.findByPk(role_id, {
    include: [{ model: Permission, as: "permissions" }],
  });
  if (!role) throw new NotFoundError("Role not found");

  return { permissions: role.permissions };
};

const updatePermissionByRole = async (role_id, perm_id, new_permission_id) => {
  const rolePermission = await RolePermission.findOne({
    where: { role_id: role_id, permission_id: perm_id },
  });

  if (!rolePermission) {
    throw new NotFoundError("Permission not found in this role");
  }

  const [updatedCount] = await RolePermission.update(
    { permission_id: new_permission_id },
    { where: { role_id: role_id, permission_id: perm_id } },
  );

  if (updatedCount === 0) {
    throw new BadRequestError("Update failed. No rows affected.");
  }

  return { message: "Permission updated successfully" };
};

const removePermissionFromRole = async (role_id, permission_id) => {
  const rolePermission = await RolePermission.findOne({
    where: { role_id, permission_id },
  });
  if (!rolePermission) throw new NotFoundError("Permission not found in this role");

  await rolePermission.destroy();
  return { message: "Permission removed from role successfully" };
};

module.exports = {
  assignPermissionToRole,
  getPermissionByIdByRole,
  getPermissionsByRole,
  updatePermissionByRole,
  removePermissionFromRole,
  getAllRolePermissions,
};
