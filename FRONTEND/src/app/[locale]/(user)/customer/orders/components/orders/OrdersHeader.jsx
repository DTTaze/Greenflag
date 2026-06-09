import { Box, Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import React from "react";

const OrdersHeader = ({
  hasLinkedShippingAccounts,
  setShippingAccountsDialogOpen,
  setCreateDialogOpen,
  showAlert,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ color: "var(--primary-green)" }}
      >
        Your Orders
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          className="customer-button-secondary"
          onClick={() => setShippingAccountsDialogOpen(true)}
          sx={{
            borderColor: "var(--primary-green)",
            color: "var(--primary-green)",
          }}
        >
          Shipping Accounts
        </Button>
        <Button
          variant="contained"
          className="customer-button"
          onClick={() => {
            if (!hasLinkedShippingAccounts()) {
              showAlert(
                "Please link at least one shipping account before creating orders.",
                "error",
              );
              setShippingAccountsDialogOpen(true);
            } else {
              setCreateDialogOpen(true);
            }
          }}
          startIcon={<Plus size={20} />}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          New Order
        </Button>
      </Box>
    </Box>
  );
};

export default OrdersHeader;
