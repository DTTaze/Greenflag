import axios from "../axios.customize";

export const getUserApi = () => {
  return axios.get("api/users/me");
};

export const getAllUserApi = () => {
  return axios.get("api/users");
};

export const updateUserApi = (id, data) => {
  return axios.put(`api/users/${id}`, data);
};

export const updateUserPublicApi = (public_id, data) => {
  return axios.put(`api/users/public/${public_id}`, data);
};

export const getUserByIDPublicApi = (public_id) => {
  return axios.get(`api/users/public/${public_id}`);
};

export const deleteUserApi = (id) => {
  return axios.delete(`api/users/${id}`);
};

export const getAllRolesApi = () => {
  return axios.get("api/roles");
};

export const getAllPermissionsApi = () => {
  return axios.get("api/permissions");
};

export const getAllRolesPermissionsApi = () => {
  return axios.get("api/roles/all-rolepermission");
};

export const deleteRoleApi = (id) => {
  return axios.delete(`api/roles/${id}`);
};

export const createRoleApi = (data) => {
  return axios.post("api/roles/create", data);
};

export const updateRoleApi = (id, data) => {
  return axios.put(`api/roles/${id}`, data);
};

export const deletePermissionApi = (id) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createPermissionApi = (data) => {
  return axios.post("api/permissions/create", data);
};

export const updatePermissionApi = (id, data) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const deleteRolePermissionApi = (id) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createRolePermissionApi = (data) => {
  return axios.post("api/permissions/create", data);
};

export const updateRolePermissionApi = (id, data) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const rearrangeRankApi = () => {
  return axios.post("api/ranks/rearrange");
};

export const getUserByIdApi = (id) => {
  return axios.get(`api/users/${id}`);
};
