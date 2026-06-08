import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const EmptyOrderState = ({
  hasLinkedShippingAccounts,
  handleOpenCreateDialog,
  handleOpenShippingAccountsDialog,
}) => {
  return (
    <Card className="customer-card">
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "var(--text-light)" }}>
          You don't have any orders yet
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {!hasLinkedShippingAccounts ? (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center" }}
              >
                To start creating orders, you need to link at least one shipping
                account
              </Typography>
              <Button
                variant="contained"
                className="customer-button"
                onClick={handleOpenShippingAccountsDialog}
              >
                Link Shipping Account
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              className="customer-button"
              onClick={handleOpenCreateDialog}
              startIcon={<AddIcon />}
            >
              Create Your First Order
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmptyOrderState;
