/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import {
  cancelShippingOrderApi,
  getAllShippingOrdersApi,
  updateShippingOrderApi,
} from "@/src/utils/api";

import DataTable from "../../components/DataTable";
import { ordersColumns } from "../../components/HeaderColumn";
import OrderForm from "./OrderForm";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("edit");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllShippingOrdersApi();
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
    fetchData();
  }, []);

  const handleEditOrder = (order) => {
    alert(`Vui lòng liên hệ người tạo đơn hàng: ${order.User.email}`);
    // setFormMode("edit");
    // setEditData(order);
    // setFormOpen(true);
  };

  const handleCancelOrder = async (order) => {
    alert(`Vui lòng liên hệ người tạo đơn hàng: ${order.User.email}`);
    // if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
    //   try {
    //     const res = await cancelShippingOrderApi(order.order_code);
    //     if (res.success) {
    //       alert("Hủy đơn hàng thành công!");
    //       // Refresh orders list
    //       const ordersRes = await getAllShippingOrdersApi();
    //       if (ordersRes.success) {
    //         setOrders(ordersRes.data);
    //       }
    //     } else {
    //       alert("Hủy đơn hàng thất bại!");
    //     }
    //   } catch (error) {
    //     console.error("Error canceling order:", error);
    //     alert("Có lỗi xảy ra khi hủy đơn hàng!");
    //   }
    // }
  };

  const handleSubmitOrder = async (data, mode) => {
    try {
      if (mode === "edit") {
        const result = await updateShippingOrderApi(data);
        if (result.success) {
          alert("Cập nhật đơn hàng thành công!");
          // Refresh orders list
          const res = await getAllShippingOrdersApi();
          if (res.success) {
            setOrders(res.data);
          }
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
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Orders Management
      </Typography>
      <DataTable
        title="Orders"
        columns={ordersColumns}
        rows={orders}
        onAdd={false}
        onEdit={handleEditOrder}
        onDelete={handleCancelOrder}
        loading={loading}
      />
      <OrderForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitOrder}
        initialData={editData}
        mode={formMode}
      />
    </Box>
  );
}
