const express = require("express");
const permissionController = require("../controllers/permissionController");
const validate = require("../middlewares/validate");
const { createPermissionDto, updatePermissionDto } = require("../dtos/permissionDto");

const router = express.Router();

router.post("/create", validate(createPermissionDto), permissionController.handleCreatePermission);
router.get("/", permissionController.handleGetAllPermissions);
router.get("/:id", permissionController.handleGetPermission);
router.put("/:id", validate(updatePermissionDto), permissionController.handleUpdatePermission);
router.delete("/:id", permissionController.handleDeletePermission);

module.exports = router;
