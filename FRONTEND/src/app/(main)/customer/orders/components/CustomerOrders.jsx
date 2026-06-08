import { Alert, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import OrdersDialogsOverlay from "./orders/dialogs/OrdersDialogsOverlay";
import EmptyOrderState from "./orders/EmptyOrderState";
import useOrders from "./orders/hooks/useOrders";
import useShippingAccounts from "./orders/hooks/useShippingAccounts";
import useTransactions from "./orders/hooks/useTransactions";
import OrdersHeader from "./orders/OrdersHeader";
import { calculatePoints } from "./orders/ordersHelpers";
import OrdersTabPanels from "./orders/OrdersTabPanels";

export default function CustomerOrders() {
  const userInfo = useOutletContext();

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

  const {
    shippingAccounts,
    isLoadingAccounts,
    shippingAccountsDialogOpen,
    setShippingAccountsDialogOpen,
    addShippingAccountDialogOpen,
    setAddShippingAccountDialogOpen,
    isEditingShippingAccount,
    newShippingAccount,
    setNewShippingAccount,
    fetchShippingAccounts,
    handleAddShippingAccount,
    handleEditShippingAccount,
    handleUpdateShippingAccount,
    handleDeleteShippingAccount,
    handleSetDefaultShippingAccount,
    resetShippingAccountForm,
  } = useShippingAccounts(userInfo?.id, showAlert);

  const hasLinkedShippingAccounts = () => shippingAccounts.length > 0;

  const {
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
  } = useOrders({
    shippingAccounts,
    hasLinkedShippingAccounts,
    showAlert,
    selectedOrder,
    setSelectedOrder,
    setDetailsDialogOpen,
    setShippingAccountsDialogOpen,
  });

  const {
    transactions,
    isLoadingTransactions,
    buyerInfoDialogOpen,
    setBuyerInfoDialogOpen,
    buyerInfo,
    setBuyerInfo,
    fetchTransactions,
    handleConfirmOrder,
    handleCancelOrder,
    handleViewDetails,
    handleOpenEditBuyerInfo,
    handleUpdateBuyerInfo,
    handleCreateOrderFromTransaction,
  } = useTransactions({
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
    <Box>
      {confirmAlertOpen && (
        <Alert
          severity={alertSeverity}
          sx={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            backgroundColor:
              alertSeverity === "success" ? "var(--light-green)" : "#FFF3E0",
            color:
              alertSeverity === "success" ? "var(--primary-green)" : "#E65100",
            border: `1px solid ${
              alertSeverity === "success" ? "var(--primary-green)" : "#FB8C00"
            }`,
          }}
          onClose={() => setConfirmAlertOpen(false)}
        >
          {alertMessage}
        </Alert>
      )}

      <OrdersHeader
        hasLinkedShippingAccounts={hasLinkedShippingAccounts}
        setShippingAccountsDialogOpen={setShippingAccountsDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        showAlert={showAlert}
      />

      {isLoadingOrders && isLoadingTransactions ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress color="success" />
        </Box>
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
        shippingAccountsDialogOpen={shippingAccountsDialogOpen}
        setShippingAccountsDialogOpen={setShippingAccountsDialogOpen}
        isLoadingAccounts={isLoadingAccounts}
        shippingAccounts={shippingAccounts}
        handleSetDefaultShippingAccount={handleSetDefaultShippingAccount}
        handleEditShippingAccount={handleEditShippingAccount}
        handleDeleteShippingAccount={handleDeleteShippingAccount}
        resetShippingAccountForm={resetShippingAccountForm}
        addShippingAccountDialogOpen={addShippingAccountDialogOpen}
        setAddShippingAccountDialogOpen={setAddShippingAccountDialogOpen}
        isEditingShippingAccount={isEditingShippingAccount}
        newShippingAccount={newShippingAccount}
        setNewShippingAccount={setNewShippingAccount}
        handleAddShippingAccount={handleAddShippingAccount}
        handleUpdateShippingAccount={handleUpdateShippingAccount}
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        setIsEditingOrder={setIsEditingOrder}
        setIsCreatingBasedOn={setIsCreatingBasedOn}
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        initialOrderPayload={initialOrderPayload}
        isEditingOrder={isEditingOrder}
        handleUpdateOrder={handleUpdateOrder}
        handleCreateOrder={handleCreateOrder}
        calculatePoints={calculatePoints}
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
        handleItemChange={handleItemChange}
        isCreatingBasedOn={isCreatingBasedOn}
        handleCreateBasedOn={handleCreateBasedOn}
        selectedOrder={selectedOrder}
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        handleConfirmOrder={handleConfirmOrder}
        handleCancelOrder={handleCancelOrder}
        handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
        buyerInfoDialogOpen={buyerInfoDialogOpen}
        setBuyerInfoDialogOpen={setBuyerInfoDialogOpen}
        buyerInfo={buyerInfo}
        setBuyerInfo={setBuyerInfo}
        handleUpdateBuyerInfo={() => handleUpdateBuyerInfo(orders, setOrders)}
      />
    </Box>
  );
}
