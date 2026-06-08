import {
  Box,
  Button,
  Menu,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Search } from "lucide-react";
import React, { useState } from "react";

import OrdersDesktopTable from "./OrdersDesktopTable";
import OrdersMobileList from "./OrdersMobileList";

const OrdersList = ({
  orders,
  handleViewDetails,
  handleEditOrder,
  handleCreateBasedOn,
  withFilters = false,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [filterColumn, setFilterColumn] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Create sort handler
  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };

  // Handle filter menu
  const handleFilterClick = (event, column) => {
    setFilterMenuAnchor(event.currentTarget);
    setFilterColumn(column);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleFilterApply = () => {
    // Filter logic would be implemented here
    handleFilterClose();
  };

  // Filter and sort orders
  let filteredOrders = [...orders];

  // Apply search filter
  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (orderItem) =>
        orderItem.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderItem.receiverName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        orderItem.receiverPhone
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }

  // Sort orders
  filteredOrders.sort((a, b) => {
    let valueA, valueB;

    // Define sorting behavior for each column
    switch (orderBy) {
      case "date":
        valueA = new Date(a.date);
        valueB = new Date(b.date);
        break;
      case "orderCode":
        valueA = a.orderCode || "";
        valueB = b.orderCode || "";
        break;
      case "receiverName":
        valueA = a.receiverName || "";
        valueB = b.receiverName || "";
        break;
      case "codAmount":
        valueA = Number(a.codAmount) || 0;
        valueB = Number(b.codAmount) || 0;
        break;
      case "shippingFee":
        valueA = Number(a.shippingFee) || 0;
        valueB = Number(b.shippingFee) || 0;
        break;
      default:
        valueA = a[orderBy];
        valueB = b[orderBy];
    }

    // Handle undefined values
    if (valueA === undefined) return order === "asc" ? -1 : 1;
    if (valueB === undefined) return order === "asc" ? 1 : -1;

    // Compare values
    return (
      (order === "asc" ? 1 : -1) *
      (valueA < valueB ? -1 : valueA > valueB ? 1 : 0)
    );
  });

  return (
    <>
      {withFilters && (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <TextField
            placeholder="Search orders..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} />,
            }}
            sx={{ mr: 2, minWidth: 250 }}
          />
        </Box>
      )}

      {/* Desktop view */}
      {!isMobile && (
        <OrdersDesktopTable
          filteredOrders={filteredOrders}
          orderBy={orderBy}
          order={order}
          createSortHandler={createSortHandler}
          withFilters={withFilters}
          handleFilterClick={handleFilterClick}
          handleViewDetails={handleViewDetails}
          handleEditOrder={handleEditOrder}
          handleCreateBasedOn={handleCreateBasedOn}
        />
      )}

      {/* Mobile view */}
      {isMobile && (
        <OrdersMobileList
          filteredOrders={filteredOrders}
          handleViewDetails={handleViewDetails}
          handleEditOrder={handleEditOrder}
          handleCreateBasedOn={handleCreateBasedOn}
        />
      )}

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterClose}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Filter {filterColumn}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={filterValue}
            onChange={handleFilterValueChange}
            placeholder={`Search by ${filterColumn}...`}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              size="small"
              onClick={handleFilterClose}
              sx={{ color: "text.secondary" }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleFilterApply}
              sx={{ bgcolor: "var(--primary-green)", color: "white" }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default OrdersList;
