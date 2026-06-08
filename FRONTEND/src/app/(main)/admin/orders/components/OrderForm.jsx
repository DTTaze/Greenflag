import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export default function OrderForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    order_code: "",
    status: "",
    total_fee: "",
    shipping_fee: "",
    service_fee: "",
    insurance_fee: "",
    delivery_time: "",
    required_note: "",
    note: "",
    payment_type_id: 1,
    payment_type_name: "",
    cod_amount: "",
    shipping_order_status: "",
    buyer_name: "",
    buyer_phone: "",
    buyer_address: "",
    seller_name: "",
    seller_phone: "",
    seller_address: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || "",
        order_code: initialData?.order_code || "",
        status: initialData?.status || "",
        total_fee: initialData?.total_fee || "",
        shipping_fee: initialData?.shipping_fee || "",
        service_fee: initialData?.service_fee || "",
        insurance_fee: initialData?.insurance_fee || "",
        delivery_time: initialData?.delivery_time || "",
        required_note: initialData?.required_note || "",
        note: initialData?.note || "",
        payment_type_id: initialData?.payment_type_id || 1,
        payment_type_name: initialData?.payment_type_name || "",
        cod_amount: initialData?.cod_amount || "",
        shipping_order_status: initialData?.shipping_order_status || "",
        buyer_name: initialData?.buyer?.name || "",
        buyer_phone: initialData?.buyer?.phone || "",
        buyer_address: initialData?.buyer?.address || "",
        seller_name: initialData?.seller?.name || "",
        seller_phone: initialData?.seller?.phone || "",
        seller_address: initialData?.seller?.address || "",
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === "add" ? "Thêm đơn hàng mới" : "Chỉnh sửa đơn hàng"}
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Mã đơn hàng"
                name="order_code"
                value={formData.order_code}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="shipping_order_status"
                  value={formData.shipping_order_status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="ready_to_pick">Sẵn sàng lấy hàng</MenuItem>
                  <MenuItem value="picking">Đang lấy hàng</MenuItem>
                  <MenuItem value="picked">Đã lấy hàng</MenuItem>
                  <MenuItem value="delivering">Đang giao hàng</MenuItem>
                  <MenuItem value="delivered">Đã giao hàng</MenuItem>
                  <MenuItem value="delivery_failed">
                    Giao hàng thất bại
                  </MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phí vận chuyển"
                name="shipping_fee"
                value={formData.shipping_fee}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phí dịch vụ"
                name="service_fee"
                value={formData.service_fee}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phí bảo hiểm"
                name="insurance_fee"
                value={formData.insurance_fee}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tổng phí"
                name="total_fee"
                value={formData.total_fee}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin người mua
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tên người mua"
                name="buyer_name"
                value={formData.buyer_name}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Số điện thoại người mua"
                name="buyer_phone"
                value={formData.buyer_phone}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Địa chỉ người mua"
                name="buyer_address"
                value={formData.buyer_address}
                onChange={handleChange}
                fullWidth
                disabled
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin người bán
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tên người bán"
                name="seller_name"
                value={formData.seller_name}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Số điện thoại người bán"
                name="seller_phone"
                value={formData.seller_phone}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Địa chỉ người bán"
                name="seller_address"
                value={formData.seller_address}
                onChange={handleChange}
                fullWidth
                disabled
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Ghi chú"
                name="note"
                value={formData.note}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === "add" ? "Thêm" : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
