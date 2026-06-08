/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronDown,
  Copy,
  ListFilter,
  Pencil,
  Receipt,
  Search,
  Truck,
} from "lucide-react";
import React, { useState } from "react";

import { getStatusColor } from "@/src/utils/orderUtils";

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const OrdersList = ({
  orders,
  handleViewDetails,
  handleTrackOrder,
  handleConfirmOrder,
  handleCancelOrder,
  handleOpenEditBuyerInfo,
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
      (order) =>
        order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.receiverPhone?.toLowerCase().includes(searchTerm.toLowerCase()),
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
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, minWidth: 250 }}
          />
        </Box>
      )}

      {/* Desktop view */}
      {!isMobile && (
        <Paper className="customer-card">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "orderCode"}
                      direction={orderBy === "orderCode" ? order : "asc"}
                      onClick={createSortHandler("orderCode")}
                    >
                      Order Code
                    </TableSortLabel>
                    {withFilters && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "orderCode")}
                        sx={{ ml: 1 }}
                      >
                        <ListFilter size={16} />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "date"}
                      direction={orderBy === "date" ? order : "asc"}
                      onClick={createSortHandler("date")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "receiverName"}
                      direction={orderBy === "receiverName" ? order : "asc"}
                      onClick={createSortHandler("receiverName")}
                    >
                      Receiver
                    </TableSortLabel>
                    {withFilters && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleFilterClick(e, "receiverName")}
                        sx={{ ml: 1 }}
                      >
                        <ListFilter size={16} />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "codAmount"}
                      direction={orderBy === "codAmount" ? order : "asc"}
                      onClick={createSortHandler("codAmount")}
                    >
                      COD Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "shippingFee"}
                      direction={orderBy === "shippingFee" ? order : "asc"}
                      onClick={createSortHandler("shippingFee")}
                    >
                      Shipping Fee
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      backgroundColor:
                        order.status === "Pending Confirmation"
                          ? "rgba(46, 125, 50, 0.05)"
                          : "inherit",
                    }}
                  >
                    <TableCell>
                      <Tooltip title="GHN Order Code">
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          {order.orderCode}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Tooltip title={order.receiverAddress}>
                        <Box>
                          <Typography variant="body2">
                            {order.receiverName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.receiverPhone}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                        icon={
                          order.status === "In Progress" ? (
                            <Truck size={16} />
                          ) : undefined
                        }
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(order.codAmount)}</TableCell>
                    <TableCell>{formatCurrency(order.shippingFee)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {order.status === "rejected" && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleViewDetails(order)}
                            sx={{
                              minWidth: 0,
                              p: "4px 8px",
                              borderColor: "var(--primary-green)",
                              color: "var(--primary-green)",
                              "&:hover": {
                                borderColor: "var(--dark-green)",
                                backgroundColor: "rgba(46, 125, 50, 0.08)",
                              },
                            }}
                          >
                            <Receipt size={16} />
                          </Button>
                        )}

                        {order.status === "accepted" && handleCreateBasedOn && (
                          <Tooltip title="Create new order based on this one">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleCreateBasedOn(order)}
                              sx={{
                                minWidth: 0,
                                p: "4px 8px",
                                borderColor: "var(--primary-green)",
                                color: "var(--primary-green)",
                                "&:hover": {
                                  borderColor: "var(--dark-green)",
                                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                                },
                              }}
                            >
                              <Copy size={16} />
                            </Button>
                          </Tooltip>
                        )}

                        {order.status === "Pending Confirmation" && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEditOrder(order)}
                            sx={{
                              minWidth: 0,
                              p: "4px 8px",
                              borderColor: "var(--primary-green)",
                              color: "var(--primary-green)",
                              "&:hover": {
                                borderColor: "var(--dark-green)",
                                backgroundColor: "rgba(46, 125, 50, 0.08)",
                              },
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Mobile view - modified with same additions */}
      {isMobile && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredOrders.map((order) => (
            <Accordion
              key={order.id}
              sx={{
                border:
                  order.status === "Pending Confirmation"
                    ? "1px solid var(--primary-green)"
                    : "1px solid var(--grey-300)",
                borderRadius: "8px !important",
                "&:before": {
                  display: "none",
                },
                mb: 1,
                backgroundColor:
                  order.status === "Pending Confirmation"
                    ? "rgba(46, 125, 50, 0.05)"
                    : "var(--white)",
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} />}
                aria-controls={`order-${order.id}-content`}
                id={`order-${order.id}-header`}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {order.orderCode}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {order.date}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Receiver:
                    </Typography>
                    <Typography variant="body2">
                      {order.receiverName} - {order.receiverPhone}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {order.receiverAddress}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Payment Details:
                    </Typography>
                    <Typography variant="body2">
                      COD Amount: {formatCurrency(order.codAmount)}
                    </Typography>
                    <Typography variant="body2">
                      Shipping Fee: {formatCurrency(order.shippingFee)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "medium", mt: 0.5 }}
                    >
                      Total: {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-end",
                      mt: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(order)}
                      sx={{
                        borderColor: "var(--primary-green)",
                        color: "var(--primary-green)",
                        "&:hover": {
                          borderColor: "var(--dark-green)",
                          backgroundColor: "rgba(46, 125, 50, 0.08)",
                        },
                      }}
                    >
                      Details
                    </Button>

                    {order.status === "accepted" && handleCreateBasedOn && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleCreateBasedOn(order)}
                        sx={{
                          borderColor: "var(--primary-green)",
                          color: "var(--primary-green)",
                          "&:hover": {
                            borderColor: "var(--dark-green)",
                            backgroundColor: "rgba(46, 125, 50, 0.08)",
                          },
                        }}
                      >
                        Copy Order
                      </Button>
                    )}

                    {order.status === "Pending Confirmation" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditOrder(order)}
                        sx={{
                          borderColor: "var(--primary-green)",
                          color: "var(--primary-green)",
                          "&:hover": {
                            borderColor: "var(--dark-green)",
                            backgroundColor: "rgba(46, 125, 50, 0.08)",
                          },
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
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
