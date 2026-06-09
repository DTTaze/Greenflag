import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  deleteCustomerItem,
  getItemByUserId,
  getUser,
  updateCustomerItem,
  uploadItem,
} from "@/src/utils/api";

import ItemDialog from "./ItemDialog";
import ItemFilters from "./ItemFilters";
import ItemTable from "./ItemTable";

const CustomerItems = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    minPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const response = await getUser();
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Failed to fetch user information. Please try again later.");
    }
  };

  const fetchItems = async () => {
    if (!userInfo?.id) return;

    try {
      setLoading(true);
      const response = await getItemByUserId(userInfo.id);
      if (response.data) {
        setItems(response.data);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch items. Please try again later.");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let result = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower),
      );
    }

    if (filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.minPrice) {
      result = result.filter((item) => item.price >= Number(filters.minPrice));
    }

    setFilteredItems(result);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?.id) {
      fetchItems();
    }
  }, [userInfo]);

  useEffect(() => {
    filterItems();
  }, [items, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      minPrice: "",
    });
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteCustomerItem(itemId);
      await fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleSaveItem = async (formData, images) => {
    try {
      setIsSubmitting(true);
      if (selectedItem) {
        const response = await updateCustomerItem(
          selectedItem.id,
          formData,
          images,
        );
        if (response.data) {
          await fetchItems();
        }
      } else {
        const response = await uploadItem(formData, images);
        if (response.data) {
          await fetchItems();
        }
      }
      setOpenDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <p className="text-red-650 font-medium">{error}</p>
        <Button
          onClick={fetchItems}
          className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Items</h2>
        <Button
          onClick={handleAddItem}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add Item
        </Button>
      </div>

      {error && (
        <div className="text-red-650 mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4 text-sm">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="hover:text-red-750 ml-2 font-bold text-red-500"
          >
            ×
          </button>
        </div>
      )}

      <ItemFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <ItemTable
        items={filteredItems}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onAdd={handleAddItem}
      />

      <ItemDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveItem}
        item={selectedItem}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CustomerItems;
