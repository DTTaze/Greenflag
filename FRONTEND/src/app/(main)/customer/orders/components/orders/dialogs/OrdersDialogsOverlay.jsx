import { Box, CircularProgress, Dialog, Typography } from "@mui/material";
import React from "react";

import { wasteCategories } from "@/src/data/ordersMockData";

import AddShippingAccountForm from "../forms/AddShippingAccountForm";
import CreateOrderForm from "../forms/CreateOrderForm";
import ShippingAccountsList from "../ShippingAccountsList";
import EditBuyerInfoDialog from "./EditBuyerInfoDialog";
import OrderDetailsDialog from "./OrderDetailsDialog";

const OrdersDialogsOverlay = ({
  shippingAccountsDialogOpen,
  setShippingAccountsDialogOpen,
  isLoadingAccounts,
  shippingAccounts,
  handleSetDefaultShippingAccount,
  handleEditShippingAccount,
  handleDeleteShippingAccount,
  resetShippingAccountForm,
  addShippingAccountDialogOpen,
  setAddShippingAccountDialogOpen,
  isEditingShippingAccount,
  newShippingAccount,
  setNewShippingAccount,
  handleAddShippingAccount,
  handleUpdateShippingAccount,
  createDialogOpen,
  setCreateDialogOpen,
  setIsEditingOrder,
  setIsCreatingBasedOn,
  newOrder,
  setNewOrder,
  initialOrderPayload,
  isEditingOrder,
  handleUpdateOrder,
  handleCreateOrder,
  calculatePoints,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
  isCreatingBasedOn,
  handleCreateBasedOn,
  selectedOrder,
  detailsDialogOpen,
  setDetailsDialogOpen,
  handleConfirmOrder,
  handleCancelOrder,
  handleOpenEditBuyerInfo,
  buyerInfoDialogOpen,
  setBuyerInfoDialogOpen,
  buyerInfo,
  setBuyerInfo,
  handleUpdateBuyerInfo,
}) => {
  return (
    <>
      {/* Shipping Accounts Dialog */}
      <Dialog
        open={shippingAccountsDialogOpen}
        onClose={() => setShippingAccountsDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        {isLoadingAccounts ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress color="success" />
            <Typography sx={{ mt: 2 }}>Loading shipping accounts...</Typography>
          </Box>
        ) : (
          <ShippingAccountsList
            shippingAccounts={shippingAccounts}
            handleSetDefaultShippingAccount={handleSetDefaultShippingAccount}
            handleEditShippingAccount={handleEditShippingAccount}
            handleDeleteShippingAccount={handleDeleteShippingAccount}
            handleOpenAddDialog={() => {
              setShippingAccountsDialogOpen(false);
              resetShippingAccountForm();
              setAddShippingAccountDialogOpen(true);
            }}
            handleCloseDialog={() => setShippingAccountsDialogOpen(false)}
          />
        )}
      </Dialog>

      {/* Add/Edit Shipping Account Dialog */}
      <Dialog
        open={addShippingAccountDialogOpen}
        onClose={() => {
          setAddShippingAccountDialogOpen(false);
          if (isEditingShippingAccount) {
            setShippingAccountsDialogOpen(true);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <AddShippingAccountForm
          newShippingAccount={newShippingAccount}
          setNewShippingAccount={setNewShippingAccount}
          handleAddShippingAccount={handleAddShippingAccount}
          handleUpdateShippingAccount={handleUpdateShippingAccount}
          handleCloseDialog={() => setAddShippingAccountDialogOpen(false)}
          handleOpenManageDialog={() => setShippingAccountsDialogOpen(true)}
          isEditing={isEditingShippingAccount}
          resetForm={resetShippingAccountForm}
        />
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setIsEditingOrder(false);
          setIsCreatingBasedOn(false);
          setNewOrder(initialOrderPayload);
        }}
        fullWidth
        maxWidth="md"
      >
        <CreateOrderForm
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleCreateOrder={
            isEditingOrder ? handleUpdateOrder : handleCreateOrder
          }
          handleCloseDialog={() => {
            setCreateDialogOpen(false);
            setIsEditingOrder(false);
            setIsCreatingBasedOn(false);
          }}
          calculatePoints={calculatePoints}
          shippingAccounts={shippingAccounts}
          wasteCategories={wasteCategories}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
          isEditMode={isEditingOrder}
          isBasedOnMode={isCreatingBasedOn}
        />
      </Dialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          order={selectedOrder}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
          handleCreateBasedOn={handleCreateBasedOn}
        />
      )}

      {/* Edit Buyer Information Dialog */}
      <EditBuyerInfoDialog
        open={buyerInfoDialogOpen}
        onClose={() => setBuyerInfoDialogOpen(false)}
        buyerInfo={buyerInfo}
        setBuyerInfo={setBuyerInfo}
        handleUpdateBuyerInfo={handleUpdateBuyerInfo}
      />
    </>
  );
};

export default OrdersDialogsOverlay;
