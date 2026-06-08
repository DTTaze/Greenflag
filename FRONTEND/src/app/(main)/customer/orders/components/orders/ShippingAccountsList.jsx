import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Grid,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ShippingAccountsList = ({
  shippingAccounts,
  handleSetDefaultShippingAccount,
  handleEditShippingAccount,
  handleDeleteShippingAccount,
  handleOpenAddDialog,
  handleCloseDialog,
}) => {
  return (
    <>
      <DialogTitle
        sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
      >
        Manage Shipping Accounts
      </DialogTitle>
      <DialogContent dividers>
        {shippingAccounts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              No shipping accounts linked yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Link a shipping account to start creating recycling orders
            </Typography>
            <Button
              variant="contained"
              className="customer-button"
              onClick={() => {
                handleCloseDialog();
                handleOpenAddDialog();
              }}
              startIcon={<AddIcon />}
            >
              Add Shipping Account
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Your Linked Shipping Accounts
              </Typography>
              <Button
                variant="contained"
                className="customer-button"
                onClick={() => {
                  handleCloseDialog();
                  handleOpenAddDialog();
                }}
                startIcon={<AddIcon />}
                size="small"
              >
                Add Account
              </Button>
            </Box>

            <Grid container spacing={2}>
              {shippingAccounts.map((account) => (
                <Grid item xs={12} md={6} key={account.id}>
                  <Card
                    sx={{
                      border: account.is_default
                        ? "2px solid var(--primary-green)"
                        : "1px solid var(--grey-300)",
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    {account.is_default && (
                      <Chip
                        label="Default"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: 20,
                          backgroundColor: "var(--primary-green)",
                        }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {account.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Đơn vị vận chuyển:{" "}
                        {account.carrier == "ghn"
                          ? "Giao Hàng Nhanh"
                          : account.carrier == "grab"
                          ? "Grab Hỏa Tốc"
                          : "Giao Hàng Tiết Kiệm"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Token API: {account.token}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Shop ID: {account.shop_id}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                          gap: 1,
                        }}
                      >
                        {!account.is_default && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleSetDefaultShippingAccount(account.id)
                            }
                            sx={{
                              borderColor: "var(--primary-green)",
                              color: "var(--primary-green)",
                            }}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEditShippingAccount(account)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleDeleteShippingAccount(account.id)
                          }
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleCloseDialog}
          className="customer-button-secondary"
        >
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default ShippingAccountsList;
