const express = require("express");
const permissionController = require("../controllers/permissionController");
const validate = require("../middlewares/validate");
const requirePermission = require("../middlewares/requirePermission");
const { createPermissionDto, updatePermissionDto } = require("../dtos/permissionDto");

const router = express.Router();

router.post(
  "/create",
  requirePermission("create", "Permission"),
  validate(createPermissionDto),
  permissionController.handleCreatePermission,
);
router.get("/", permissionController.handleGetAllPermissions);
router.get("/:id", permissionController.handleGetPermission);
router.put(
  "/:id",
  requirePermission("update", "Permission"),
  validate(updatePermissionDto),
  permissionController.handleUpdatePermission,
);
router.delete(
  "/:id",
  requirePermission("delete", "Permission"),
  permissionController.handleDeletePermission,
);

module.exports = router;
