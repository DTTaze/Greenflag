import React from "react";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { wasteCategories } from "@/src/data/ordersMockData";

import AddShippingAccountForm from "../forms/AddShippingAccountForm";
import CreateOrderForm from "../forms/CreateOrderForm";
import ShippingAccountsList from "../ShippingAccountsList";
import EditBuyerInfoDialog from "./EditBuyerInfoDialog";
import OrderDetailsDialog from "./OrderDetailsDialog";

const OrdersDialogsOverlay = ({
  shippingAccountsState,
  ordersState,
  transactionsState,
  selectedOrder,
  detailsDialogOpen,
  setDetailsDialogOpen,
}) => {
  // Destructure from grouped state objects to avoid over-propping and prop drilling
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
    handleAddShippingAccount,
    handleUpdateShippingAccount,
    handleDeleteShippingAccount,
    handleSetDefaultShippingAccount,
    resetShippingAccountForm,
    handleEditShippingAccount,
  } = shippingAccountsState;

  const {
    createDialogOpen,
    setCreateDialogOpen,
    isEditingOrder,
    setIsEditingOrder,
    isCreatingBasedOn,
    setIsCreatingBasedOn,
    newOrder,
    setNewOrder,
    initialOrderPayload,
    handleCreateOrder,
    handleUpdateOrder,
    handleCreateBasedOn,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    calculatePoints,
  } = ordersState;

  const {
    buyerInfoDialogOpen,
    setBuyerInfoDialogOpen,
    buyerInfo,
    setBuyerInfo,
    handleConfirmOrder,
    handleCancelOrder,
    handleOpenEditBuyerInfo,
    handleUpdateBuyerInfo,
  } = transactionsState;

  return (
    <>
      {/* Shipping Accounts Dialog */}
      <Dialog
        open={shippingAccountsDialogOpen}
        onOpenChange={(isOpen) => !isOpen && setShippingAccountsDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-3xl w-full p-0 overflow-hidden">
          {isLoadingAccounts ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-gray-500 font-medium">Loading shipping accounts...</p>
            </div>
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
        </DialogContent>
      </Dialog>

      {/* Add/Edit Shipping Account Dialog */}
      <Dialog
        open={addShippingAccountDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAddShippingAccountDialogOpen(false);
            if (isEditingShippingAccount) {
              setShippingAccountsDialogOpen(true);
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-lg w-full p-0 overflow-hidden">
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
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog
        open={createDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setCreateDialogOpen(false);
            setIsEditingOrder(false);
            setIsCreatingBasedOn(false);
            setNewOrder(initialOrderPayload);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl w-full p-0 max-h-[90vh] overflow-y-auto">
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
        </DialogContent>
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
