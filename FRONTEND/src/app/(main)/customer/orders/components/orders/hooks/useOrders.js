import { useState } from "react";

import {
  createDeliveryOrderFromTransactionApi,
  createShippingOrderApi,
  getAllShippingOrdersBySellerApi,
  getShippingOrderDetailApi,
  updateShippingOrderApi,
} from "@/src/utils/api";

import {
  initialOrderPayload,
  mapBasedOnOrder,
  mapEditableOrder,
} from "../ordersHelpers";

export default function useOrders({
  shippingAccounts,
  hasLinkedShippingAccounts,
  showAlert,
  selectedOrder,
  setSelectedOrder,
  setDetailsDialogOpen,
  setShippingAccountsDialogOpen,
}) {
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isCreatingBasedOn, setIsCreatingBasedOn] = useState(false);
  const [newOrder, setNewOrder] = useState(initialOrderPayload);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await getAllShippingOrdersBySellerApi();
      if (response && response.data) {
        const formattedOrders = response.data.map((order) => {
          let status;
          switch (order.status) {
            case "ready_to_pick":
              status = "ready_to_pick";
              break;
            case "picking":
            case "storing":
            case "transporting":
              status = "delivering";
              break;
            case "delivered":
              status = "delivered";
              break;
            case "cancel":
              status = "cancel";
              break;
            default:
              status = "Pending Confirmation";
          }

          const formattedDate = new Date(
            order.created_date,
          ).toLocaleDateString();

          const dummyItems = [
            {
              type: "Package",
              quantity: 1,
              unit: "pkg",
              weight: order.weight ? `${order.weight}g` : "N/A",
            },
          ];

          return {
            id: order.id,
            orderCode: order.order_code,
            date: formattedDate,
            to_name: order.to_name,
            to_phone: order.to_phone,
            to_address: order.to_address,
            status: status,
            items: dummyItems,
            codAmount: order.cod_amount,
            shippingFee: order.total_amount - order.cod_amount,
            totalAmount: order.total_amount,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            timeline: [
              {
                time: new Date(order.created_date).toLocaleString(),
                status: "Order Created",
              },
              {
                time: new Date(order.updated_at).toLocaleString(),
                status: `Status: ${status}`,
              },
            ],
            locationHistory: [
              {
                time: new Date(order.created_date).toLocaleString(),
                location: "Sender Address",
                status: "Order Created",
              },
            ],
            points: 0,
            collectorName: "GHN Delivery",
            collectorContact: "1900 636 677",
          };
        });

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showAlert("Failed to load orders. Please try again.", "error");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!hasLinkedShippingAccounts()) {
      showAlert(
        "Please link at least one shipping account before creating orders.",
        "error",
      );
      setCreateDialogOpen(false);
      setShippingAccountsDialogOpen(true);
      return;
    }

    try {
      const selectedAccount = shippingAccounts[0];
      let response;
      if (isCreatingBasedOn && selectedOrder) {
        response = await createDeliveryOrderFromTransactionApi(
          selectedOrder.id,
          newOrder,
          selectedAccount.token,
          selectedAccount.shop_id,
        );
      } else {
        response = await createShippingOrderApi(
          newOrder,
          selectedAccount.token,
          selectedAccount.shop_id,
        );
      }

      if (response && response.data) {
        setOrders((prev) => [response.data, ...prev]);
        setCreateDialogOpen(false);
        showAlert("Order created successfully!");
        setNewOrder(initialOrderPayload);
        setIsCreatingBasedOn(false);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showAlert("Failed to create order. Please try again.", "error");
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const shippingAccount =
        shippingAccounts.find((account) => account.is_default) ||
        shippingAccounts[0];

      if (!shippingAccount) {
        throw new Error("No shipping account found to update this order");
      }

      const updateData = {
        order_code: selectedOrder.orderCode,
        to_name: newOrder.to_name || selectedOrder.to_name,
        to_phone: newOrder.to_phone || selectedOrder.to_phone,
        to_address: newOrder.to_address || selectedOrder.to_address,
        to_district_id:
          parseInt(newOrder.to_district_name) ||
          parseInt(selectedOrder.to_district_name),
        content: newOrder.content,
        weight: parseInt(newOrder.weight) || 200,
        length: parseInt(newOrder.length) || 10,
        width: parseInt(newOrder.width) || 10,
        height: parseInt(newOrder.height) || 10,
        cod_amount: parseInt(newOrder.cod_amount) || 0,
        note: newOrder.note,
      };

      await updateShippingOrderApi({
        orderData: updateData,
        token: shippingAccount.token,
        shopId: shippingAccount.shop_id,
      });

      showAlert("Order updated successfully!");
      setCreateDialogOpen(false);
      setIsEditingOrder(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      showAlert("Failed to update order. Please try again.", "error");
    }
  };

  const handleEditOrder = (order) => {
    setIsEditingOrder(true);
    setSelectedOrder(order);
    setNewOrder(mapEditableOrder(order));
    setCreateDialogOpen(true);
  };

  const handleCreateBasedOn = (order) => {
    setIsCreatingBasedOn(true);
    setNewOrder(mapBasedOnOrder(order));
    setCreateDialogOpen(true);
  };

  const handleViewOrderDetails = async (transaction) => {
    try {
      const selectedAccount =
        shippingAccounts.find((acc) => acc.is_default === true) ||
        shippingAccounts[0];

      const response = await getShippingOrderDetailApi(
        transaction.orderCode,
        selectedAccount.token,
        selectedAccount.shop_id,
      );
      if (response && response.data) {
        const transactionDetails = {
          ...response.data,
          timeline: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              status: "Transaction Created",
            },
            {
              time: new Date(response.data.updated_at).toLocaleString(),
              status: `Status: ${response.data.status}`,
            },
          ],
          locationHistory: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              location: "Transaction Created",
              status: response.data.status,
            },
          ],
        };
        setSelectedOrder(transactionDetails);
        setTimeout(() => {
          setDetailsDialogOpen(true);
        }, 10);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      showAlert(
        "Failed to load transaction details. Please try again.",
        "error",
      );
    }
  };

  const handleAddItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { type: "", quantity: 1, unit: "kg" }],
    }));
  };

  const handleRemoveItem = (index) => {
    setNewOrder((prev) => {
      const items = [...prev.items];
      items.splice(index, 1);
      return { ...prev, items };
    });
  };

  const handleItemChange = (index, field, value) => {
    setNewOrder((prev) => {
      const items = [...prev.items];
      items[index][field] = value;
      return { ...prev, items };
    });
  };

  return {
    orders,
    setOrders,
    isLoadingOrders,
    createDialogOpen,
    setCreateDialogOpen,
    isEditingOrder,
    setIsEditingOrder,
    isCreatingBasedOn,
    setIsCreatingBasedOn,
    newOrder,
    setNewOrder,
    initialOrderPayload,
    fetchOrders,
    handleCreateOrder,
    handleUpdateOrder,
    handleEditOrder,
    handleCreateBasedOn,
    handleViewOrderDetails,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
  };
}
