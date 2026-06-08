import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import { MapPin, Truck } from "lucide-react";
import React from "react";

import {
  formatCurrency,
  formatDate,
  InfoRow,
  SectionTitle,
  TimelineEvent,
} from "./OrderDetailsHelpers";

const ShippingOrderContent = ({ order }) => {
  return (
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
              value={formatDate(order.data?.created_date || order.created_at)}
            />
            <InfoRow
              label="Last Updated"
              value={formatDate(order.data?.updated_date || order.updated_at)}
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
              value={formatCurrency(order.data?.cod_amount || order.cod_amount)}
            />
            <InfoRow
              label="Insurance Value"
              value={formatCurrency(
                order.data?.insurance_value || order.insurance_value,
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
                  icon={Truck}
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
                  icon={MapPin}
                  isLast={index === order.locationHistory.length - 1}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default ShippingOrderContent;
