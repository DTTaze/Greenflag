import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { Copy, ListFilter, Pencil, Receipt, Truck } from "lucide-react";
import React from "react";

import { getStatusColor } from "@/src/utils/orderUtils";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const OrdersDesktopTable = ({
  filteredOrders,
  orderBy,
  order,
  createSortHandler,
  withFilters,
  handleFilterClick,
  handleViewDetails,
  handleEditOrder,
  handleCreateBasedOn,
}) => {
  return (
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
            {filteredOrders.map((orderItem) => (
              <TableRow
                key={orderItem.id}
                sx={{
                  backgroundColor:
                    orderItem.status === "Pending Confirmation"
                      ? "rgba(46, 125, 50, 0.05)"
                      : "inherit",
                }}
              >
                <TableCell>
                  <Tooltip title="GHN Order Code">
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {orderItem.orderCode}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{orderItem.date}</TableCell>
                <TableCell>
                  <Tooltip title={orderItem.receiverAddress}>
                    <Box>
                      <Typography variant="body2">
                        {orderItem.receiverName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {orderItem.receiverPhone}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={orderItem.status}
                    color={getStatusColor(orderItem.status)}
                    size="small"
                    icon={
                      orderItem.status === "In Progress" ? (
                        <Truck size={16} />
                      ) : undefined
                    }
                  />
                </TableCell>
                <TableCell>{formatCurrency(orderItem.codAmount)}</TableCell>
                <TableCell>{formatCurrency(orderItem.shippingFee)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {orderItem.status === "rejected" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(orderItem)}
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

                    {orderItem.status === "accepted" && handleCreateBasedOn && (
                      <Tooltip title="Create new order based on this one">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleCreateBasedOn(orderItem)}
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

                    {orderItem.status === "Pending Confirmation" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditOrder(orderItem)}
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
  );
};

export default OrdersDesktopTable;
