const db = require("../models");
const roleRepo = require("../repositories/roleRepository");
const permRepo = require("../repositories/permissionRepository");
const NotFoundError = require("../errors/NotFoundError.js");
const BadRequestError = require("../errors/BadRequestError.js");

const assignPermissionToRole = async (role_id, permission_id) => {
  const role = await roleRepo.findById(role_id, { raw: true, nest: true });
  const permission = await permRepo.findById(permission_id, { raw: true, nest: true });
  if (!role || !permission) throw new NotFoundError("Role or Permission not found");

  await roleRepo.assignPermission(role_id, permission_id, {
    created_at: new Date(),
    updated_at: new Date(),
  });

  return { message: "Permission assigned to role successfully" };
};

const getAllRolePermissions = async () => {
  return await roleRepo.findAllRolePermissions(
    {
      include: [
        {
          model: db.Role,
          as: "role",
          attributes: ["id", "name"],
        },
        {
          model: db.Permission,
          as: "permission",
          attributes: ["id", "action", "subject"],
        },
      ],
    },
    { raw: true, nest: true },
  );
};

const getPermissionByIdByRole = async (role_id, perm_id) => {
  const rolePermission = await roleRepo.findRolePermission(role_id, perm_id, {
    include: [{ model: db.Permission, as: "permissions" }],
    raw: true,
    nest: true,
  });

  if (!rolePermission) {
    throw new NotFoundError("Permission not found in this role");
  }

  return rolePermission;
};

const getPermissionsByRole = async (role_id) => {
  const role = await roleRepo.findById(role_id, {
    include: [{ model: db.Permission, as: "permissions" }],
    raw: true,
    nest: true,
  });
  if (!role) throw new NotFoundError("Role not found");

  return { permissions: role.permissions || [] };
};

const updatePermissionByRole = async (role_id, perm_id, new_permission_id) => {
  const rolePermission = await roleRepo.findRolePermission(role_id, perm_id, {
    raw: true,
    nest: true,
  });

  if (!rolePermission) {
    throw new NotFoundError("Permission not found in this role");
  }

  const [updatedCount] = await roleRepo.updateRolePermission(role_id, perm_id, new_permission_id);

  if (updatedCount === 0) {
    throw new BadRequestError("Update failed. No rows affected.");
  }

  return { message: "Permission updated successfully" };
};

const removePermissionFromRole = async (role_id, permission_id) => {
  const rolePermission = await roleRepo.findRolePermission(role_id, permission_id, {
    raw: true,
    nest: true,
  });
  if (!rolePermission) throw new NotFoundError("Permission not found in this role");

  await roleRepo.removeRolePermission(role_id, permission_id);
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
