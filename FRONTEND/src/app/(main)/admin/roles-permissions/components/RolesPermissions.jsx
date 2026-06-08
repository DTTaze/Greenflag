"use client";

import React, { useEffect, useState } from "react";

import {
  createPermission,
  createRole,
  deletePermission,
  deleteRole,
  getAllPermissions,
  getAllRoles,
  getAllRolesPermissions,
  updatePermission,
  updateRole,
} from "@/src/utils/api";

import AdminTabs from "../../components/AdminTabs";
import DataTable from "../../components/DataTable";
import {
  permissionColumns,
  roleColumns,
  rolesPermissionsColumns,
} from "../../components/HeaderColumn";
import PermissionForm from "./PermissionForm";
import RoleForm from "./RoleForm";

// Roles Management
function RolesManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getAllRoles();
      if (res.success) {
        setRoles(res.data);
      } else {
        console.log(res.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditRole = (role) => {
    setFormMode("edit");
    setEditData(role);
    setFormOpen(true);
  };

  const handleDeleteRole = async (role) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Role này không?")) {
      try {
        const res = await deleteRole(role.id);
        if (res.success) {
          alert("Xóa Role thành công!");
          setRoles((prev) => prev.filter((r) => r.id !== role.id));
        } else {
          alert("Xóa Role thất bại!");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSubmitRole = async (data, mode) => {
    try {
      const res =
        mode === "add"
          ? await createRole(data)
          : await updateRole(data.id, data);

      if (res.success) {
        alert(
          mode === "add"
            ? "Thêm Role thành công!"
            : "Cập nhật Role thành công!",
        );
        fetchRoles();
      } else {
        alert("Có lỗi xảy ra!");
      }
    } catch (e) {
      alert(e);
    }
    setFormOpen(false);
  };

  return (
    <div>
      <DataTable
        title="Roles"
        columns={roleColumns}
        rows={roles}
        onAdd={handleAddRole}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
        loading={loading}
      />
      <RoleForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitRole}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}

// Permissions Management
function PermissionsManagement() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await getAllPermissions();
      if (res.success) {
        setPermissions(res.data);
      } else {
        console.log(res.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleAddPermission = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditPermission = (permission) => {
    setFormMode("edit");
    setEditData(permission);
    setFormOpen(true);
  };

  const handleDeletePermission = async (permission) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Permission này không?")) {
      try {
        const res = await deletePermission(permission.id);
        if (res.success) {
          alert("Xóa Permission thành công!");
          setPermissions((prev) => prev.filter((p) => p.id !== permission.id));
        } else {
          alert("Xóa Permission thất bại!");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSubmitPermission = async (data, mode) => {
    try {
      const res =
        mode === "add"
          ? await createPermission(data)
          : await updatePermission(data.id, data);

      if (res.success) {
        alert(
          mode === "add"
            ? "Thêm Permission thành công!"
            : "Cập nhật Permission thành công!",
        );
        fetchPermissions();
      } else {
        alert("Có lỗi xảy ra!");
      }
    } catch (e) {
      alert(e);
    }
    setFormOpen(false);
  };

  return (
    <div>
      <DataTable
        title="Permissions"
        columns={permissionColumns}
        rows={permissions}
        onAdd={handleAddPermission}
        onEdit={handleEditPermission}
        onDelete={handleDeletePermission}
        loading={loading}
      />
      <PermissionForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitPermission}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}

// Roles & Permissions mapping
function RolesPermissionsManagement() {
  const [rolesPermissions, setRolesPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRolesPermissions = async () => {
      setLoading(true);
      try {
        const res = await getAllRolesPermissions();
        if (res.success) {
          setRolesPermissions(res.data);
        } else {
          console.log(res.error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRolesPermissions();
  }, []);

  const handleAdd = () => {
    console.log("Add Roles-Permissions mapping");
  };

  const handleEdit = (data) => {
    console.log("Edit Roles-Permissions mapping", data);
  };

  const handleDelete = (data) => {
    console.log("Delete Roles-Permissions mapping", data);
  };

  return (
    <DataTable
      title="Roles - Permissions"
      columns={rolesPermissionsColumns}
      rows={rolesPermissions}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      loading={loading}
    />
  );
}

// Main Component
export default function RolesPermissions() {
  const tabs = [
    { label: "Roles", content: <RolesManagement /> },
    { label: "Permissions", content: <PermissionsManagement /> },
    { label: "Roles - Permissions", content: <RolesPermissionsManagement /> },
  ];

  return (
    <div className="w-full space-y-4 p-4">
      <h1 className="px-2 text-2xl font-bold text-gray-950">
        Roles & Permissions Management
      </h1>
      <AdminTabs tabs={tabs} />
    </div>
  );
}
