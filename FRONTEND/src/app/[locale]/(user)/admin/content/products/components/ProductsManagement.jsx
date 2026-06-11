"use client";

import React, { useEffect, useState } from "react";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/src/utils/api";

import DataTable from "../../../components/DataTable";
import { productColumns } from "../../../components/HeaderColumn";
import ProductForm from "./ProductForm";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts(showDeleted);
      if (res.success) {
        setProducts(res.data);
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
    fetchProducts();
  }, [showDeleted]);

  const handleAddProduct = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditProduct = (item) => {
    setFormMode("edit");
    setEditData(item);
    setFormOpen(true);
  };

  const handleDeleteProduct = async (item) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        const res = await deleteProduct(item.id);
        if (res.success) {
          alert("Xóa sản phẩm thành công!");
          fetchProducts();
        } else {
          alert("Xóa sản phẩm thất bại!");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSubmitProduct = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createProduct(data);
        if (result.success) {
          alert("Thêm sản phẩm thành công!");
          fetchProducts();
        } else {
          alert("Thêm sản phẩm thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateProduct(data.id, data);
        if (result.success) {
          alert("Cập nhật sản phẩm thành công!");
          fetchProducts();
        } else {
          alert("Cập nhật sản phẩm thất bại!");
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
        title="Products"
        columns={productColumns}
        rows={products}
        onAdd={handleAddProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        loading={loading}
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
      />
      <ProductForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitProduct}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}
