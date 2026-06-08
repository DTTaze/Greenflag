import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CheckCircle, Copy, X, XCircle } from "lucide-react";
import React from "react";

import PendingOrderContent from "./PendingOrderContent";
import ShippingOrderContent from "./ShippingOrderContent";

const OrderDetailsDialog = ({
  open,
  onClose,
  order,
  handleConfirmOrder,
  handleCancelOrder,
  handleCreateBasedOn,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (!order) return null;

  const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
  const isPendingOrder = validStatuses.includes(order.status);

  const handleCopy = () => {
    const ensureValue = (value, defaultValue = "") => {
      return value === null || value === undefined ? defaultValue : value;
    };
    console.log("ptquanh check");

    const orderData = {
      // Sender Information
      from_phone: ensureValue(order.from_phone),
      from_address: ensureValue(order.from_address),
      from_name: ensureValue(order.from_name),
      from_district_id: ensureValue(order.from_district_id),
      from_ward_code: ensureValue(order.from_ward_code),
      from_district_name: ensureValue(order.from_district_name),
      from_ward_name: ensureValue(order.from_ward_name),
      from_province_name: ensureValue(order.from_province_name),

      // Receiver Information
      to_phone: ensureValue(order.to_phone),
      to_address: ensureValue(order.to_address),
      to_name: ensureValue(order.to_name),
      to_district_id: ensureValue(order.to_district_id),
      to_ward_code: ensureValue(order.to_ward_code),
      to_district_name: ensureValue(order.to_district_name),
      to_ward_name: ensureValue(order.to_ward_name),
      to_province_name: ensureValue(order.to_province_name),

      // Product Information
      productName: ensureValue(order.item_snapshot?.name, "Áo Polo"),
      productCode: ensureValue(order.item_snapshot?.code, "Polo123"),
      productQuantity: ensureValue(order.quantity, 1),

      // Package Information
      weight: ensureValue(order.weight, 200),
      length: ensureValue(order.length, 10),
      width: ensureValue(order.width, 10),
      height: ensureValue(order.height, 10),
      packageVolumeWeight: ensureValue(order.package_volume_weight, 76),

      // Payment Information
      codAmount: ensureValue(order.cod_amount || order.total_price, 200000),
      totalValue: ensureValue(order.total_value, 100000),
      cashOnDeliveryFailure: false,
      failureCharge: ensureValue(order.cod_failed_amount, 0),

      // Order Settings
      payment_type_id: 2,
      required_note: "KHONGCHOXEMHANG",
      service_type_id: 2,
      customerOrderCode: "",
      deliveryNote: "KHONGCHOXEMHANG",
      notes: "Tintest 123",
      servicePackage: "light",
      pickupOption: "pickup",
      pickupLocation: "",
      packages: [],
      paymentParty: "receiver",
      promotionCode: "",

      // Additional fields if needed
      insurance_value: ensureValue(order.insurance_value, 0),
      coupon: "",
      items: [
        {
          name: ensureValue(order.item_snapshot?.name, "Áo Polo"),
          code: ensureValue(order.item_snapshot?.code, "Polo123"),
          quantity: ensureValue(order.quantity, 1),
          price: ensureValue(order.item_snapshot?.price, 0),
          length: ensureValue(order.length, 10),
          width: ensureValue(order.width, 10),
          height: ensureValue(order.height, 10),
          weight: ensureValue(order.weight, 200),
          category: {
            level1: ensureValue(order.item_snapshot?.category?.level1, ""),
          },
        },
      ],
    };

    if (handleCreateBasedOn) {
      handleCreateBasedOn(orderData);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          bgcolor: "#FAFAFA",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "var(--light-green)",
          color: "var(--primary-green)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Order Details
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          size="small"
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 3,
          bgcolor: "#FAFAFA",
          "& .MuiPaper-root": {
            boxShadow: "none",
            border: "1px solid #E0E0E0",
            borderRadius: 2,
          },
        }}
      >
        <Grid container spacing={3}>
          {isPendingOrder ? (
            <PendingOrderContent order={order} />
          ) : (
            <ShippingOrderContent order={order} />
          )}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#FAFAFA",
          borderTop: "1px solid #E0E0E0",
          gap: 1,
        }}
      >
        {order.status === "pending" && (
          <>
            <Button
              onClick={() => handleConfirmOrder(order.id)}
              className="customer-button"
              startIcon={<CheckCircle size={20} />}
              sx={{
                fontWeight: 500,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Accept
            </Button>
            <Button
              onClick={() => handleCancelOrder(order.id)}
              color="error"
              variant="contained"
              startIcon={<XCircle size={20} />}
              sx={{
                fontWeight: 500,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Reject
            </Button>
          </>
        )}

        {order.status === "accepted" && handleCreateBasedOn && (
          <Button
            onClick={handleCopy}
            variant="outlined"
            startIcon={<Copy size={20} />}
            sx={{
              borderColor: "var(--primary-green)",
              color: "var(--primary-green)",
              "&:hover": {
                borderColor: "var(--dark-green)",
                backgroundColor: "rgba(46, 125, 50, 0.08)",
              },
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Create Based On
          </Button>
        )}
        <Button
          onClick={onClose}
          className="customer-button-secondary"
          sx={{
            fontWeight: 500,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
