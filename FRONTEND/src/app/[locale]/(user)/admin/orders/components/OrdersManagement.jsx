"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

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

  const tCommon = useTranslations("admin.common");
  const tSidebar = useTranslations("admin.sidebar");
  const tOrders = useTranslations("admin.orders");

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
    const email = order?.User?.email || order?.buyer?.email || order?.seller?.email || "Unknown";
    toast.info(tOrders("contactCreator", { email }));
  };

  const handleCancelOrder = async (order) => {
    const email = order?.User?.email || order?.buyer?.email || order?.seller?.email || "Unknown";
    toast.info(tOrders("contactCreator", { email }));
  };

  const handleSubmitOrder = async (data, mode) => {
    try {
      if (mode === "edit") {
        const result = await updateShippingOrder(data);
        if (result.success) {
          toast.success(tOrders("updateSuccess"));
          fetchOrders();
        } else {
          toast.error(tOrders("updateFailed"));
        }
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(tOrders("updateFailed"));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
        {tOrders("title")}
      </h1>
      <DataTable
        title={tSidebar("shipping")}
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
