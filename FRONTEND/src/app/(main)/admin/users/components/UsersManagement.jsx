"use client";

import React, { useEffect, useState } from "react";

import {
  registerUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "@/src/utils/api";

import DataTable from "../../components/DataTable";
import { userColumns } from "../../components/HeaderColumn";
import UserForm from "./UserForm";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.data);
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
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditUser = (user) => {
    setFormMode("edit");
    setEditData(user);
    setFormOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        const res = await deleteUser(user.id);
        if (res.success) {
          alert("Xóa người dùng thành công!");
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
        } else {
          alert("Xóa người dùng thất bại: " + (res.error || ""));
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSubmitUser = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await registerUser(data);
        if (result.success) {
          alert("Thêm người dùng thành công!");
          fetchUsers();
        } else {
          alert("Thêm người dùng thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateUser(data.id, data);
        if (result.success) {
          alert("Cập nhật người dùng thành công!");
          fetchUsers();
        } else {
          alert("Cập nhật người dùng thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    }
    setFormOpen(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-950">Users Management</h1>
      <DataTable
        title="Users"
        columns={userColumns}
        rows={users}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />
      <UserForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitUser}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}
