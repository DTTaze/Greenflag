"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

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

  const tCommon = useTranslations("admin.common");
  const tSidebar = useTranslations("admin.sidebar");
  const tInventory = useTranslations("admin.inventory");

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
    if (window.confirm(tCommon("confirmBulkDelete").replace("{count}", "1"))) {
      try {
        const res = await deleteItem(item.id);
        if (res.success) {
          toast.success(tInventory("deleteSuccess"));
          fetchItems();
        } else {
          toast.error(tInventory("actionFailed"));
        }
      } catch (e) {
        console.log(e);
        toast.error(tInventory("actionFailed"));
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
        toast.success(tCommon("deleteSelected") + `: ${successful.length}`);
      } else {
        const sampleError = failed[0].reason?.response?.data?.message || failed[0].value?.error || "Error";
        toast.warning(`${tCommon("deleteSelected")} ${successful.length}/${ids.length}. ${tInventory("actionFailed")} (${sampleError}).`);
      }
      fetchItems();
    } catch (e) {
      console.log(e);
      toast.error(tInventory("actionFailed"));
    }
  };

  const handleSubmitItem = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createItem(data);
        if (result.success) {
          toast.success(tInventory("addSuccess"));
          fetchItems();
        } else {
          toast.error(tInventory("actionFailed"));
        }
      } catch (e) {
        toast.error(String(e));
      }
    } else if (mode === "edit") {
      try {
        const result = await updateItem(data.id, data);
        if (result.success) {
          toast.success(tInventory("updateSuccess"));
          fetchItems();
        } else {
          toast.error(tInventory("actionFailed"));
        }
      } catch (e) {
        toast.error(String(e));
      }
    }
    setFormOpen(false);
  };

  return (
    <div>
      <DataTable
        title={tSidebar("partnerProducts")}
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
