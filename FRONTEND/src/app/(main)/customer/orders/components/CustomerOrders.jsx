import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CheckCircle, Copy, Eye, Plus, Search, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Import mock data and utilities
import {
  mockOrders,
  wasteCategories,
  wasteTypesMap,
} from "@/src/data/ordersMockData";
import {
  cancelShippingOrderApi,
  createDeliveryOrderFromTransactionApi,
  createShippingAccountApi,
  createShippingOrderApi,
  deleteShippingAccountApi,
  getAllShippingOrdersByBuyerApi,
  getAllShippingOrdersBySellerApi,
  getSellerTransactionHistory,
  getShippingAccountsByUserApi,
  getShippingOrderDetailApi,
  getTransactionByIdApi,
  setDefaultShippingAccountApi,
  transactionMakeDicisionApi,
  updateShippingAccountApi,
  updateShippingOrderApi,
} from "@/src/utils/api";

import OrderDetailsDialog from "./orders/dialogs/OrderDetailsDialog";
import EmptyOrderState from "./orders/EmptyOrderState";
import AddShippingAccountForm from "./orders/forms/AddShippingAccountForm";
import CreateOrderForm from "./orders/forms/CreateOrderForm";
// Import extracted components
import OrdersList from "./orders/OrdersList";
import ShippingAccountsList from "./orders/ShippingAccountsList";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Pending Confirmation":
      return "info";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const emptyShippingAccountForm = {
  name: "",
  shop_id: "",
  token: "",
  carrier: "",
  is_default: false,
};

