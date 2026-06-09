import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const OrderFeesSection = ({
  newOrder,
  updateOrder,
  isViewMode,
  servicePackage,
}) => {
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Chi phí chi tiết
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderBottom: "1px dashed #e0e0e0",
            pb: 2,
            mb: 2,
          }}
        >
          {servicePackage === "light" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Phí dịch vụ
                </Typography>
                <Typography variant="body2">22.000 đ</Typography>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Phí dịch vụ
                </Typography>
                <Typography variant="body2">2.090.000 đ</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Phí thu COD
                </Typography>
                <Typography variant="body2">55.000 đ</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Phí thu giao thất bại thu tiền
                </Typography>
                <Typography variant="body2">33.000 đ</Typography>
              </Box>
            </>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <FormControl>
            <Select
              value={newOrder.paymentParty || "receiver"}
              onChange={(e) => updateOrder({ paymentParty: e.target.value })}
              disabled={isViewMode}
              displayEmpty
              size="small"
              sx={{
                minWidth: 200,
                "& .MuiSelect-select": { py: 1 },
                color: "#f97316",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f97316",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ea580c",
                },
              }}
            >
              <MenuItem value="receiver">Bên nhận trả phí</MenuItem>
              <MenuItem value="sender">Bên gửi trả phí</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mr: 1 }}
            >
              Tổng phí:
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="#f97316">
              {servicePackage === "light" ? "22.000 đ" : "2.178.000 đ"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            borderTop: "1px dashed #e0e0e0",
            mt: 2,
            pt: 2,
            pb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Mã khuyến mãi
            </Typography>

            <Box sx={{ display: "flex", width: "60%", maxWidth: 400 }}>
              <TextField
                placeholder="Nhập mã khuyến mãi"
                size="small"
                fullWidth
                disabled={isViewMode}
                value={newOrder.promotionCode || ""}
                onChange={(e) =>
                  !isViewMode &&
                  updateOrder({
                    promotionCode: e.target.value,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                }}
              />
              <Button
                variant="outlined"
                disabled={isViewMode}
                sx={{
                  borderColor: "#f97316",
                  color: "#f97316",
                  minWidth: 80,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  height: 40,
                  borderLeft: 0,
                  "&:hover": {
                    borderColor: "#ea580c",
                    backgroundColor: "rgba(249, 115, 22, 0.04)",
                  },
                }}
              >
                Áp dụng
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 1,
              mb: 1,
            }}
          >
            <Box
              component="img"
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNjc1MzQgOS41MzMwMUw2LjQ1MDMyIDkuMjgyMUw2Ljc3OTQ0IDkuMTIyMjhMOC40OTQ3OSA4LjQ2MzA1TDYuNzkxODMgNy42OTA1M0w2LjQ0OTYzIDcuNTE2MDFMNi42OTE3OCA3LjI0OTk3TDTyNjg1IDYuMTUzQzYuMjEyNjYgNi4wNzE1NUw1Ljg2NTYxIDYuMDU0ODFLNS44MjU0NiA1LjcwOTc5TDUuQzQ1ODIgMy45ODY3N0w0LjUwMjk5IDUuMjcwMTJMNC4yODEwMyA1LjUyMzk5TDMuOTk5MDQgNS4zMDc5M0wyLjU2NDQyIDNCMEwxLjc0NzgyIDUuNzQ1MzZMMS42MTcxNiA2LjA4Njg2TDEuMjcwMTEgNi4xOTI0NkwxLjI3MDEyIDYuNjIxNzNMMC45ODUxNDYgNy44Mzg3OUwxLjIyMzY2IDguMTI4OTlMMC45NzIxMSA4LjQwNDI2TDAgOS41MDg5OEwxLjI3OTE0IDkuODMzNTlMMS42Mjk3MiA5LjkyMDYyTDEuNzQ3MTMgMTAuMjY0OUwyLjQ5MTYyIDEyTDMuODcxNDMgMTAuNjcxTDQuMTAwMzQgMTAuNDQ4MUw0LjMzODg3IDEwLjY2MDFMNi4wMTYyNiAxMi4xMTM3TDUuODk5MTMgMTAuMzczNUw1Ljg2NzA0IDEwLjAyNjFMNi4xOTc4NCAxMC4wNTE4TDYuNjc1MzQgOS41MzMwMVoiIGZpbGw9IiNFRjQ0NDQiLz4KPHBhdGggZD0iTTE3LjEyMzcgOS41MDc5OEwxNi4xMzk1IDguMzg5MTdMMTUuODk0NSA4LjEyMDg5TDE2LjE0MDIgNy44Mzg0NkwxNy4xMjUgNi42MDk2M0wxNS44NTc5IDYuMTgwMDNMMTUuNTA4MiA2LjA3MDYzTDE1LjM3NjIgNS43MzE1M0wxNC41NTk2IDRMMTMuMTI1IDUuMzA3OTNMMTIuODQ2NCA1LjUyMDY0TDEyLjYyMTQgNS4yNjM0NEwxMS41MTUyIDRMMTEuMzM1NiA1LjcwOTc5TDExLjI5NTQgNi4wNTQ4MUwxMC45NDg0IDYuMDcxNTVMOS40ODAxNiA2LjE4NzkyTDEwLjQ2ODkgNy4yODQ0N0wxMC43MTc5IDcuNTM3NUwxMC4zNzU3IDcuNjkzNTZMOC40OTQ4IDguNDYzMDVMMTAuMjEwMSA5LjMnMTYyTDEwLjU0NTkgOS4yOTgzNkwxMC4zMjA5IDkuNTMzMDFMMTAuOTQ3NyAxMC4wNTE4TDExLjY3ODUgMTAuMDI2MUwxMS4yNDY0IDEwLjM3MzVMMTEuMTI5MyAxMi4xMTM3TDEyLjgwNjcgMTAuNjYwMUwxMy4wNDUyIDEwLjQ0ODFMMTMuMjc0MSAxMC42NzFMMTQuNjU0IDEyTDE1LjM5ODQgMTAuMjY0OUwxNS41MTU4IDkuOTIwNjJMMTUuODY2NCA5LjgzMzU5TDE3LjEyMzcgOS41MDc5OFoiIGZpbGw9IiNGRkQ3MDQiLz4KPHBhdGggZD0iTTEyLjY0NjggNi45MjIzOEwxMS4xODkgNi44NDc4UFwxMC44NTgxIDUuNDcwMjVMMTAuMDAyOSA2LjQ2NjY1TDguNjc1NjUgNi4xMzEyM0w5LjE4MzY0IDcuNDQyODVMOC4wMzc5OCA4LjE2MzM3TDkuMjk0NTQgOC42NjMxNkw4Ljg3OTk5IDEwLjAyODlMMTAuMTY0MSA5LjM0Nzc3TDExLjEyMjcgMTAuMjIxNEwxMS4wNjc3IDguNzY4NjlMMTIuNDA1MiA4LjM3MTk4TDExLjI0ODggNy42NzY2M0wxMi4wMTEzIDYuNjMxNjVMMTIuNjQ2OCA2LjkyMjM4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="
              alt="GHN"
              sx={{ width: 18, height: 18, mr: 1 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#1976d2", fontWeight: "medium" }}
            >
              Sử dụng mã khuyến mãi từ GHN
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default OrderFeesSection;
