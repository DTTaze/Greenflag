const express = require("express");
const permissionController = require("../controllers/permissionController");

const router = express.Router();

router.post(
  "/create",
  // checkPermission("post", "permission"),
  permissionController.handleCreatePermission,
);
router.get("/", permissionController.handleGetAllPermissions);
router.get("/:id", permissionController.handleGetPermission);
router.put(
  "/:id",
  // checkPermission("put", "permission_id"),
  permissionController.handleUpdatePermission,
);
router.delete(
  "/:id",
  // checkPermission("delete", "permission_id"),
  permissionController.handleDeletePermission,
);

module.exports = router;
