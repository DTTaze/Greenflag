const express = require("express");
const roleController = require("../controllers/roleController");
const rolePermissionController = require("../controllers/rolePermissionController");

const router = express.Router();

router.post(
  "/create",
  // checkPermission("create", "role"),
  roleController.handleCreateRole,
);
router.get("/all-rolepermission", rolePermissionController.handleGetAllRolePermissions);
router.get("/", roleController.handleGetAllRoles);
router.get("/:id", roleController.handleGetRole);
router.put(
  "/:id",
  // checkPermission("put", "role_id"),
  roleController.handleUpdateRole,
);
router.delete(
  "/:id",
  // checkPermission("delete", "role_id"),
  roleController.handleDeleteRole,
);
// ===================================
router.post(
  "/:role_id/permissions/assign",
  // checkPermission("post", "role_permission"),
  rolePermissionController.handleAssignPermissionToRole,
);
router.get("/:role_id/permissions", rolePermissionController.handleGetAllPermissionsByRole);
router.get(
  "/:role_id/permissions/:perm_id",
  rolePermissionController.handleGetPermissionByIdByRole,
);
router.put(
  "/:role_id/permissions/:perm_id",
  // checkPermission("put", "role_permission"),
  rolePermissionController.handleUpdatePermissionByRole,
);
router.delete(
  "/:role_id/permissions/:perm_id",
  // checkPermission("delete", "role_permission"),
  rolePermissionController.handleRemovePermissionFromRole,
);

module.exports = router;
