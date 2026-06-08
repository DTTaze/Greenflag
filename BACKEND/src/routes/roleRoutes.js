const express = require("express");
const roleController = require("../controllers/roleController");
const rolePermissionController = require("../controllers/rolePermissionController");
const validate = require("../middlewares/validate");
const requirePermission = require("../middlewares/requirePermission");
const { createRoleDto, updateRoleDto } = require("../dtos/roleDto");

const router = express.Router();

router.post(
  "/create",
  requirePermission("create", "Role"),
  validate(createRoleDto),
  roleController.handleCreateRole,
);
router.get("/all-rolepermission", rolePermissionController.handleGetAllRolePermissions);
router.get("/", roleController.handleGetAllRoles);
router.get("/:id", roleController.handleGetRole);
router.put(
  "/:id",
  requirePermission("update", "Role"),
  validate(updateRoleDto),
  roleController.handleUpdateRole,
);
router.delete("/:id", requirePermission("delete", "Role"), roleController.handleDeleteRole);

// RolePermission assignment routes
router.post(
  "/:role_id/permissions/assign",
  requirePermission("assign", "RolePermission"),
  rolePermissionController.handleAssignPermissionToRole,
);
router.get("/:role_id/permissions", rolePermissionController.handleGetAllPermissionsByRole);
router.get(
  "/:role_id/permissions/:perm_id",
  rolePermissionController.handleGetPermissionByIdByRole,
);
router.put(
  "/:role_id/permissions/:perm_id",
  requirePermission("update", "RolePermission"),
  rolePermissionController.handleUpdatePermissionByRole,
);
router.delete(
  "/:role_id/permissions/:perm_id",
  requirePermission("delete", "RolePermission"),
  rolePermissionController.handleRemovePermissionFromRole,
);

module.exports = router;
