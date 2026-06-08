const permissionService = require("../services/permissionService");

const handleCreatePermission = async (req, res) => {
  const result = await permissionService.createPermission(req.body.action, req.body.subject);
  return res.success("Permission created successfully", result);
};

const handleGetPermission = async (req, res) => {
  const result = await permissionService.getPermissionById(req.params.id);
  return res.success("Permission retrieved successfully", result);
};

const handleGetAllPermissions = async (req, res) => {
  const result = await permissionService.getAllPermissions();
  return res.success("Permissions retrieved successfully", result);
};

const handleUpdatePermission = async (req, res) => {
  const result = await permissionService.updatePermission(req.params.id, req.body);
  return res.success("Permission updated successfully", result);
};

const handleDeletePermission = async (req, res) => {
  const result = await permissionService.deletePermission(req.params.id);
  return res.success("Permission deleted successfully", result);
};

module.exports = {
  handleCreatePermission,
  handleGetPermission,
  handleGetAllPermissions,
  handleUpdatePermission,
  handleDeletePermission,
};
