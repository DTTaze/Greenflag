import {
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

import {
  formatCurrency,
  formatDate,
  InfoRow,
  SectionTitle,
} from "./OrderDetailsHelpers";

const PendingOrderContent = ({ order }) => {
  return (
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
                  <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
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
                  <TableCell>{order.item_snapshot?.name || "N/A"}</TableCell>
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
  );
};

export default PendingOrderContent;
