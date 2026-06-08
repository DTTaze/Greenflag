import { Box, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import LocationSelect from "./LocationSelect";

const ReceiverFormSection = ({
  newOrder,
  updateOrder,
  isViewMode,
  toProvinceId,
  setToProvinceId,
  toDistrictId,
  setToDistrictId,
  toWardCode,
  setToWardCode,
  provinces,
  districts,
  wards,
  loadingProvinces,
  loadingDistricts,
  loadingWards,
}) => {
  return (
    <Grid item xs={12}>
      <Box
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
          sx={{ fontWeight: "bold" }}
        >
          Bên nhận
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Số điện thoại"
              fullWidth
              required
              disabled={isViewMode}
              value={newOrder.to_phone || ""}
              onChange={(e) =>
                !isViewMode &&
                updateOrder({
                  to_phone: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Họ tên người nhận"
              fullWidth
              required
              disabled={isViewMode}
              value={newOrder.to_name || ""}
              onChange={(e) =>
                !isViewMode &&
                updateOrder({
                  to_name: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Địa chỉ"
              fullWidth
              required
              disabled={isViewMode}
              value={newOrder.to_address || ""}
              onChange={(e) =>
                !isViewMode &&
                updateOrder({
                  to_address: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <LocationSelect
              label="Tỉnh/Thành phố"
              placeholder="Chọn Tỉnh/Thành phố"
              value={toProvinceId}
              onChange={(e) => {
                const provId = e.target.value;
                const matched = provinces.find((p) => p.id === provId);
                setToProvinceId(provId);
                updateOrder({
                  to_province_name: matched ? matched.name : "",
                });
              }}
              options={provinces}
              loading={loadingProvinces}
              disabled={isViewMode}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <LocationSelect
              label="Quận/Huyện"
              placeholder="Chọn Quận/Huyện"
              value={toDistrictId}
              onChange={(e) => {
                const distId = e.target.value;
                const matched = districts.find((d) => d.id === distId);
                setToDistrictId(distId);
                updateOrder({
                  to_district_name: matched ? matched.name : "",
                });
              }}
              options={districts}
              loading={loadingDistricts}
              disabled={!toProvinceId || isViewMode}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <LocationSelect
              label="Phường/Xã"
              placeholder="Chọn Phường/Xã"
              value={toWardCode}
              onChange={(e) => {
                const wCode = e.target.value;
                const matched = wards.find((w) => w.code === wCode);
                setToWardCode(wCode);
                updateOrder({
                  to_ward_name: matched ? matched.name : "",
                });
              }}
              options={wards}
              loading={loadingWards}
              disabled={!toDistrictId || isViewMode}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ReceiverFormSection;
