import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, XCircle } from "lucide-react";
import React from "react";

const HeavyProductForm = ({ newOrder, updateOrder }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Thông tin kiện hàng
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Plus size={20} />}
          sx={{
            borderColor: "var(--primary-green)",
            color: "var(--primary-green)",
          }}
        >
          Kiện có sẵn
        </Button>
      </Box>

      {newOrder.packages && newOrder.packages.length > 0 ? (
        newOrder.packages.map((pkg, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Kiện {index + 1}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    const updatedPackages = [...newOrder.packages];
                    updatedPackages.splice(index, 1);
                    updateOrder({
                      packages: updatedPackages,
                    });
                  }}
                >
                  <XCircle size={16} />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Kiện"
                  fullWidth
                  value={pkg.name || ""}
                  onChange={(e) => {
                    const updatedPackages = [...newOrder.packages];
                    updatedPackages[index].name = e.target.value;
                    updateOrder({
                      packages: updatedPackages,
                    });
                  }}
                  placeholder="Nhập tên kiện"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Dài (cm)"
                  fullWidth
                  type="number"
                  required
                  value={pkg.length || ""}
                  onChange={(e) => {
                    const updatedPackages = [...newOrder.packages];
                    updatedPackages[index].length = e.target.value;
                    updateOrder({
                      packages: updatedPackages,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Rộng (cm)"
                  fullWidth
                  type="number"
                  required
                  value={pkg.width || ""}
                  onChange={(e) => {
                    const updatedPackages = [...newOrder.packages];
                    updatedPackages[index].width = e.target.value;
                    updateOrder({
                      packages: updatedPackages,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Cao (cm)"
                  fullWidth
                  type="number"
                  required
                  value={pkg.height || ""}
                  onChange={(e) => {
                    const updatedPackages = [...newOrder.packages];
                    updatedPackages[index].height = e.target.value;
                    updateOrder({
                      packages: updatedPackages,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="KL (gram)"
                  fullWidth
                  type="number"
                  required
                  value={pkg.weight || ""}
                  onChange={(e) => {
                    const updatedPackages = [...newOrder.packages];
                    updatedPackages[index].weight = e.target.value;
                    updateOrder({
                      packages: updatedPackages,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="KL quy đổi"
                  fullWidth
                  disabled
                  value={`${pkg.convertedWeight || "0"} g`}
                />
              </Grid>
            </Grid>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 5,
            flexDirection: "column",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Bạn chưa có kiện nào được tạo
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => {
              const newPackage = {
                name: `Kiện ${(newOrder.packages?.length || 0) + 1}`,
                length: 10,
                width: 10,
                height: 10,
                weight: 200,
                convertedWeight: 200,
              };
              updateOrder({
                packages: [...(newOrder.packages || []), newPackage],
              });
            }}
            sx={{
              mt: 2,
              bgcolor: "#f97316",
              color: "white",
              "&:hover": {
                bgcolor: "#ea580c",
              },
            }}
          >
            Thêm 1 kiện
          </Button>
        </Box>
      )}

      {newOrder.packages && newOrder.packages.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Tổng KL tính cước ({newOrder.packages.length} kiện):{" "}
            {newOrder.packages.reduce(
              (sum, pkg) => sum + parseInt(pkg.weight || 0),
              0,
            )}{" "}
            g
          </Typography>
          <Button
            startIcon={<Plus size={20} />}
            onClick={() => {
              const newPackage = {
                name: `Kiện ${newOrder.packages.length + 1}`,
                length: 10,
                width: 10,
                height: 10,
                weight: 200,
                convertedWeight: 200,
              };
              updateOrder({
                packages: [...newOrder.packages, newPackage],
              });
            }}
            sx={{
              ml: 2,
              color: "var(--primary-green)",
              "&:hover": {
                backgroundColor: "rgba(46, 125, 50, 0.08)",
              },
            }}
          >
            Thêm 1 kiện
          </Button>
        </Box>
      )}
    </>
  );
};

export default HeavyProductForm;