// Add this TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Add this TransactionOrdersList component
function TransactionOrdersList({
  transactions,
  handleCreateOrderFromTransaction,
  handleViewDetails,
  handleEditOrder,
  handleConfirmOrder,
  handleCancelOrder,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter transactions by search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.public_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.item_snapshot?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.buyer?.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const renderActionButtons = (transaction) => {
    switch (transaction.status) {
      case "pending":
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(transaction)}
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
              <Eye size={16} />
            </Button>
            {transaction.status !== "rejected" && (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleConfirmOrder(transaction.id)}
                sx={{
                  minWidth: 0,
                  p: "4px 8px",
                  bgcolor: "var(--primary-green)",
                  "&:hover": { bgcolor: "var(--dark-green)" },
                }}
              >
                <CheckCircle size={16} />
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleCancelOrder(transaction.id)}
              sx={{
                minWidth: 0,
                p: "4px 8px",
              }}
            >
              <XCircle size={16} />
            </Button>
          </Box>
        );
      case "accepted":
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(transaction)}
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
              <Eye size={16} />
            </Button>
            <Tooltip title="Create new order based on this transaction">
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleCreateOrderFromTransaction(transaction)}
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
          </Box>
        );
      case "rejected":
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(transaction)}
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
              <Eye size={16} />
            </Button>
            {transaction.status !== "rejected" && (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleConfirmOrder(transaction.id)}
                sx={{
                  minWidth: 0,
                  p: "4px 8px",
                  bgcolor: "var(--primary-green)",
                  "&:hover": { bgcolor: "var(--dark-green)" },
                }}
              >
                <CheckCircle size={16} />
              </Button>
            )}
          </Box>
        );
      case "cancelled":
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(transaction)}
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
              <Eye size={16} />
            </Button>
          </Box>
        );
      default:
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(transaction)}
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
              <Eye size={16} />
            </Button>
          </Box>
        );
    }
  };

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <TextField
          placeholder="Search purchase requests..."
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

      {filteredTransactions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No transactions found.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.public_id}</TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {transaction.buyer
                        ? transaction.buyer.full_name ||
                          transaction.buyer.username
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      {transaction.item_snapshot?.name || "Unknown Product"}
                    </TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(transaction.total_price)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        color={
                          transaction.status === "pending"
                            ? "warning"
                            : transaction.status === "accepted"
                              ? "success"
                              : transaction.status === "rejected"
                                ? "error"
                                : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{renderActionButtons(transaction)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default function CustomerOrders() {
  const userInfo = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [shippingAccountsDialogOpen, setShippingAccountsDialogOpen] =
    useState(false);
  const [addShippingAccountDialogOpen, setAddShippingAccountDialogOpen] =
    useState(false);
  const [buyerInfoDialogOpen, setBuyerInfoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedShippingAccount, setSelectedShippingAccount] = useState(null);
  const [isEditingShippingAccount, setIsEditingShippingAccount] =
    useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isCreatingBasedOn, setIsCreatingBasedOn] = useState(false);
  const initialOrderPayload = {
    payment_type_id: 2,
    note: "",
    required_note: "KHONGCHOXEMHANG",
    return_phone: "",
    return_address: "",
    return_district_id: null,
    return_ward_code: "",
    client_order_code: "",
    from_name: "",
    from_phone: "",
    from_address: "",
    from_ward_name: "",
    from_district_name: "",
    from_province_name: "",
    to_name: "",
    to_phone: "",
    to_address: "",
    to_ward_name: "",
    to_district_name: "",
    to_province_name: "",
    cod_amount: 0,
    content: "",
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    cod_failed_amount: 0,
    pick_station_id: null,
    deliver_station_id: null,
    insurance_value: 0,
    service_type_id: 2,
    coupon: null,
    pickup_time: null,
    pick_shift: [],
    items: [
      {
        name: "",
        code: "",
        quantity: 0,
        price: 0,
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        category: {
          level1: "",
        },
      },
    ],
  };

  const [newOrder, setNewOrder] = useState(initialOrderPayload);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [newShippingAccount, setNewShippingAccount] = useState(
    emptyShippingAccountForm,
  );
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [shippingAccounts, setShippingAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch shipping accounts on component mount
  useEffect(() => {
    fetchShippingAccounts();
    fetchOrders();
    fetchTransactions();
  }, []);

  const fetchShippingAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      setErrorMessage("");

      const response = await getShippingAccountsByUserApi();
      console.log("check newShippingAccount", response);
      if (response.status === 200) {
        setShippingAccounts(response.data);
        setIsLoadingAccounts(false);
      }
    } catch (error) {
      console.error("Error fetching shipping accounts:", error);
      setErrorMessage("Failed to load shipping accounts. Please try again.");
      setIsLoadingAccounts(false);
    }
  };

  // Fetch orders on component mount
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setErrorMessage("");

      const response = await getAllShippingOrdersBySellerApi();
      console.log("Orders from API:", response.data);
      if (response && response.data) {
        // Map the API response to the format our component expects
        const formattedOrders = response.data.map((order) => {
          // Map GHN status codes to UI-friendly status
          let status;
          switch (order.status) {
            case "ready_to_pick":
              status = "ready_to_pick";
              break;
            case "picking":
            case "storing":
            case "transporting":
              status = "delivering";
              break;
            case "delivered":
              status = "delivered";
              break;
            case "cancel":
              status = "cancel";
              break;
            default:
              status = "Pending Confirmation";
          }

          // Format date from ISO to local date format
          const formattedDate = new Date(
            order.created_date,
          ).toLocaleDateString();

          // Create a dummy items array (since GHN doesn't provide item details in the orders list)
          const dummyItems = [
            {
              type: "Package",
              quantity: 1,
              unit: "pkg",
              weight: order.weight ? `${order.weight}g` : "N/A",
            },
          ];

          return {
            id: order.id,
            orderCode: order.order_code,
            date: formattedDate,
            to_name: order.to_name,
            to_phone: order.to_phone,
            to_address: order.to_address,
            status: status,
            items: dummyItems,
            codAmount: order.cod_amount,
            shippingFee: order.total_amount - order.cod_amount,
            totalAmount: order.total_amount,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            // Add timeline and location history for the order tracking view
            timeline: [
              {
                time: new Date(order.created_date).toLocaleString(),
                status: "Order Created",
              },
              {
                time: new Date(order.updated_at).toLocaleString(),
                status: `Status: ${status}`,
              },
            ],
            locationHistory: [
              {
                time: new Date(order.created_date).toLocaleString(),
                location: "Sender Address",
                status: "Order Created",
              },
            ],
            // Additional fields
            points: 0, // No points in GHN, but UI requires it
            collectorName: "GHN Delivery",
            collectorContact: "1900 636 677",
          };
        });

        setOrders(formattedOrders);
      }
      setIsLoadingOrders(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage("Failed to load orders. Please try again.");
      setIsLoadingOrders(false);
    }
  };

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      setErrorMessage("");

      const response = await getSellerTransactionHistory();
      console.log("check get by seller", response);
      if (response && response.data) {
        // Filter only pending transactions
        const pendingTransactions = response.data;
        // const pendingTransactions = response.data.filter(
        //   (transaction) => transaction.status === "pending"
        // );
        setTransactions(pendingTransactions);
      }
      setIsLoadingTransactions(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setErrorMessage("Failed to load purchase requests. Please try again.");
      setIsLoadingTransactions(false);
    }
  };

  // Function to validate if user has linked shipping accounts
  const hasLinkedShippingAccounts = () => {
    return shippingAccounts.length > 0;
  };

  // Function to show alert
  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setConfirmAlertOpen(true);
    setTimeout(() => setConfirmAlertOpen(false), 3000);
  };

  const resetShippingAccountForm = () => {
    setNewShippingAccount(emptyShippingAccountForm);
  };

  const handleCreateOrder = async () => {
    if (!hasLinkedShippingAccounts()) {
      showAlert(
        "Please link at least one shipping account before creating orders.",
        "error",
      );
      setCreateDialogOpen(false);
      setShippingAccountsDialogOpen(true);
      return;
    }

    try {
      const selectedAccount = shippingAccounts[0];

      let response;
      if (isCreatingBasedOn && selectedOrder) {
        // If creating based on a transaction, use createDeliveryOrderFromTransactionApi
        response = await createDeliveryOrderFromTransactionApi(
          selectedOrder.id,
          newOrder,
          selectedAccount.token,
          selectedAccount.shop_id,
        );
      } else {
        // Normal order creation
        response = await createShippingOrderApi(
          newOrder,
          selectedAccount.token,
          selectedAccount.shop_id,
        );
      }

      if (response && response.data) {
        setOrders([response.data, ...orders]);
        setCreateDialogOpen(false);
        showAlert("Order created successfully!");
        setNewOrder(initialOrderPayload);
        setIsCreatingBasedOn(false);
        setSelectedOrder(null);
        fetchOrders(); // Refresh orders list
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showAlert("Failed to create order. Please try again.", "error");
    }
  };

  const handleAddShippingAccount = async () => {
    try {
      const accountData = {
        ...newShippingAccount,
        user_id: userInfo.id,
        is_default: shippingAccounts.length === 0,
      };

      const response = await createShippingAccountApi(accountData);

      if (response && response.data) {
        const addedAccount = response.data;
        setShippingAccounts((prev) => [...prev, addedAccount]);
        setAddShippingAccountDialogOpen(false);
        showAlert("Shipping account added successfully!");
        resetShippingAccountForm();
      } else {
        await fetchShippingAccounts();
        setAddShippingAccountDialogOpen(false);
        showAlert("Shipping account added successfully!");
        resetShippingAccountForm();
      }
    } catch (error) {
      console.error("Error adding shipping account:", error);
      let errorMessage = "Failed to add shipping account. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!newShippingAccount.name) {
        errorMessage = "Account name is required";
      } else if (!newShippingAccount.carrier) {
        errorMessage = "Carrier is required";
      } else if (!newShippingAccount.shop_id) {
        errorMessage = "Shop ID is required";
      } else if (!newShippingAccount.token) {
        errorMessage = "Token is required";
      }

      showAlert(errorMessage, "error");
    }
  };

  const handleEditShippingAccount = (account) => {
    setSelectedShippingAccount(account);
    setNewShippingAccount({
      name: account.name,
      shop_id: account.shop_id,
      token: account.token,
      carrier: account.carrier,
    });
    setIsEditingShippingAccount(true);
    setShippingAccountsDialogOpen(false);
    setAddShippingAccountDialogOpen(true);
  };

  const handleUpdateShippingAccount = async () => {
    try {
      const response = await updateShippingAccountApi(
        selectedShippingAccount.id,
        newShippingAccount,
      );

      const updatedAccount = response.data;

      setShippingAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account,
        ),
      );

      setAddShippingAccountDialogOpen(false);
      setIsEditingShippingAccount(false);
      showAlert("Shipping account updated successfully!");
      resetShippingAccountForm();
    } catch (error) {
      console.error("Error updating shipping account:", error);
      showAlert(
        "Failed to update shipping account. Please try again.",
        "error",
      );
    }
  };

  const handleDeleteShippingAccount = async (accountId) => {
    try {
      await deleteShippingAccountApi(accountId);
      const updatedAccounts = shippingAccounts.filter(
        (account) => account.id !== accountId,
      );

      if (
        shippingAccounts.find((acc) => acc.id === accountId)?.is_default &&
        updatedAccounts.length > 0
      ) {
        updatedAccounts[0].is_default = true;
        await setDefaultShippingAccountApi(updatedAccounts[0].id);
      }

      setShippingAccounts(updatedAccounts);
      showAlert("Shipping account removed successfully!");
    } catch (error) {
      console.error("Error deleting shipping account:", error);
      showAlert(
        "Failed to delete shipping account. Please try again.",
        "error",
      );
    }
  };

  const handleSetDefaultShippingAccount = async (accountId) => {
    try {
      const response = await setDefaultShippingAccountApi(accountId);
      const updatedAccount = response.data;
      setShippingAccounts((prev) =>
        prev.map((account) =>
          account.id === updatedAccount.id
            ? { ...updatedAccount, is_default: true }
            : { ...account, is_default: false },
        ),
      );
      showAlert("Default shipping account updated!");
    } catch (error) {
      console.error("Error setting default shipping account:", error);
      showAlert(
        "Failed to update default shipping account. Please try again.",
        "error",
      );
    }
  };

  const calculatePoints = (items) => {
    // Calculate based on the new type IDs
    let total = 0;
    items.forEach((item) => {
      total += (wasteTypesMap[item.type] || 5) * item.quantity;
    });
    return total;
  };

  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { type: "", quantity: 1, unit: "kg" }],
    });
  };

  const handleRemoveItem = (index) => {
    const items = [...newOrder.items];
    items.splice(index, 1);
    setNewOrder({ ...newOrder, items });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...newOrder.items];
    items[index][field] = value;
    setNewOrder({ ...newOrder, items });
  };

  const handleOpenEditBuyerInfo = (order) => {
    setSelectedOrder(order);
    setBuyerInfo({
      name: order.buyerName || "",
      phone: order.buyerPhone || "",
      email: order.buyerEmail || "",
      notes: order.notes || "",
    });
    setBuyerInfoDialogOpen(true);
  };

  const handleUpdateBuyerInfo = async () => {
    try {
      if (!selectedOrder) {
        throw new Error("No order selected");
      }

      // Find the shipping account (in a real app, this would be associated with the order)
      const shippingAccount =
        shippingAccounts.find((account) => account.is_default) ||
        shippingAccounts[0];

      if (!shippingAccount) {
        throw new Error("No shipping account found to update this order");
      }

      // Prepare GHN update data
      const updateData = {
        order_code: selectedOrder.orderCode,
        to_name: buyerInfo.name || selectedOrder.to_name,
        to_phone: buyerInfo.phone || selectedOrder.to_phone,
        note: buyerInfo.notes || selectedOrder.notes,
      };

      // Call the GHN API to update the order
      await updateShippingOrderApi({
        orderData: updateData,
        token: shippingAccount.token,
        shopId: shippingAccount.shop_id,
      });

      // Update our local state
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            to_name: buyerInfo.name || order.to_name,
            to_phone: buyerInfo.phone || order.to_phone,
            notes: buyerInfo.notes || order.notes,
            timeline: [
              ...order.timeline,
              {
                time: new Date().toLocaleString(),
                status: "Buyer Information Updated",
              },
            ],
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setBuyerInfoDialogOpen(false);
      showAlert("Buyer information updated successfully!");

      // Refresh orders to get updated data
      fetchOrders();
    } catch (error) {
      console.error("Error updating buyer information:", error);
      showAlert(
        "Failed to update buyer information. Please try again.",
        "error",
      );
    }
  };

  const handleViewDetails = async (transaction) => {
    try {
      const response = await getTransactionByIdApi(transaction.id);
      if (response && response.data) {
        const transactionDetails = {
          ...response.data,
          timeline: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              status: "Transaction Created",
            },
            {
              time: new Date(response.data.updated_at).toLocaleString(),
              status: `Status: ${response.data.status}`,
            },
          ],
          locationHistory: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              location: "Transaction Created",
              status: response.data.status,
            },
          ],
        };
        setSelectedOrder(transactionDetails);
        setTimeout(() => {
          setDetailsDialogOpen(true);
        }, 10);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      showAlert(
        "Failed to load transaction details. Please try again.",
        "error",
      );
    }
  };

  const handleViewOrderDetails = async (transaction) => {
    try {
      const selectedAccount =
        shippingAccounts.find((acc) => acc.is_default === true) ||
        shippingAccounts[0];

      const response = await getShippingOrderDetailApi(
        transaction.orderCode,
        selectedAccount.token,
        selectedAccount.shop_id,
      );
      if (response && response.data) {
        const transactionDetails = {
          ...response.data,
          timeline: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              status: "Transaction Created",
            },
            {
              time: new Date(response.data.updated_at).toLocaleString(),
              status: `Status: ${response.data.status}`,
            },
          ],
          locationHistory: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              location: "Transaction Created",
              status: response.data.status,
            },
          ],
        };
        setSelectedOrder(transactionDetails);
        setTimeout(() => {
          setDetailsDialogOpen(true);
        }, 10);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      showAlert(
        "Failed to load transaction details. Please try again.",
        "error",
      );
    }
  };

  const handleCancelOrder = async (transactionId) => {
    try {
      const response = await transactionMakeDicisionApi(
        transactionId,
        "rejected",
      );
      if (response && response.data) {
        showAlert("Transaction has been rejected successfully!");
        fetchTransactions(); // Refresh the transactions list
      }
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      showAlert("Failed to reject transaction. Please try again.", "error");
    }
  };

  const handleConfirmOrder = async (transactionId) => {
    try {
      const response = await transactionMakeDicisionApi(
        transactionId,
        "accepted",
      );
      if (response && response.data) {
        showAlert("Transaction has been accepted successfully!");
        fetchTransactions(); // Refresh the transactions list
      }
    } catch (error) {
      console.error("Error accepting transaction:", error);
      showAlert("Failed to accept transaction. Please try again.", "error");
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter orders by status for each tab
  const pendingTransactions = transactions; // Show all transactions, not just pending ones
  const readyToPick = orders.filter(
    (order) => order.status === "ready_to_pick",
  );
  const confirmedOrders = orders.filter(
    (order) => order.status === "delivering",
  );
  const completedOrders = orders.filter(
    (order) => order.status === "delivered",
  );
  const cancelledOrders = orders.filter((order) => order.status === "cancel");

  const handleCreateBasedOn = (order) => {
    // Create a new order based on the selected order
    setIsCreatingBasedOn(true);

    // Copy the relevant data from the existing order to the new order form
    const basedOnOrder = {
      from_phone: order.from_phone || "",
      from_address: order.from_address || "",
      to_phone: order.to_phone || "",
      to_address: order.to_address || "",
      to_name: order.to_name || "",
      to_district_name: order.to_district_name || "",
      to_ward_name: order.to_ward_name || "",
      productName: order.productName || "Áo Polo",
      weight: order.weight || null,
      productQuantity: order.productQuantity || "1",
      productCode: order.productCode || "Polo123",
      length: order.length || null,
      width: order.width || null,
      height: order.height || "10",
      packageVolumeWeight: order.packageVolumeWeight || "76",
      codAmount: order.codAmount || "200000",
      totalValue: order.totalValue || "100000",
      cashOnDeliveryFailure: order.cashOnDeliveryFailure || false,
      failureCharge: order.failureCharge || "0",
      customerOrderCode: "", // New order should have a new code
      deliveryNote: order.deliveryNote || "no_view",
      notes: order.notes || "Tintest 123",
      servicePackage: order.servicePackage || "light",
      pickupOption: order.pickupOption || "pickup",
      pickupLocation: order.pickupLocation || "",
      packages: order.packages || [],
      paymentParty: order.paymentParty || "receiver",
      promotionCode: "",
    };

    setNewOrder(basedOnOrder);
    setCreateDialogOpen(true);
  };

  const handleEditOrder = (order) => {
    setIsEditingOrder(true);
    setSelectedOrder(order);

    // Copy all data from the existing order to the form
    const editableOrder = {
      ...order,
      from_phone: order.from_phone || "",
      from_address: order.from_address || "",
      to_phone: order.to_phone || "",
      to_address: order.to_address || "",
      to_name: order.to_name || "",
      to_district_name: order.to_district_name || "",
      to_ward_name: order.to_ward_name || "",
      productName: order.productName || "",
      weight: order.weight || null,
      productQuantity: order.productQuantity || "",
      productCode: order.productCode || "",
      length: order.length || null,
      width: order.width || null,
      height: order.height || null,
      packageVolumeWeight: order.packageVolumeWeight || "76",
      codAmount: order.codAmount || "0",
      totalValue: order.totalValue || "0",
      cashOnDeliveryFailure: order.cashOnDeliveryFailure || false,
      failureCharge: order.failureCharge || "0",
      customerOrderCode: order.orderCode || "",
      deliveryNote: order.deliveryNote || "no_view",
      notes: order.notes || "",
      servicePackage: order.servicePackage || "light",
      pickupOption: order.pickupOption || "pickup",
      pickupLocation: order.pickupLocation || "",
      packages: order.packages || [],
      paymentParty: order.paymentParty || "receiver",
      promotionCode: order.promotionCode || "",
    };

    setNewOrder(editableOrder);
    setCreateDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    try {
      // Find shipping account (in a real app would be stored with the order)
      const shippingAccount =
        shippingAccounts.find((account) => account.is_default) ||
        shippingAccounts[0];

      if (!shippingAccount) {
        throw new Error("No shipping account found to update this order");
      }

      // Prepare update data
      const updateData = {
        order_code: selectedOrder.orderCode,
        to_name: newOrder.to_name || selectedOrder.to_name,
        to_phone: newOrder.to_phone || selectedOrder.to_phone,
        to_address: newOrder.to_address || selectedOrder.to_address,
        // to_ward_code: newOrder.to_ward_name || selectedOrder.to_ward_name,
        to_district_id:
          parseInt(newOrder.to_district_name) ||
          parseInt(selectedOrder.to_district_name),
        content: newOrder.content,
        weight: parseInt(newOrder.weight) || 200,
        length: parseInt(newOrder.length) || 10,
        width: parseInt(newOrder.width) || 10,
        height: parseInt(newOrder.height) || 10,
        cod_amount: parseInt(newOrder.cod_amount) || 0,
        note: newOrder.note,
      };

      // Call the API to update the order
      await updateShippingOrderApi({
        orderData: updateData,
        token: shippingAccount.token,
        shopId: shippingAccount.shop_id,
      });

      showAlert("Order updated successfully!");
      setCreateDialogOpen(false);
      setIsEditingOrder(false);

      // Refresh orders to get updated data
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      showAlert("Failed to update order. Please try again.", "error");
    }
  };

  // Function to handle creating order from transaction
  const handleCreateOrderFromTransaction = async (transaction) => {
    try {
      const response = await getTransactionByIdApi(transaction.id);

      if (response && response.data) {
        const transactionDetails = response.data;

        // Prepare order data based on transaction details
        const orderData = {
          payment_type_id: 2,
          required_note: "KHONGCHOXEMHANG",
          weight: transactionDetails.item.weight || 200, // Default weight in grams
          transaction_id: transactionDetails.id,
          to_name: transactionDetails.receiver_information?.to_name,
          to_phone: transactionDetails.receiver_information?.to_phone,
          to_address: transactionDetails.receiver_information?.to_address,
          to_ward_name: transactionDetails.receiver_information?.to_ward_name,
          to_district_name:
            transactionDetails.receiver_information?.to_district_name,
          to_province_name:
            transactionDetails.receiver_information?.to_province_name,

          content: transactionDetails.item_snapshot?.name,
          cod_amount: transactionDetails.total_price,

          length: transactionDetails.item.length || 10,
          width: transactionDetails.item.width || 10,
          height: transactionDetails.item.height || 10,

          items: [
            {
              code: transactionDetails.public_id,
              name: transactionDetails.item.name,
              quantity: transactionDetails.quantity,
              price:
                transactionDetails.total_price / transactionDetails.quantity,
              length: transactionDetails.item.length || 10,
              width: transactionDetails.item.width || 10,
              height: transactionDetails.item.height || 10,
              weight: transactionDetails.item.weight || 200,
            },
          ],
          // Add any other necessary fields
        };

        setSelectedOrder(transactionDetails);
        setNewOrder(orderData);
        setIsCreatingBasedOn(true);
        setCreateDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      showAlert(
        "Failed to load transaction details. Please try again.",
        "error",
      );
    }
  };

  return (
    <Box>
      {confirmAlertOpen && (
        <Alert
          severity={alertSeverity}
          sx={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            backgroundColor:
              alertSeverity === "success" ? "var(--light-green)" : "#FFF3E0",
            color:
              alertSeverity === "success" ? "var(--primary-green)" : "#E65100",
            border: `1px solid ${
              alertSeverity === "success" ? "var(--primary-green)" : "#FB8C00"
            }`,
          }}
          onClose={() => setConfirmAlertOpen(false)}
        >
          {alertMessage}
        </Alert>
      )}

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

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {isLoadingOrders && isLoadingTransactions ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress color="success" />
        </Box>
      ) : orders.length === 0 && transactions.length === 0 ? (
        <EmptyOrderState
          hasLinkedShippingAccounts={hasLinkedShippingAccounts()}
          handleOpenCreateDialog={() => setCreateDialogOpen(true)}
          handleOpenShippingAccountsDialog={() =>
            setShippingAccountsDialogOpen(true)
          }
        />
      ) : (
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
                label={`Pending Orders (${pendingTransactions.length})`}
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
              transactions={pendingTransactions}
              handleCreateOrderFromTransaction={
                handleCreateOrderFromTransaction
              }
              handleViewDetails={handleViewDetails}
              handleEditOrder={handleEditOrder}
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
      )}

      {/* Shipping Accounts Dialog */}
      <Dialog
        open={shippingAccountsDialogOpen}
        onClose={() => setShippingAccountsDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        {isLoadingAccounts ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress color="success" />
            <Typography sx={{ mt: 2 }}>Loading shipping accounts...</Typography>
          </Box>
        ) : (
          <ShippingAccountsList
            shippingAccounts={shippingAccounts}
            handleSetDefaultShippingAccount={handleSetDefaultShippingAccount}
            handleEditShippingAccount={handleEditShippingAccount}
            handleDeleteShippingAccount={handleDeleteShippingAccount}
            handleOpenAddDialog={() => {
              setShippingAccountsDialogOpen(false);
              setIsEditingShippingAccount(false);
              resetShippingAccountForm();
              setAddShippingAccountDialogOpen(true);
            }}
            handleCloseDialog={() => setShippingAccountsDialogOpen(false)}
          />
        )}
      </Dialog>

      {/* Add/Edit Shipping Account Dialog */}
      <Dialog
        open={addShippingAccountDialogOpen}
        onClose={() => {
          setAddShippingAccountDialogOpen(false);
          if (isEditingShippingAccount) {
            setShippingAccountsDialogOpen(true);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <AddShippingAccountForm
          newShippingAccount={newShippingAccount}
          setNewShippingAccount={setNewShippingAccount}
          handleAddShippingAccount={handleAddShippingAccount}
          handleUpdateShippingAccount={handleUpdateShippingAccount}
          handleCloseDialog={() => setAddShippingAccountDialogOpen(false)}
          handleOpenManageDialog={() => setShippingAccountsDialogOpen(true)}
          isEditing={isEditingShippingAccount}
          resetForm={resetShippingAccountForm}
        />
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setIsEditingOrder(false);
          setIsCreatingBasedOn(false);
          setNewOrder(initialOrderPayload);
        }}
        fullWidth
        maxWidth="md"
      >
        <CreateOrderForm
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleCreateOrder={
            isEditingOrder ? handleUpdateOrder : handleCreateOrder
          }
          handleCloseDialog={() => {
            setCreateDialogOpen(false);
            setIsEditingOrder(false);
            setIsCreatingBasedOn(false);
          }}
          calculatePoints={calculatePoints}
          shippingAccounts={shippingAccounts}
          wasteCategories={wasteCategories}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
          isEditMode={isEditingOrder}
          isBasedOnMode={isCreatingBasedOn}
        />
      </Dialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          order={selectedOrder}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
        />
      )}

      {/* Edit Buyer Information Dialog */}
      <Dialog
        open={buyerInfoDialogOpen}
        onClose={() => setBuyerInfoDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
        >
          Update Buyer Information
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Buyer Name"
                fullWidth
                value={buyerInfo.name}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, name: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={buyerInfo.phone}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, phone: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={buyerInfo.email}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, email: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional Notes"
                fullWidth
                multiline
                rows={3}
                value={buyerInfo.notes}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, notes: e.target.value })
                }
                margin="normal"
                placeholder="Special instructions or requests"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setBuyerInfoDialogOpen(false)}
            className="customer-button-secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateBuyerInfo} className="customer-button">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
