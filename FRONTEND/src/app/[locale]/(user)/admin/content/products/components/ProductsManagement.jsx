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
import { toast } from "react-toastify";

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
          toast.success("Xóa sản phẩm thành công!", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            style: {
              background: "#10B981",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
          fetchProducts();
        } else {
          toast.error("Xóa sản phẩm thất bại!", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            style: {
              background: "#EF4444",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
        }
      } catch (e) {
        console.log(e);
        toast.error("Có lỗi xảy ra khi xóa sản phẩm!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          style: {
            background: "#EF4444",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
      }
    }
  };

  const handleBulkDeleteProducts = async (ids) => {
    try {
      const results = await Promise.allSettled(
        ids.map((id) => deleteProduct(id))
      );

      const successful = results.filter((r) => r.status === "fulfilled" && r.value?.success);
      const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value?.success));

      if (failed.length === 0) {
        toast.success(`Đã xóa thành công ${successful.length} sản phẩm.`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          style: {
            background: "#10B981",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
      } else {
        const sampleError = failed[0].reason?.response?.data?.message || failed[0].value?.error || "Dữ liệu đang được sử dụng hoặc bị ràng buộc khóa ngoại";
        toast.warning(`Xóa thành công ${successful.length}/${ids.length} sản phẩm. Thất bại ${failed.length} sản phẩm (${sampleError}).`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          style: {
            background: "#F59E0B",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
      }
      fetchProducts();
    } catch (e) {
      console.log(e);
      toast.error("Đã xảy ra lỗi hệ thống khi thực hiện xóa hàng loạt.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        style: {
          background: "#EF4444",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    }
  };

  const handleSubmitProduct = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createProduct(data);
        if (result.success) {
          toast.success("Thêm sản phẩm thành công!", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            style: {
              background: "#10B981",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
          fetchProducts();
        } else {
          toast.error("Thêm sản phẩm thất bại!", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            style: {
              background: "#EF4444",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
        }
      } catch (e) {
        toast.error(e?.message || String(e), {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          style: {
            background: "#EF4444",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
      }
    } else if (mode === "edit") {
      try {
        const result = await updateProduct(data.id, data);
        if (result.success) {
          toast.success("Cập nhật sản phẩm thành công!", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            style: {
              background: "#10B981",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
          fetchProducts();
        } else {
          toast.error("Cập nhật sản phẩm thất bại!", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            style: {
              background: "#EF4444",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
        }
      } catch (e) {
        toast.error(e?.message || String(e), {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          style: {
            background: "#EF4444",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
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
        onBulkDelete={handleBulkDeleteProducts}
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
