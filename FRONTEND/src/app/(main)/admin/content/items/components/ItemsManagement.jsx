import React, { useState, useEffect } from "react";
import DataTable from "../../../components/DataTable";
import { itemColumns } from "../../../components/HeaderColumn";
import {
  getAllItemsApi,
  deleteItemApi,
  createItemApi,
  updateItemApi,
} from "@/src/utils/api";
import { Box } from "@mui/material";
import ItemForm from "./ItemForm";

export default function ItemsManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllItemsApi();

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

    fetchData();
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
    const res = await deleteItemApi(item.id);
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      if (res.success) {
        alert("Xóa vật phẩm thành công!");
        setUsers((prev) => prev.filter((u) => u.id !== item.id));
      }
    }
  };
  const handleSubmitItem = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createItemApi(data);
        if (result.success) {
          alert("Thêm vật phẩm thành công!");
        } else {
          alert("Thêm vật phẩm thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateItemApi(data.id, data);
        if (result.success) {
          alert("Cập nhật vật phẩm thành công!");
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
    <Box>
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
    </Box>
  );
}
