import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import React from "react";

import { getStatusColor } from "@/src/utils/orderUtils";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

const OrdersMobileList = ({
  filteredOrders,
  handleViewDetails,
  handleEditOrder,
  handleCreateBasedOn,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {filteredOrders.map((orderItem) => (
        <Accordion
          key={orderItem.id}
          sx={{
            border:
              orderItem.status === "Pending Confirmation"
                ? "1px solid var(--primary-green)"
                : "1px solid var(--grey-300)",
            borderRadius: "8px !important",
            "&:before": {
              display: "none",
            },
            mb: 1,
            backgroundColor:
              orderItem.status === "Pending Confirmation"
                ? "rgba(46, 125, 50, 0.05)"
                : "var(--white)",
          }}
        >
          <AccordionSummary
            expandIcon={<ChevronDown size={20} />}
            aria-controls={`order-${orderItem.id}-content`}
            id={`order-${orderItem.id}-header`}
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
                  {orderItem.orderCode}
                </Typography>
                <Chip
                  label={orderItem.status}
                  color={getStatusColor(orderItem.status)}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {orderItem.date}
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
                  {orderItem.receiverName} - {orderItem.receiverPhone}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {orderItem.receiverAddress}
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
                  COD Amount: {formatCurrency(orderItem.codAmount)}
                </Typography>
                <Typography variant="body2">
                  Shipping Fee: {formatCurrency(orderItem.shippingFee)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  Total: {formatCurrency(orderItem.totalAmount)}
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
                  onClick={() => handleViewDetails(orderItem)}
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

                {orderItem.status === "accepted" && handleCreateBasedOn && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleCreateBasedOn(orderItem)}
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

                {orderItem.status === "Pending Confirmation" && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEditOrder(orderItem)}
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
  );
};

export default OrdersMobileList;
