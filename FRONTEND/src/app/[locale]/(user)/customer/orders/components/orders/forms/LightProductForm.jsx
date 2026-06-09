import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

const LightProductForm = ({
  newOrder,
  updateOrder,
  setProductListDialogOpen,
}) => {
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
          Thông tin sản phẩm
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Plus size={20} />}
          onClick={() => setProductListDialogOpen(true)}
          sx={{
            borderColor: "var(--primary-green)",
            color: "var(--primary-green)",
          }}
        >
          SP có sẵn
        </Button>
      </Box>

      {newOrder.items && newOrder.items.length > 0 ? (
        newOrder.items.map((item, index) => (
          <Box
            key={index}
            sx={{
              mb: 3,
              border: "1px solid #f0f0f0",
              p: 2,
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={{ whiteSpace: "nowrap" }}>
                  Sản phẩm {index + 1}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3} sx={{ ml: "auto" }}>
                  <TextField
                    label="KL (gram)"
                    fullWidth
                    type="number"
                    required
                    value={item.weight || ""}
                    onChange={(e) => {
                      const updatedItems = [...newOrder.items];
                      updatedItems[index].weight =
                        parseInt(e.target.value) || 0;
                      updateOrder({
                        items: updatedItems,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Số lượng"
                    fullWidth
                    type="number"
                    required
                    value={item.quantity || ""}
                    onChange={(e) => {
                      const updatedItems = [...newOrder.items];
                      updatedItems[index].quantity =
                        parseInt(e.target.value) || 1;
                      updateOrder({
                        items: updatedItems,
                      });
                    }}
                  />
                </Grid>
              </Grid>

              {newOrder.items.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    const updatedItems = [...newOrder.items];
                    updatedItems.splice(index, 1);
                    updateOrder({
                      items: updatedItems,
                    });
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tên sản phẩm"
                  fullWidth
                  required
                  value={item.name || ""}
                  onChange={(e) => {
                    const updatedItems = [...newOrder.items];
                    updatedItems[index].name = e.target.value;
                    updateOrder({
                      items: updatedItems,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mã sản phẩm"
                  fullWidth
                  value={item.code || ""}
                  onChange={(e) => {
                    const updatedItems = [...newOrder.items];
                    updatedItems[index].code = e.target.value;
                    updateOrder({
                      items: updatedItems,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        ))
      ) : (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Chưa có sản phẩm nào
          </Typography>
        </Box>
      )}

      <Button
        startIcon={<Plus size={20} />}
        onClick={() => {
          const newItem = {
            name: "",
            code: "",
            quantity: 1,
            price: 0,
            length: 0,
            width: 0,
            height: 0,
            weight: 0,
            category: {
              level1: "",
            },
          };

          updateOrder({
            items: [...(newOrder.items || []), newItem],
          });
        }}
        sx={{
          mt: 2,
          color: "var(--primary-green)",
          "&:hover": {
            backgroundColor: "rgba(46, 125, 50, 0.08)",
          },
        }}
      >
        Thêm 1 sản phẩm
      </Button>
    </>
  );
};

export default LightProductForm;
