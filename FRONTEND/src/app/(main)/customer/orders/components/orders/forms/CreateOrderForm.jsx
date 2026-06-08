import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import React from "react";

import OrderFeesSection from "./OrderFeesSection";
import ProductFormSection from "./ProductFormSection";
import ProductListDialog from "./ProductListDialog";
import ReceiverFormSection from "./ReceiverFormSection";
import SenderFormSection from "./SenderFormSection";
import ShippingOptionsSection from "./ShippingOptionsSection";
import useCreateOrderState from "./useCreateOrderState";

const CreateOrderForm = ({
  newOrder,
  setNewOrder,
  handleCreateOrder,
  handleCloseDialog,
  isViewMode = false,
  isEditMode = false,
  isBasedOnMode = false,
}) => {
  const {
    servicePackage,
    pickupOption,
    handlePickupOptionChange,
    productListDialogOpen,
    setProductListDialogOpen,
    formValid,
    senderLocation,
    receiverLocation,
    updateOrder,
    handleAddProduct,
    handleUseTokenForShipping,
    handleSetFromProvinceId,
    handleSetFromDistrictId,
    handleSetToProvinceId,
    handleSetToDistrictId,
  } = useCreateOrderState({ newOrder, setNewOrder, isViewMode });

  return (
    <>
      <DialogTitle
        sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
      >
        {isViewMode
          ? `Chi tiết đơn hàng #${newOrder.orderCode || newOrder.id}`
          : isEditMode
            ? `Chỉnh sửa đơn hàng #${newOrder.orderCode || newOrder.id}`
            : isBasedOnMode
              ? "Tạo đơn hàng mới từ đơn hiện có"
              : "Tạo đơn mới"}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Bên gửi */}
          <SenderFormSection
            newOrder={newOrder}
            updateOrder={updateOrder}
            isViewMode={isViewMode}
            fromProvinceId={senderLocation.provinceId}
            setFromProvinceId={handleSetFromProvinceId}
            fromDistrictId={senderLocation.districtId}
            setFromDistrictId={handleSetFromDistrictId}
            fromWardCode={senderLocation.wardCode}
            setFromWardCode={senderLocation.setWardCode}
            senderProvinces={senderLocation.provinces}
            senderDistricts={senderLocation.districts}
            senderWards={senderLocation.wards}
            loadingSenderProvinces={senderLocation.loadingProvinces}
            loadingSenderDistricts={senderLocation.loadingDistricts}
            loadingSenderWards={senderLocation.loadingWards}
            handleUseTokenForShipping={handleUseTokenForShipping}
            pickupOption={pickupOption}
            handlePickupOptionChange={handlePickupOptionChange}
          />

          {/* Bên nhận */}
          <ReceiverFormSection
            newOrder={newOrder}
            updateOrder={updateOrder}
            isViewMode={isViewMode}
            toProvinceId={receiverLocation.provinceId}
            setToProvinceId={handleSetToProvinceId}
            toDistrictId={receiverLocation.districtId}
            setToDistrictId={handleSetToDistrictId}
            toWardCode={receiverLocation.wardCode}
            setToWardCode={receiverLocation.setWardCode}
            provinces={receiverLocation.provinces}
            districts={receiverLocation.districts}
            wards={receiverLocation.wards}
            loadingProvinces={receiverLocation.loadingProvinces}
            loadingDistricts={receiverLocation.loadingDistricts}
            loadingWards={receiverLocation.loadingWards}
          />

          {/* Thông tin sản phẩm / kiện hàng */}
          <ProductFormSection
            newOrder={newOrder}
            updateOrder={updateOrder}
            servicePackage={servicePackage}
            setProductListDialogOpen={setProductListDialogOpen}
          />

          {/* Thông tin đơn hàng (KL, cod, etc) */}
          <ShippingOptionsSection
            newOrder={newOrder}
            updateOrder={updateOrder}
            isViewMode={isViewMode}
          />

          {/* Chi phí chi tiết */}
          <OrderFeesSection
            newOrder={newOrder}
            updateOrder={updateOrder}
            isViewMode={isViewMode}
            servicePackage={servicePackage}
          />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isViewMode ? (
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                borderColor: "var(--primary-green)",
                color: "var(--primary-green)",
              }}
            >
              Đóng
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ borderColor: "#f97316", color: "#f97316" }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleCreateOrder}
                variant="contained"
                disabled={!formValid}
                sx={{
                  bgcolor: "#f97316",
                  "&:hover": { bgcolor: "#ea580c" },
                  "&.Mui-disabled": {
                    bgcolor: "#fbd7c7",
                    color: "#8b8b8b",
                  },
                }}
              >
                {isEditMode
                  ? "Cập nhật đơn"
                  : isBasedOnMode
                    ? "Tạo đơn mới"
                    : "Tạo đơn"}
              </Button>
            </>
          )}
        </Box>
      </DialogActions>

      {/* Product List Dialog */}
      <ProductListDialog
        open={productListDialogOpen}
        onClose={() => setProductListDialogOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </>
  );
};

export default CreateOrderForm;
