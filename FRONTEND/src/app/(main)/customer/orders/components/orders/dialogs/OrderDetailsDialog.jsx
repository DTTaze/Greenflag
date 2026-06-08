import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const OrderDetailsDialog = ({
  open,
  onClose,
  order,
  handleConfirmOrder,
  handleCancelOrder,
  handleOpenEditBuyerInfo,
  handleCreateBasedOn,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (!order) return null;

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Custom Timeline Component with improved styling
  const TimelineEvent = ({ date, status, icon: Icon, isLast }) => (
    <Box sx={{ display: "flex", mb: isLast ? 0 : 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mr: 2,
        }}
      >
        <Avatar
          sx={{
            width: 35,
            height: 35,
            bgcolor: "var(--primary-green)",
            color: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Icon fontSize="small" />
        </Avatar>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              height: "100%",
              bgcolor: "var(--primary-green)",
              my: 1,
              opacity: 0.5,
            }}
          />
        )}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {formatDate(date)}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {status}
        </Typography>
      </Box>
    </Box>
  );

  // Section Title Component
  const SectionTitle = ({ title }) => (
    <Typography
      variant="h6"
      gutterBottom
      color="var(--primary-green)"
      sx={{
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        "&::before": {
          content: '""',
          width: 4,
          height: 24,
          backgroundColor: "var(--primary-green)",
          marginRight: 1,
          borderRadius: 1,
        },
      }}
    >
      {title}
    </Typography>
  );

  // Info Row Component
  const InfoRow = ({ label, value, fullWidth = false }) => (
    <Grid item xs={12} sm={fullWidth ? 12 : 6}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {value || "N/A"}
        </Typography>
      </Box>
    </Grid>
  );

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
          <CloseIcon />
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
            <>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <SectionTitle title="Transaction Information" />
                  <Grid container spacing={2}>
                    <InfoRow label="Transaction ID" value={order.public_id} />
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Status
                      </Typography>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "pending"
                            ? "warning"
                            : order.status === "accepted"
                            ? "success"
                            : order.status === "rejected"
                            ? "error"
                            : "default"
                        }
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Grid>
                    <InfoRow
                      label="Created Date"
                      value={formatDate(order.created_at)}
                    />
                    <InfoRow
                      label="Last Updated"
                      value={formatDate(order.updated_at)}
                    />
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <SectionTitle title="Product Information" />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Product Name
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Quantity
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Price
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {order.item_snapshot?.name || "N/A"}
                          </TableCell>
                          <TableCell align="right">{order.quantity}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(order.item_snapshot?.price || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(order.total_price || 0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {order.receiver_information && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <SectionTitle title="Buyer Information" />
                    <Grid container spacing={2}>
                      <InfoRow
                        label="Name"
                        value={order.receiver_information.to_name}
                      />
                      <InfoRow
                        label="Contact"
                        value={order.receiver_information.to_phone}
                      />
                      <InfoRow
                        label="Shipping Address"
                        value={`${order.receiver_information.to_address}, ${order.receiver_information.to_ward_name}, ${order.receiver_information.to_district_name}, ${order.receiver_information.to_province_name}`}
                        fullWidth
                      />
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <SectionTitle title="Order Information" />
                  <Grid container spacing={2}>
                    <InfoRow
                      label="Order Code"
                      value={order.data?.order_code || order.order_code}
                    />
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Status
                      </Typography>
                      <Chip
                        label={order.data?.status || order.status}
                        color={
                          order.data?.status === "ready_to_pick" ||
                          order.status === "ready_to_pick"
                            ? "info"
                            : order.data?.status === "picking" ||
                              order.status === "picking"
                            ? "warning"
                            : order.data?.status === "delivered" ||
                              order.status === "delivered"
                            ? "success"
                            : order.data?.status === "cancel" ||
                              order.status === "cancel"
                            ? "error"
                            : "default"
                        }
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Grid>
                    <InfoRow
                      label="Created Date"
                      value={formatDate(
                        order.data?.created_date || order.created_at
                      )}
                    />
                    <InfoRow
                      label="Last Updated"
                      value={formatDate(
                        order.data?.updated_date || order.updated_at
                      )}
                    />
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <SectionTitle title="Package Information" />
                  <Grid container spacing={2}>
                    <InfoRow
                      label="Weight"
                      value={`${order.data?.weight || order.weight || 0}g`}
                    />
                    <InfoRow
                      label="Dimensions"
                      value={`${order.data?.length || order.length || 0} x ${
                        order.data?.width || order.width || 0
                      } x ${order.data?.height || order.height || 0} cm`}
                    />
                    <InfoRow
                      label="COD Amount"
                      value={formatCurrency(
                        order.data?.cod_amount || order.cod_amount
                      )}
                    />
                    <InfoRow
                      label="Insurance Value"
                      value={formatCurrency(
                        order.data?.insurance_value || order.insurance_value
                      )}
                    />
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <SectionTitle title="Sender Information" />
                  <Grid container spacing={2}>
                    <InfoRow
                      label="Name"
                      value={order.data?.from_name || order.from_name}
                    />
                    <InfoRow
                      label="Phone"
                      value={order.data?.from_phone || order.from_phone}
                    />
                    <InfoRow
                      label="Address"
                      value={order.data?.from_address || order.from_address}
                      fullWidth
                    />
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <SectionTitle title="Receiver Information" />
                  <Grid container spacing={2}>
                    <InfoRow
                      label="Name"
                      value={order.data?.to_name || order.to_name}
                    />
                    <InfoRow
                      label="Phone"
                      value={order.data?.to_phone || order.to_phone}
                    />
                    <InfoRow
                      label="Address"
                      value={order.data?.to_address || order.to_address}
                      fullWidth
                    />
                  </Grid>
                </Paper>
              </Grid>

              {order.timeline && order.timeline.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <SectionTitle title="Order Timeline" />
                    <Box sx={{ mt: 2 }}>
                      {order.timeline.map((event, index) => (
                        <TimelineEvent
                          key={index}
                          date={event.time}
                          status={event.status}
                          icon={LocalShippingIcon}
                          isLast={index === order.timeline.length - 1}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}

              {order.locationHistory && order.locationHistory.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <SectionTitle title="Location History" />
                    <Box sx={{ mt: 2 }}>
                      {order.locationHistory.map((location, index) => (
                        <TimelineEvent
                          key={index}
                          date={location.time}
                          status={`${location.location} - ${location.status}`}
                          icon={LocationOnIcon}
                          isLast={index === order.locationHistory.length - 1}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}
            </>
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
              startIcon={<CheckCircleIcon />}
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
              startIcon={<CancelIcon />}
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
            startIcon={<ContentCopyIcon />}
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
