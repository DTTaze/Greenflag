"use client";

import React, { useEffect, useState } from "react";

import {
  createItem,
  deleteItem,
  getAllItems,
  updateItem,
} from "@/src/utils/api";

import DataTable from "../../../components/DataTable";
import { itemColumns } from "../../../components/HeaderColumn";
import ItemForm from "./ItemForm";

export default function ItemsManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getAllItems(showDeleted);
      if (res.success) {
        setItems(res.data);
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
    fetchItems();
  }, [showDeleted]);

  const handleAddItem = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditItem = (item) => {
    setFormMode("edit");
    setEditData(item);
    setFormOpen(true);
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        const res = await deleteItem(item.id);
        if (res.success) {
          alert("Xóa vật phẩm thành công!");
          fetchItems();
        } else {
          alert("Xóa vật phẩm thất bại!");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleBulkDeleteItems = async (ids) => {
    try {
      const results = await Promise.allSettled(
        ids.map((id) => deleteItem(id))
      );

      const successful = results.filter((r) => r.status === "fulfilled" && r.value?.success);
      const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value?.success));

      if (failed.length === 0) {
        alert(`Đã xóa thành công ${successful.length} vật phẩm.`);
      } else {
        const sampleError = failed[0].reason?.response?.data?.message || failed[0].value?.error || "Dữ liệu đang được sử dụng hoặc bị ràng buộc khóa ngoại";
        alert(`Xóa thành công ${successful.length}/${ids.length} vật phẩm. Thất bại ${failed.length} vật phẩm (${sampleError}).`);
      }
      fetchItems();
    } catch (e) {
      console.log(e);
      alert("Đã xảy ra lỗi hệ thống khi thực hiện xóa hàng loạt.");
    }
  };

  const handleSubmitItem = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createItem(data);
        if (result.success) {
          alert("Thêm vật phẩm thành công!");
          fetchItems();
        } else {
          alert("Thêm vật phẩm thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateItem(data.id, data);
        if (result.success) {
          alert("Cập nhật vật phẩm thành công!");
          fetchItems();
        } else {
          alert("Cập nhật vật phẩm thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    }
    setFormOpen(false);
  };

  return (
    <div>
      <DataTable
        title="Items"
        columns={itemColumns}
        rows={items}
        onAdd={handleAddItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onBulkDelete={handleBulkDeleteItems}
        loading={loading}
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
      />
      <ItemForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitItem}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}
