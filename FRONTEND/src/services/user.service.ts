import axios from "@/src/utils/axios.customize";

export const getUser = () => {
  return axios.get("api/users/me");
};

export const getAllUsers = () => {
  return axios.get("api/users");
};

export const updateUser = (id: number | string, data: any) => {
  return axios.put(`api/users/${id}`, data);
};

export const updateUserPublic = (public_id: string, data: any) => {
  return axios.put(`api/users/public/${public_id}`, data);
};

export const getUserByIDPublic = (public_id: string) => {
  return axios.get(`api/users/public/${public_id}`);
};

export const deleteUser = (id: number | string) => {
  return axios.delete(`api/users/${id}`);
};

export const getAllRoles = () => {
  return axios.get("api/roles");
};

export const getAllPermissions = () => {
  return axios.get("api/permissions");
};

export const getAllRolesPermissions = () => {
  return axios.get("api/roles/all-rolepermission");
};

export const deleteRole = (id: number | string) => {
  return axios.delete(`api/roles/${id}`);
};

export const createRole = (data: any) => {
  return axios.post("api/roles/create", data);
};

export const updateRole = (id: number | string, data: any) => {
  return axios.put(`api/roles/${id}`, data);
};

export const deletePermission = (id: number | string) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createPermission = (data: any) => {
  return axios.post("api/permissions/create", data);
};

export const updatePermission = (id: number | string, data: any) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const deleteRolePermission = (id: number | string) => {
  return axios.delete(`api/permissions/${id}`);
};

export const createRolePermission = (data: any) => {
  return axios.post("api/permissions/create", data);
};

export const updateRolePermission = (id: number | string, data: any) => {
  return axios.put(`api/permissions/${id}`, data);
};

export const rearrangeRank = () => {
  return axios.post("api/ranks/rearrange");
};

export const getUserById = (id: number | string) => {
  return axios.get(`api/users/${id}`);
};
