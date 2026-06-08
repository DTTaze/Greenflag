import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const ShippingOptionsSection = ({ newOrder, updateOrder, isViewMode }) => {
  return (
    <Grid item xs={12}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          bgcolor: "white",
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Thông tin đơn hàng
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <TextField
              label="KL (gram)"
              fullWidth
              required
              disabled={isViewMode}
              type="number"
              value={newOrder.weight || ""}
              onChange={(e) =>
                updateOrder({
                  weight: parseInt(e.target.value) || 0,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Dài (cm)"
              fullWidth
              required
              disabled={isViewMode}
              type="number"
              value={newOrder.length || ""}
              onChange={(e) =>
                updateOrder({
                  length: parseInt(e.target.value) || 0,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Rộng (cm)"
              fullWidth
              required
              disabled={isViewMode}
              type="number"
              value={newOrder.width || ""}
              onChange={(e) =>
                updateOrder({
                  width: parseInt(e.target.value) || 0,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Cao (cm)"
              fullWidth
              required
              disabled={isViewMode}
              type="number"
              value={newOrder.height || ""}
              onChange={(e) =>
                updateOrder({
                  height: parseInt(e.target.value) || 0,
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="KL quy đổi (gram)"
              fullWidth
              disabled
              value={newOrder.packageVolumeWeight || "76"}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Tổng tiền thu hộ (COD)"
              fullWidth
              disabled={isViewMode}
              type="number"
              value={newOrder.cod_amount || newOrder.codAmount || "0"}
              onChange={(e) =>
                updateOrder({
                  cod_amount: parseInt(e.target.value) || 0,
                  codAmount: e.target.value,
                })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Tổng giá trị hàng hóa"
              fullWidth
              disabled={isViewMode}
              type="number"
              value={newOrder.insurance_value || newOrder.totalValue || "0"}
              onChange={(e) =>
                updateOrder({
                  insurance_value: parseInt(e.target.value) || 0,
                  totalValue: e.target.value,
                })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={newOrder.cashOnDeliveryFailure || false}
            disabled={isViewMode}
            onChange={(e) => {
              const isChecked = e.target.checked;
              updateOrder({
                cashOnDeliveryFailure: isChecked,
                cod_failed_amount: isChecked
                  ? newOrder.cod_failed_amount || 0
                  : 0,
              });
            }}
            color="success"
          />
          <Typography>Giao thất bại thu tiền</Typography>
          <TextField
            type="number"
            size="small"
            sx={{ ml: 2, width: "100px" }}
            value={newOrder.cod_failed_amount || newOrder.failureCharge || "0"}
            onChange={(e) =>
              updateOrder({
                cod_failed_amount: parseInt(e.target.value) || 0,
                failureCharge: e.target.value,
              })
            }
            disabled={!newOrder.cashOnDeliveryFailure || isViewMode}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Mã đơn riêng khách hàng"
            fullWidth
            disabled={isViewMode}
            placeholder="Nhập mã đơn riêng khách hàng (nếu có)"
            value={
              newOrder.client_order_code || newOrder.customerOrderCode || ""
            }
            onChange={(e) =>
              updateOrder({
                client_order_code: e.target.value,
                customerOrderCode: e.target.value,
              })
            }
          />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          bgcolor: "white",
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Lưu ý - Ghi chú
        </Typography>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ mt: 2, mb: 1, color: "#f97316" }}
        >
          Lưu ý giao hàng *
        </Typography>

        <RadioGroup
          value={
            newOrder.required_note || newOrder.deliveryNote || "KHONGCHOXEMHANG"
          }
          onChange={(e) => {
            if (isViewMode) return;
            const value = e.target.value;
            let mappedValue = value;

            if (value === "no_view") mappedValue = "KHONGCHOXEMHANG";
            else if (value === "view_no_try")
              mappedValue = "CHOXEMHANGKHONGTHU";
            else if (value === "try") mappedValue = "CHOTHUHANG";

            updateOrder({
              required_note: mappedValue,
              deliveryNote: value,
            });
          }}
        >
          <FormControlLabel
            value="KHONGCHOXEMHANG"
            disabled={isViewMode}
            control={
              <Radio
                sx={{
                  color: "#2e7d32",
                  "&.Mui-checked": { color: "#2e7d32" },
                }}
              />
            }
            label="Không cho xem hàng"
          />
          <FormControlLabel
            value="CHOXEMHANGKHONGTHU"
            disabled={isViewMode}
            control={
              <Radio
                sx={{
                  color: "#2e7d32",
                  "&.Mui-checked": { color: "#2e7d32" },
                }}
              />
            }
            label="Cho xem hàng không cho thử"
          />
          <FormControlLabel
            value="CHOTHUHANG"
            disabled={isViewMode}
            control={
              <Radio
                sx={{
                  color: "#2e7d32",
                  "&.Mui-checked": { color: "#2e7d32" },
                }}
              />
            }
            label="Cho thử hàng"
          />
        </RadioGroup>

        <TextField
          label="Ghi chú"
          fullWidth
          multiline
          disabled={isViewMode}
          rows={3}
          sx={{ mt: 2 }}
          value={newOrder.note || newOrder.notes || ""}
          onChange={(e) =>
            updateOrder({
              note: e.target.value,
              notes: e.target.value,
            })
          }
          placeholder="Thêm ghi chú cho đơn hàng"
        />
      </Paper>
    </Grid>
  );
};

export default ShippingOptionsSection;
