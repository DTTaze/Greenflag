import React, { useState, useEffect } from "react";
import DataTable from "../../../components/DataTable";
import { productColumns } from "../../../components/HeaderColumn";
import {
  getAllProductsApi,
  deleteProductApi,
  createProductApi,
  updateProductApi,
} from "@/src/utils/api";
import { Box } from "@mui/material";
import ProductForm from "./ProductForm";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllProductsApi();

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

    fetchData();
  }, []);
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
    const res = await deleteProductApi(item.id);
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      if (res.success) {
        alert("Xóa sản phẩm thành công!");
        setProducts((prev) => prev.filter((u) => u.id !== item.id));
      }
    }
  };
  const handleSubmitProduct = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createProductApi(data);
        if (result.success) {
          alert("Thêm sản phẩm thành công!");
        } else {
          alert("Thêm sản phẩm thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateProductApi(data.id, data);
        if (result.success) {
          alert("Cập nhật sản phẩm thành công!");
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
    <Box>
      <DataTable
        title="Products"
        columns={productColumns}
        rows={products}
        onAdd={handleAddProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        loading={loading}
      />
      <ProductForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitProduct}
        initialData={editData}
        mode={formMode}
      />
    </Box>
  );
}
