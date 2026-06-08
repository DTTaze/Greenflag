import { Box, Tab, Tabs } from "@mui/material";
import React from "react";

import OrdersList from "./OrdersList";
import { a11yProps, TabPanel } from "./TabPanel";
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
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="order status tabs"
          sx={{
            "& .MuiTab-root": {
              color: "text.secondary",
              "&.Mui-selected": { color: "var(--primary-green)" },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--primary-green)",
            },
          }}
        >
          <Tab
            label={`Pending Orders (${transactions.length})`}
            {...a11yProps(0)}
          />
          <Tab
            label={`Ready To Pick (${readyToPick.length})`}
            {...a11yProps(1)}
          />
          <Tab
            label={`In Progress (${confirmedOrders.length})`}
            {...a11yProps(2)}
          />
          <Tab
            label={`Completed (${completedOrders.length})`}
            {...a11yProps(3)}
          />
          <Tab
            label={`Cancelled (${cancelledOrders.length})`}
            {...a11yProps(4)}
          />
        </Tabs>
      </Box>

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
    </Box>
  );
};

export default OrdersTabPanels;
