const express = require("express");
const roleController = require("../controllers/roleController");
const rolePermissionController = require("../controllers/rolePermissionController");
const validate = require("../middlewares/validate");
const { createRoleDto, updateRoleDto } = require("../dtos/roleDto");

const router = express.Router();

router.post("/create", validate(createRoleDto), roleController.handleCreateRole);
router.get("/all-rolepermission", rolePermissionController.handleGetAllRolePermissions);
router.get("/", roleController.handleGetAllRoles);
router.get("/:id", roleController.handleGetRole);
router.put("/:id", validate(updateRoleDto), roleController.handleUpdateRole);
router.delete("/:id", roleController.handleDeleteRole);
// ===================================
router.post("/:role_id/permissions/assign", rolePermissionController.handleAssignPermissionToRole);
router.get("/:role_id/permissions", rolePermissionController.handleGetAllPermissionsByRole);
router.get(
  "/:role_id/permissions/:perm_id",
  rolePermissionController.handleGetPermissionByIdByRole,
);
router.put("/:role_id/permissions/:perm_id", rolePermissionController.handleUpdatePermissionByRole);
router.delete(
  "/:role_id/permissions/:perm_id",
  rolePermissionController.handleRemovePermissionFromRole,
);

module.exports = router;
