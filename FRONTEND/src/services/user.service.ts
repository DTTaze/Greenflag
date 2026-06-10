import { getCookie } from "cookies-next/client";

import axiosClient, { ACCESS_TOKEN } from "@/src/services";
import axios from "@/src/utils/axios.customize";

import { whoAmI } from "./auth";

export const mapUserToStore = (user: any): any => {
  if (!user) return null;
  const roleMap: Record<string, { id: number; name: string }> = {
    admin: { id: 1, name: "Admin" },
    user: { id: 2, name: "User" },
    partner: { id: 3, name: "Customer" },
  };

  const roleInfo = roleMap[user.role] || { id: 2, name: "User" };

  return {
    ...user,
    id: user.id,
    public_id: user.public_id || user.id,
    full_name: user.fullName || user.profile?.fullName || user.username,
    avatar_url: user.avatarUrl,
    role_id: roleInfo.id,
    roles: roleInfo,
    phone_number: user.phoneNumber || user.profile?.phoneNumber,
  };
};

export const getUser = async () => {
  const token = getCookie(ACCESS_TOKEN);
  if (!token) {
    return {
      status: 401,
      error: "No access token found",
    };
  }

  try {
    const res = await whoAmI();
    if (res.success) {
      return {
        status: 200,
        data: mapUserToStore(res.data),
      };
    }
    return {
      status: 401,
      error: res.message,
    };
  } catch (err: any) {
    return {
      status: err?.response?.status || 500,
      error: err?.response?.data?.message || err?.message,
    };
  }
};

export const getAllUsers = () => {
  return axiosClient.get("/admin/users");
};

export const updateUser = (id: number | string, data: any) => {
  return axiosClient.put(`/admin/users/${id}`, data);
};

export const updateUserPublic = (public_id: string, data: any) => {
  return axiosClient.put(`/admin/users/${public_id}`, data);
};

export const getUserByIDPublic = (public_id: string) => {
  return axiosClient.get(`/admin/users/${public_id}`);
};

export const deleteUser = (id: number | string) => {
  return axiosClient.delete(`/admin/users/${id}`);
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

export const rearrangeRank = () => {
  return axiosClient.post("/admin/ranks/rearrange");
};

export const getUserById = (id: number | string) => {
  return axiosClient.get(`/admin/users/${id}`);
};
