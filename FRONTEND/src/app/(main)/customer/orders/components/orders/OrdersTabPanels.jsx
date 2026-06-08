import React from "react";
import OrdersList from "./OrdersList";
import { TabPanel } from "./TabPanel";
import TransactionOrdersList from "./TransactionOrdersList";

const OrdersTabPanels = ({
  tabValue,
  handleTabChange,
  transactions,
  readyToPick,
  confirmedOrders,
  completedOrders,
  cancelledOrders,
  handleCreateOrderFromTransaction,
  handleViewDetails,
  handleConfirmOrder,
  handleCancelOrder,
  handleViewOrderDetails,
  handleOpenEditBuyerInfo,
  handleEditOrder,
  handleCreateBasedOn,
}) => {
  const tabs = [
    { label: `Pending Orders (${transactions.length})`, value: 0 },
    { label: `Ready To Pick (${readyToPick.length})`, value: 1 },
    { label: `In Progress (${confirmedOrders.length})`, value: 2 },
    { label: `Completed (${completedOrders.length})`, value: 3 },
    { label: `Cancelled (${cancelledOrders.length})`, value: 4 },
  ];

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 w-full overflow-x-auto whitespace-nowrap mb-4 scrollbar-none gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(null, tab.value)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tabValue === tab.value
                ? "border-emerald-500 text-emerald-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TabPanel value={tabValue} index={0}>
        <TransactionOrdersList
          transactions={transactions}
          handleCreateOrderFromTransaction={handleCreateOrderFromTransaction}
          handleViewDetails={handleViewDetails}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <OrdersList
          orders={readyToPick}
          handleViewDetails={handleViewOrderDetails}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
          handleEditOrder={handleEditOrder}
          handleCreateBasedOn={handleCreateBasedOn}
          withFilters={true}
          isReadyToPick={true}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <OrdersList
          orders={confirmedOrders}
          handleViewDetails={handleViewOrderDetails}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
          handleEditOrder={handleEditOrder}
          handleCreateBasedOn={handleCreateBasedOn}
          withFilters={true}
          isInProgress={true}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <OrdersList
          orders={completedOrders}
          handleViewDetails={handleViewOrderDetails}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
          handleCreateBasedOn={handleCreateBasedOn}
          withFilters={true}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <OrdersList
          orders={cancelledOrders}
          handleViewDetails={handleViewDetails}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
          withFilters={true}
        />
      </TabPanel>
    </div>
  );
};

export default OrdersTabPanels;
