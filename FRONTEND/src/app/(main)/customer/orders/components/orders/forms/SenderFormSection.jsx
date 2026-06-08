import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Key } from "lucide-react";
import React from "react";

import LocationSelect from "./LocationSelect";

const SenderFormSection = ({
  newOrder,
  updateOrder,
  isViewMode,
  fromProvinceId,
  setFromProvinceId,
  fromDistrictId,
  setFromDistrictId,
  fromWardCode,
  setFromWardCode,
  senderProvinces,
  senderDistricts,
  senderWards,
  loadingSenderProvinces,
  loadingSenderDistricts,
  loadingSenderWards,
  handleUseTokenForShipping,
  pickupOption,
  handlePickupOptionChange,
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0 }}>
            Bên gửi
          </Typography>

          <Tooltip title="Sử dụng API token để lấy thông tin từ GHN">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Key size={16} />}
              onClick={handleUseTokenForShipping}
              sx={{
                borderColor: "#f97316",
                color: "#f97316",
                "&:hover": {
                  borderColor: "#ea580c",
                  backgroundColor: "rgba(249, 115, 22, 0.04)",
                },
              }}
            >
              Lấy thông tin từ token
            </Button>
          </Tooltip>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Số điện thoại"
              fullWidth
              required
              disabled={isViewMode}
              value={newOrder.from_phone || ""}
              onChange={(e) =>
                !isViewMode &&
                updateOrder({
                  from_phone: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Họ tên người gửi"
              fullWidth
              required
              disabled={isViewMode}
              value={newOrder.from_name || ""}
              onChange={(e) =>
                !isViewMode &&
                updateOrder({
                  from_name: e.target.value,
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
              value={newOrder.from_address || ""}
              onChange={(e) =>
                !isViewMode &&
                updateOrder({
                  from_address: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <LocationSelect
              label="Tỉnh/Thành phố"
              placeholder="Chọn Tỉnh/Thành phố"
              value={fromProvinceId}
              onChange={(e) => {
                const provId = e.target.value;
                const matched = senderProvinces.find((p) => p.id === provId);
                setFromProvinceId(provId);
                updateOrder({
                  from_province_name: matched ? matched.name : "",
                });
              }}
              options={senderProvinces}
              loading={loadingSenderProvinces}
              disabled={isViewMode}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <LocationSelect
              label="Quận/Huyện"
              placeholder="Chọn Quận/Huyện"
              value={fromDistrictId}
              onChange={(e) => {
                const distId = e.target.value;
                const matched = senderDistricts.find((d) => d.id === distId);
                setFromDistrictId(distId);
                updateOrder({
                  from_district_name: matched ? matched.name : "",
                });
              }}
              options={senderDistricts}
              loading={loadingSenderDistricts}
              disabled={!fromProvinceId || isViewMode}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <LocationSelect
              label="Phường/Xã"
              placeholder="Chọn Phường/Xã"
              value={fromWardCode}
              onChange={(e) => {
                const wCode = e.target.value;
                const matched = senderWards.find((w) => w.code === wCode);
                setFromWardCode(wCode);
                updateOrder({
                  from_ward_name: matched ? matched.name : "",
                });
              }}
              options={senderWards}
              loading={loadingSenderWards}
              disabled={!fromDistrictId || isViewMode}
            />
          </Grid>
        </Grid>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <RadioGroup
            row
            value={pickupOption}
            onChange={handlePickupOptionChange}
          >
            <FormControlLabel
              value="pickup"
              disabled={isViewMode}
              control={<Radio color="success" />}
              label="Lấy hàng tận nơi"
            />
            <FormControlLabel
              value="delivery"
              disabled={isViewMode}
              control={<Radio color="success" />}
              label="Gửi hàng tại bưu cục"
            />
          </RadioGroup>
        </FormControl>

        {pickupOption === "pickup" && (
          <FormControl fullWidth margin="normal" disabled={isViewMode}>
            <Select
              value={newOrder.pickupLocation || ""}
              onChange={(e) =>
                updateOrder({
                  pickupLocation: e.target.value,
                })
              }
              displayEmpty
            >
              <MenuItem value="" disabled>
                Chọn ca lấy hàng
              </MenuItem>
              <MenuItem value="1">1</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
    </Grid>
  );
};

export default SenderFormSection;
