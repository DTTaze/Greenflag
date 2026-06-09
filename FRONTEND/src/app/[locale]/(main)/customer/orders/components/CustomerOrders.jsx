import React, { useEffect, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

import OrdersDialogsOverlay from "./orders/dialogs/OrdersDialogsOverlay";
import EmptyOrderState from "./orders/EmptyOrderState";
import useOrders from "./orders/hooks/useOrders";
import useShippingAccounts from "./orders/hooks/useShippingAccounts";
import useTransactions from "./orders/hooks/useTransactions";
import OrdersHeader from "./orders/OrdersHeader";
import OrdersTabPanels from "./orders/OrdersTabPanels";

export default function CustomerOrders() {
  const { user } = useAuthStore();
  const userInfo = user;

  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setConfirmAlertOpen(true);
    setTimeout(() => setConfirmAlertOpen(false), 3000);
  };

  const shippingAccountsState = useShippingAccounts(userInfo?.id, showAlert);
  const {
    shippingAccounts,
    setShippingAccountsDialogOpen,
    fetchShippingAccounts,
  } = shippingAccountsState;

  const hasLinkedShippingAccounts = () => shippingAccounts.length > 0;

  const ordersState = useOrders({
    shippingAccounts,
    hasLinkedShippingAccounts,
    showAlert,
    selectedOrder,
    setSelectedOrder,
    setDetailsDialogOpen,
    setShippingAccountsDialogOpen,
  });
  const {
    orders,
    setCreateDialogOpen,
    setIsCreatingBasedOn,
    setNewOrder,
    fetchOrders,
    handleViewOrderDetails,
    handleEditOrder,
    handleCreateBasedOn,
    isLoadingOrders,
  } = ordersState;

  const transactionsState = useTransactions({
    shippingAccounts,
    showAlert,
    selectedOrder,
    setSelectedOrder,
    setDetailsDialogOpen,
    setNewOrder,
    setIsCreatingBasedOn,
    setCreateDialogOpen,
    fetchOrders,
  });
  const {
    transactions,
    isLoadingTransactions,
    fetchTransactions,
    handleConfirmOrder,
    handleCancelOrder,
    handleViewDetails,
    handleOpenEditBuyerInfo,
    handleCreateOrderFromTransaction,
  } = transactionsState;

  useEffect(() => {
    fetchShippingAccounts();
    fetchOrders();
    fetchTransactions();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const readyToPick = orders.filter(
    (order) => order.status === "ready_to_pick",
  );
  const confirmedOrders = orders.filter(
    (order) => order.status === "delivering",
  );
  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  );
  const cancelledOrders = orders.filter((order) => order.status === "cancel");

  return (
    <div>
      {confirmAlertOpen && (
        <div
          className={`fixed top-20 right-5 z-[9999] flex items-center rounded border px-4 py-3 shadow-md transition-all ${
            alertSeverity === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {alertMessage}
        </div>
      )}

      <OrdersHeader
        hasLinkedShippingAccounts={hasLinkedShippingAccounts}
        setShippingAccountsDialogOpen={setShippingAccountsDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        showAlert={showAlert}
      />

      {isLoadingOrders && isLoadingTransactions ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : orders.length === 0 && transactions.length === 0 ? (
        <EmptyOrderState
          hasLinkedShippingAccounts={hasLinkedShippingAccounts()}
          handleOpenCreateDialog={() => setCreateDialogOpen(true)}
          handleOpenShippingAccountsDialog={() =>
            setShippingAccountsDialogOpen(true)
          }
        />
      ) : (
        <OrdersTabPanels
          tabValue={tabValue}
          handleTabChange={handleTabChange}
          transactions={transactions}
          readyToPick={readyToPick}
          confirmedOrders={confirmedOrders}
          completedOrders={completedOrders}
          cancelledOrders={cancelledOrders}
          handleCreateOrderFromTransaction={handleCreateOrderFromTransaction}
          handleViewDetails={handleViewDetails}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleViewOrderDetails={handleViewOrderDetails}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
          handleEditOrder={handleEditOrder}
          handleCreateBasedOn={handleCreateBasedOn}
        />
      )}

      <OrdersDialogsOverlay
        shippingAccountsState={shippingAccountsState}
        ordersState={ordersState}
        transactionsState={transactionsState}
        selectedOrder={selectedOrder}
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
      />
    </div>
  );
}
