const rolePermissionService = require("../services/rolePermissionService");

const handleAssignPermissionToRole = async (req, res) => {
  const result = await rolePermissionService.assignPermissionToRole(
    req.params.role_id,
    req.body.permission_id,
  );
  return res.success("Permission assigned to role successfully", result);
};

const handleGetPermissionByIdByRole = async (req, res) => {
  const result = await rolePermissionService.getPermissionByIdByRole(
    req.params.role_id,
    req.params.perm_id,
  );
  return res.success("Permission retrieved successfully", result);
};

const handleGetAllPermissionsByRole = async (req, res) => {
  const result = await rolePermissionService.getPermissionsByRole(req.params.role_id);
  return res.success("Permissions retrieved successfully", result);
};

const handleGetAllRolePermissions = async (req, res) => {
  const result = await rolePermissionService.getAllRolePermissions();
  return res.success("Role permission retrieved successfully", result);
};

const handleUpdatePermissionByRole = async (req, res) => {
  const result = await rolePermissionService.updatePermissionByRole(
    req.params.role_id,
    req.params.perm_id,
    req.body.new_perm_id,
  );
  return res.success("Permission updated successfully", result);
};

const handleRemovePermissionFromRole = async (req, res) => {
  const result = await rolePermissionService.removePermissionFromRole(
    req.params.role_id,
    req.params.perm_id,
  );
  return res.success("Permission removed from role successfully", result);
};

module.exports = {
  handleAssignPermissionToRole,
  handleGetPermissionByIdByRole,
  handleGetAllPermissionsByRole,
  handleUpdatePermissionByRole,
  handleRemovePermissionFromRole,
  handleGetAllRolePermissions,
};
