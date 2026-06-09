import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { CheckCircle, Copy, Eye, Search, XCircle } from "lucide-react";
import React, { useState } from "react";

const TransactionOrdersList = ({
  transactions,
  handleCreateOrderFromTransaction,
  handleViewDetails,
  handleConfirmOrder,
  handleCancelOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

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

        {transaction.status === "pending" && (
          <>
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
          </>
        )}

        {transaction.status === "accepted" && (
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
        )}
      </Box>
    );
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
};

export default TransactionOrdersList;
