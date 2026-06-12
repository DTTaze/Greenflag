"use client";

import React, { useEffect, useState } from "react";

import { getAllShippingOrders, updateShippingOrder } from "@/src/utils/api";

import DataTable from "../../components/DataTable";
import { ordersColumns } from "../../components/HeaderColumn";
import OrderForm from "./OrderForm";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const editData = null;
  const formMode = "edit";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllShippingOrders();
      if (res.success) {
        setOrders(res.data);
      } else {
        console.error("Error fetching orders:", res.error);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEditOrder = (order) => {
    alert(`Vui lòng liên hệ người tạo đơn hàng: ${order?.User?.email || order?.buyer?.email || order?.seller?.email || "Không xác định"}`);
  };

  const handleCancelOrder = async (order) => {
    alert(`Vui lòng liên hệ người tạo đơn hàng: ${order?.User?.email || order?.buyer?.email || order?.seller?.email || "Không xác định"}`);
  };

  const handleSubmitOrder = async (data, mode) => {
    try {
      if (mode === "edit") {
        const result = await updateShippingOrder(data);
        if (result.success) {
          alert("Cập nhật đơn hàng thành công!");
          fetchOrders();
        } else {
          alert("Cập nhật đơn hàng thất bại!");
        }
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Có lỗi xảy ra khi cập nhật đơn hàng!");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">Orders Management</h1>
      <DataTable
        title="Orders"
        columns={ordersColumns}
        rows={orders}
        onAdd={false}
        onEdit={handleEditOrder}
        onDelete={handleCancelOrder}
        enableSelection={false}
        loading={loading}
      />
      <OrderForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitOrder}
        initialData={editData}
        mode={formMode}
      />
    </div>
  );
}
