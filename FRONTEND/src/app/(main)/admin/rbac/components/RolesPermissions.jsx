import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  createPermissionApi,
  createRoleApi,
  deletePermissionApi,
  deleteRoleApi,
  getAllPermissionsApi,
  getAllRolesApi,
  getAllRolesPermissionsApi,
  updatePermissionApi,
  updateRoleApi,
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
import RolePermissionForm from "./RolePermissionForm";

// Roles Management
function RolesManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await getAllRolesApi();
        res.success ? setRoles(res.data) : console.log(res.error);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
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
    if (confirm("Bạn có chắc chắn muốn xóa Role này không?")) {
      try {
        const res = await deleteRoleApi(role.id);
        if (res.success) {
          alert("Xóa Role thành công!");
          setRoles((prev) => prev.filter((r) => r.id !== role.id));
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
          ? await createRoleApi(data)
          : await updateRoleApi(data.id, data);

      if (res.success) {
        alert(
          mode === "add"
            ? "Thêm Role thành công!"
            : "Cập nhật Role thành công!",
        );
      } else {
        alert("Có lỗi xảy ra!");
      }
    } catch (e) {
      alert(e);
    }
    setFormOpen(false);
  };

  return (
    <Box>
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
    </Box>
  );
}

// Permissions Management
function PermissionsManagement() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const res = await getAllPermissionsApi();
        res.success ? setPermissions(res.data) : console.log(res.error);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
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
    if (confirm("Bạn có chắc chắn muốn xóa Permission này không?")) {
      try {
        const res = await deletePermissionApi(permission.id);
        if (res.success) {
          alert("Xóa Permission thành công!");
          setPermissions((prev) => prev.filter((p) => p.id !== permission.id));
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
          ? await createPermissionApi(data)
          : await updatePermissionApi(data.id, data);

      if (res.success) {
        alert(
          mode === "add"
            ? "Thêm Permission thành công!"
            : "Cập nhật Permission thành công!",
        );
      } else {
        alert("Có lỗi xảy ra!");
      }
    } catch (e) {
      alert(e);
    }
    setFormOpen(false);
  };

  return (
    <Box>
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
    </Box>
  );
}

function RolesPermissionsManagement() {
  const [rolesPermissions, setRolesPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRolesPermissions = async () => {
      setLoading(true);
      try {
        const res = await getAllRolesPermissionsApi();
        res.success ? setRolesPermissions(res.data) : console.log(res.error);
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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, p: 2 }}>
        Roles & Permissions Management
      </Typography>
      <AdminTabs tabs={tabs} />
    </Box>
  );
}
