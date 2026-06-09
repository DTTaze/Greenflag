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

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getAllItems();
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
  }, []);

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
          setItems((prev) => prev.filter((i) => i.id !== item.id));
        } else {
          alert("Xóa vật phẩm thất bại!");
        }
      } catch (e) {
        console.log(e);
      }
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
        loading={loading}
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
