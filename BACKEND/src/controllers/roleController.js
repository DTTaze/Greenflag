const roleService = require("../services/roleService");

const handleCreateRole = async (req, res) => {
  const { name, description } = req.body;
  const result = await roleService.createRole(name, description);
  return res.success("Role created successfully", result);
};

const handleGetRole = async (req, res) => {
  const role_id = Number(req.params.id);
  const result = await roleService.getRoleById(role_id);
  return res.success("Role retrieved successfully", result);
};

const handleGetAllRoles = async (req, res) => {
  const result = await roleService.getAllRoles();
  return res.success("Roles retrieved successfully", result);
};

const handleUpdateRole = async (req, res) => {
  const role_id = Number(req.params.id);
  const result = await roleService.updateRole(role_id, req.body);
  return res.success("Role updated successfully", result);
};

const handleDeleteRole = async (req, res) => {
  const role_id = Number(req.params.id);
  const result = await roleService.deleteRole(role_id);
  return res.success("Role deleted successfully", result);
};

module.exports = {
  handleCreateRole,
  handleGetRole,
  handleGetAllRoles,
  handleUpdateRole,
  handleDeleteRole,
};
