import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ChevronDown,
  Key,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

// Import API functions
import {
  getAllDistrictsByProvinceApi,
  getAllProvincesApi,
  getAllWardsByDistrictApi,
  getShippingAccountsByUserApi,
} from "@/src/utils/api";

// Product List Dialog Component
const ProductListDialog = ({ open, onClose, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    weight: 0,
    quantity: 1,
    code: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [savedProducts, setSavedProducts] = useState([
    {
      id: 1,
      name: "Phan Tuấn Quốc Anh",
      weight: 200,
      quantity: 1,
      code: "",
    },
  ]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleAddNewProduct = () => {
    // Add to saved products
    const productToAdd = { ...newProduct, id: Date.now() };
    setSavedProducts([...savedProducts, productToAdd]);

    // Clear form
    setNewProduct({ name: "", weight: 0, quantity: 1, code: "" });
    setShowAddForm(false);
  };

  const handleSelectProduct = (product) => {
    onAddProduct(product);
    onClose();
  };

  const handleToggleSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleAddSelectedToOrder = () => {
    const productsToAdd = savedProducts.filter((p) =>
      selectedProducts.includes(p.id),
    );
    if (productsToAdd.length > 0) {
      onAddProduct(productsToAdd[0]); // For now just add the first one
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Danh sách sản phẩm sẵn
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ position: "relative", mb: 3 }}>
            <Search
              style={{
                position: "absolute",
                left: 12,
                top: 12,
              }}
              className="text-gray-500"
              size={20}
            />
            <InputBase
              placeholder="Nhập tên để tìm kiếm"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                py: 1,
                pl: 5,
                pr: 2,
              }}
            />
          </Box>
        </Box>

        {!showAddForm && (
          <>
            {savedProducts.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 10,
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NS41MDcgMzEuMDk1SDI0LjI2MVYzMy4zMzNINTUuNTA3VjMxLjA5NVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NS41MDcgNDIuMzgxSDI0LjI2MVY0NC42MTlINTUuNTA3VjQyLjM4MVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zOS44ODEgNTMuNjY3SDI0LjI2MVY1NS45MDVIMzkuODgxVjUzLjY2N1oiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02NS45OTggMjcuOTk4VjU5LjMzM0gxMy45OThWMjAuNjY3SDU4LjY2N0w2NS45OTggMjcuOTk4Wk02MS42NjUgMjkuMzM0SDU3LjMzMVYyNS4wMDFMNjEuNjY1IDI5LjMzNFpNNjMuOTM0IDMxLjYwMUw1NS4wNjQgMjIuNzMyQzU0Ljk2ODQgMjIuNjM0MyA1NC44MzUgMjIuNjY2OCA1NC43OTQ3IDIyLjY4MTNDNTQuNzgyMiAyMi42ODYgNTQuNzcyOCAyMi42ODk1IDU0Ljc2NjcgMjIuNjkwN0M1NC43NjE0IDIyLjY5MTcgNTQuNzUzNyAyMi42OTMzIDU0Ljc0NTMgMjIuNjk0N0M1NC43MzkgMjIuNjk1NyA1NC43MzI0IDIyLjY5NjcgNTQuNzI1NSAyMi42OTc1QzU0LjcyMTYgMjIuNjk4IDU0LjcxNzcgMjIuNjk4NCA1NC43MTM3IDIyLjY5ODhDNTQuNzA1NiAyMi42OTk1IDU0LjY5NzIgMjIuNyA1NC42ODggMjIuN0gxMy45OThDMTIuNzEzIDIyLjcgMTEuNjY1IDIzLjc0OCAxMS42NjUgMjVWNkguMzMzQzExLjY2NSA2MC42MjUgMTUuMzkgNjEuNjY3IDE2LjY2NSA2MS42NjdINjMuMzMyQzY0LjYwNyA2MS42NjcgNjguMzMyIDYwLjYyNSA2OC4zMzIgNTUuMDAxVjI5LjMzNEM2OC4zMzIgMjkuMzI1IDY4LjMzMjcgMjkuMzE3IDY4LjMzMzMgMjkuMzA4OEM2OC4zMzM3IDI5LjMwMzIgNjguMzM0MiAyOS4yOTc0IDY4LjMzNDUgMjkuMjkxNEM2OC4zMzUzIDI5LjI3NjcgNjguMzM1NyAyOS4yNjEgNjguMzMyIDI5LjI0NTdDNjguMzMxMyAyOS4yNDIgNjguMzMwMyAyOS4yMzc1IDY4LjMyOTIgMjkuMjMyN0M2OC4zMjgyIDI5LjIyOCA2OC4zMjcgMjkuMjIzIDY4LjMyNTcgMjkuMjE4QzY4LjMyMTcgMjkuMjA1IDY4LjMxNyAyOS4xOTIzIDY4LjMxMDcgMjkuMTgxN0M2OC4zMDQ3IDI5LjE3MTcgNjguMjk3MiAyOS4xNjI4IDY4LjI4OTIgMjkuMTU1N0M2OC4yNzk3IDI5LjE0NzUgNjguMjY5NSAyOS4xNDA4IDY4LjI1OTQgMjkuMTM1N0M2OC4yNTQyIDI5LjEzMjUgNjguMjQ5NSAyOS4xMzAyIDY4LjI0NSAyOS4xMjhDNjguMjMzMiAyOS4xMjI1IDY4LjIyMTIgMjkuMTE4MiA2OC4yMDkgMjkuMTE1QzY4LjIwMTUgMjkuMTEzMiA2OC4xOTQgMjkuMTExNSA2OC4xODY1IDI5LjExMDJDNjguMTgxNyAyOS4xMDk1IDY4LjE3NyAyOS4xMDg4IDY4LjE3MjIgMjkuMTA4QzY4LjE2MSAyOS4xMDY1IDY4LjE0OTUgMjkuMTA2IDY4LjEzOCAyOS4xMDZINjMuOTk4QzYzLjk2MiAyOS4xMDYgNjMuOTI2IDI5LjExMSA2My44OSAyOS4xMkg2My44ODc1QzYzLjg4MzcgMjkuMTIyNSA2My44NzkgMjkuMTI1NyA2My44NzQyIDI5LjEyOU02My44NzQyIDI5LjEyOUM2My44NjggMjkuMTMzMyA2My44NjI1IDI5LjEzOCA2My44NTcyIDI5LjE0MkM2My44NTE3IDI5LjE0NiA2My44NDYgMjkuMTUwNSA2My44NDA1IDI5LjE1NUM2My44MzcyIDI5LjE1OCA2My44MzM3IDI5LjE2MDcgNjMuODMwNSAyOS4xNjM1QzYzLjgyNDcgMjkuMTY4NSA2My44MTg3IDI5LjE3MzIgNjMuODEzMiAyOS4xNzkzQzYzLjgwNTcgMjkuMTg3MiA2My43OTg1IDI5LjE5NTggNjMuNzkyIDI5LjIwNUM2My43ODkyIDI5LjIwODcgNjMuNzg2NSAyOS4yMTI3IDYzLjc4NCAyOS4yMTY3QzYzLjc3NzUgMjkuMjI2IDYzLjc3MTUgMjkuMjM2IDYzLjc2NjIgMjkuMjQ2MkM2My43NTUgMjkuMjY3MiA2My43NDYyIDI5LjI4OTggNjMuNzQwNSAyOS4zMTNDNjMuNzM5IDI5LjMxODMgNjMuNzM3NyAyOS4zMjM1IDYzLjczNjUgMjkuMzI4N0M2My43MzQ4IDI5LjMzNTggNjMuNzMzMiAyOS4zNDMgNjMuNzMyIDI5LjM1QzYzLjczMTggMjkuMzU0NyA2My43MzE2IDI5LjM1OTcgNjMuNzMxNSAyOS4zNjQ3QzYzLjczMTEgMjkuMzc1IDYzLjczMTIgMjkuMzg1NSA2My43MzE3IDI5LjM5NkM2My43MzE4IDI5LjM5OSA2My43MzIgMjkuNDAyIDYzLjczMjIgMjkuNDA1QzYzLjczNCAyOS40MzE1IDYzLjczODIgMjkuNDU3NSA2My43NDQ1IDI5LjQ4MkM2My43NDczIDI5LjQ5MzUgNjMuNzUwNSAyOS41MDQzIDYzLjc1NDIgMjkuNTE0OEM2My43NiAyOS41MzEyIDYzLjc2NzUgMjkuNTQ2NSA2My43NzYgMjkuNTYwN0M2My43NzkyIDI5LjU2NjUgNjMuNzgyNyAyOS41NzIzIDYzLjc4NjUgMjkuNTc3OEM2My43OTc1IDI5LjU5MzggNjMuODA5NyAyOS42MDg1IDYzLjgyMzIgMjkuNjIxN0M2My44MjY1IDI5LjYyNTUgNjMuODMgMjkuNjI5IDYzLjgzMzUgMjkuNjMyNUM2My44NDU3IDI5LjY0NDUgNjMuODU5IDI5LjY1NTggNjMuODczNSAyOS42NjU1QzYzLjg3ODUgMjkuNjY5IDYzLjg4MzUgMjkuNjcyMyA2My44ODg3IDI5LjY3NTVDNjMuODk5NyAyOS42ODIgNjMuOTExMiAyOS42ODggNjMuOTIzMiAyOS42OTI1QzYzLjkyODUgMjkuNjk0NSA2My45MzM3IDI5LjY5NjMgNjMuOTM5IDI5LjY5OEM2My45NTY1IDI5LjcwNCA2My45NzQ1IDI5LjcwODIgNjMuOTkzMiAyOS43MUgyOS43MDVDNjQuMDAxNSAyOS43MSA2NC4wMSAyOS43MDkzIDY0LjAxODUgMjkuNzA4QzY0LjAyODIgMjkuNzA2NSA2NC4wMzggMjkuNzA0MiA2NC4wNDc1IDI5LjcwMUM2NC4wNTI1IDI5LjY5OTMgNjQuMDU3MiAyOS42OTc1IDY0LjA2MiAyOS42OTU1QzY0LjA3NDIgMjkuNjkwNSA2NC4wODYgMjkuNjg0NSA2NC4wOTc1IDI5LjY3NzVDNjQuMTAyNSAyOS42NzQzIDY0LjEwNzUgMjkuNjcxIDY0LjExMjUgMjkuNjY3NVM2NC4xMjY1IDI5LjY1NTggNjQuMTM4NSAyOS42NDM1QzY0LjE0MjIgMjkuNjQgNjQuMTQ1NyAyOS42MzYzIDY0LjE0OSAyOS42MzI1QzY0LjE2MjcgMjkuNjE5IDY0LjE3NTIgMjkuNjA0MiA2NC4xODYgMjkuNTg4QzY0LjE4OTcgMjkuNTgyNyA2NC4xOTMgMjkuNTc3MiA2NC4xOTY1IDI5LjU3MTVDNjQuMjA1MiAyOS41NTcgNjQuMjEzIDI5LjU0MTUgNjQuMjE5IDI5LjUyNUM2NC4yMjI3IDI5LjUxNDUgNjQuMjI2IDI5LjUwMzcgNjQuMjI4NyAyOS40OTI1QzY0LjIzNSAyOS40NjggNjQuMjM5MiAyOS40NDIgNjQuMjQxIDI5LjQxNUM2NC4yNDEzIDI5LjQxMTIgNjQuMjQxNSAyOS40MDc1IDY0LjI0MTcgMjkuNDAzN0M2NC4yNDIyIDI5LjM5MyA2NC4yNDIzIDI5LjM4MjIgNjQuMjQxNyAyOS4zNzE3QzY0LjI0MTUgMjkuMzY3IDY0LjI0MTMgMjkuMzYyMiA2NC4yNDEgMjkuMzU3N0M2NC4yMzk3IDI5LjM0OTIgNjQuMjM4MiAyOS4zNDA4IDY0LjIzNjIgMjkuMzMyNUM2NC4yMzUgMjkuMzI3NSA2NC4yMzM3IDI5LjMyMjUgNjQuMjMyMiAyOS4zMTc1QzY0LjIyNjUgMjkuMjk0MiA2NC4yMTc3IDI5LjI3MTggNjQuMjA2NSAyOS4yNTFDNjQuMjAxMiAyOS4yNDA3IDY0LjE5NTIgMjkuMjMxIDY0LjE4ODcgMjkuMjIxN0M2NC4xODYyIDI5LjIxNzcgNjQuMTgzNyAyOS4yMTM3IDY0LjE4MSAyOS4yMDk3QzY0LjE3NDUgMjkuMjAwMiA2NC4xNjcyIDI5LjE5MTIgNjQuMTU5NSAyOS4xODNDNjQuMTU0MiAyOS4xNzc1IDY0LjE0ODcgMjkuMTcyNyA2NC4xNDMgMjkuMTY4QzY0LjE0IDI5LjE2NTIgNjQuMTM2NyAyOS4xNjI1IDY0LjEzMzIgMjkuMTU5N0M2NC4xMjc3IDI5LjE1NTIgNjQuMTIyMiAyOS4xNTA3IDY0LjExNjUgMjkuMTQ2N0M2NC4xMTEyIDI5LjE0MjcgNjQuMTA1NyAyOS4xMzg1IDY0LjEgMjkuMTM0NUw2NC4wODkgMjkuMTI3NUw2My45MzQgMzEuNjAxWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K"
                    alt="Empty state"
                    width="80"
                    height="80"
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Bạn chưa có kiện nào được tạo sẵn
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    mx: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      startIcon={<Plus size={20} />}
                      size="small"
                      onClick={() => setShowAddForm(true)}
                      sx={{ mr: 2 }}
                    >
                      Thêm 1 sản phẩm
                    </Button>
                    <Box
                      sx={{
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        pr: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ px: 2, py: 0.5 }}>
                        1
                      </Typography>
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <ChevronDown size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ px: 2 }}>
                  {savedProducts
                    .filter((product) =>
                      product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                    )
                    .map((product) => (
                      <Paper
                        key={product.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleToggleSelect(product.id)}
                          sx={{
                            color: "#f97316",
                            "&.Mui-checked": {
                              color: "#f97316",
                            },
                          }}
                        />
                        <Typography variant="body1" sx={{ flex: 1 }}>
                          {product.name}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            KL (gram):{" "}
                            <span
                              style={{ color: "#f97316", fontWeight: "bold" }}
                            >
                              {product.weight}
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Số lượng:{" "}
                            <span
                              style={{ color: "#f97316", fontWeight: "bold" }}
                            >
                              {product.quantity}
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Mã sản phẩm: {product.code}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                          <IconButton size="small" sx={{ color: "#1976d2" }}>
                            <Pencil size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSavedProducts(
                                savedProducts.filter(
                                  (p) => p.id !== product.id,
                                ),
                              );
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                </Box>
              </>
            )}

            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #e0e0e0",
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  size="small"
                  checked={false}
                  sx={{
                    color: "#f97316",
                    "&.Mui-checked": {
                      color: "#f97316",
                    },
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  Tự động mở danh sách SP khi thêm SP ở đơn hàng
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleAddSelectedToOrder}
                sx={{
                  bgcolor: "#f97316",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#ea580c",
                  },
                }}
              >
                Thêm sản phẩm vào đơn
              </Button>
            </Box>
          </>
        )}

        {showAddForm && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nhập tên"
                    fullWidth
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="KL (gram)"
                    fullWidth
                    type="number"
                    required
                    value={newProduct.weight}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, weight: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">g</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Số lượng"
                    fullWidth
                    type="number"
                    required
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Mã sản phẩm"
                    fullWidth
                    value={newProduct.code}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, code: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddForm(false)}
                sx={{
                  color: "#f97316",
                  borderColor: "#f97316",
                  "&:hover": {
                    borderColor: "#ea580c",
                  },
                }}
              >
                Xóa
              </Button>
              <Button
                variant="contained"
                onClick={handleAddNewProduct}
                disabled={!newProduct.name || !newProduct.weight}
                sx={{
                  bgcolor: "#f97316",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#ea580c",
                  },
                }}
              >
                Lưu
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CreateOrderForm = ({
  newOrder,
  setNewOrder,
  handleCreateOrder,
  handleCloseDialog,
  calculatePoints,
  shippingAccounts,
  wasteCategories,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
  isViewMode = false,
  isEditMode = false,
  isBasedOnMode = false,
}) => {
  const [servicePackage, setServicePackage] = useState(
    newOrder.servicePackage || "light",
  );
  const [pickupOption, setPickupOption] = useState(
    newOrder.pickupOption || "pickup",
  );
  const [productListDialogOpen, setProductListDialogOpen] = useState(false);
  const [provinces, setProvinces] = useState([
    { id: 201, name: "Hà Nội" },
    { id: 202, name: "TP Hồ Chí Minh" },
    { id: 203, name: "Đà Nẵng" },
  ]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [senderProvinces, setSenderProvinces] = useState([
    { id: 201, name: "Hà Nội" },
    { id: 202, name: "TP Hồ Chí Minh" },
    { id: 203, name: "Đà Nẵng" },
  ]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [senderWards, setSenderWards] = useState([]);

  // Add separate state variables for the fields to exclude from newOrder
  const [fromProvinceId, setFromProvinceId] = useState(
    newOrder.from_province_id || null,
  );
  const [fromDistrictId, setFromDistrictId] = useState(
    newOrder.from_district_id || null,
  );
  const [fromWardCode, setFromWardCode] = useState(
    newOrder.from_ward_code || "",
  );
  const [toProvinceId, setToProvinceId] = useState(
    newOrder.to_province_id || null,
  );
  const [toDistrictId, setToDistrictId] = useState(
    newOrder.to_district_id || null,
  );
  const [toWardCode, setToWardCode] = useState(newOrder.to_ward_code || "");

  // Loading states
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingSenderProvinces, setLoadingSenderProvinces] = useState(false);
  const [loadingSenderDistricts, setLoadingSenderDistricts] = useState(false);
  const [loadingSenderWards, setLoadingSenderWards] = useState(false);

  // Search states
  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const [senderProvinceSearch, setSenderProvinceSearch] = useState("");
  const [senderDistrictSearch, setSenderDistrictSearch] = useState("");
  const [senderWardSearch, setSenderWardSearch] = useState("");

  // Error states
  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [wardError, setWardError] = useState("");

  // Form validation state
  const [formValid, setFormValid] = useState(false);

  // Check form validity
  useEffect(() => {
    const requiredFields = {
      // Sender fields
      from_name: newOrder.from_name,
      from_phone: newOrder.from_phone,
      from_address: newOrder.from_address,
      from_province_name: newOrder.from_province_name,
      from_district_name: newOrder.from_district_name,
      from_ward_name: newOrder.from_ward_name,

      // Receiver fields
      to_name: newOrder.to_name,
      to_phone: newOrder.to_phone,
      to_address: newOrder.to_address,
      to_province_name: newOrder.to_province_name,
      to_district_name: newOrder.to_district_name,
      to_ward_name: newOrder.to_ward_name,

      // Product fields - ensure at least one item exists with name and weight
      items:
        newOrder.items &&
        newOrder.items.length > 0 &&
        newOrder.items[0].name &&
        newOrder.items[0].weight,
    };

    // Check if all required fields are filled
    const isValid = Object.values(requiredFields).every((field) => !!field);
    setFormValid(isValid);
  }, [newOrder]);

  // Sender province/district/ward effects
  useEffect(() => {
    if (fromProvinceId) {
      // In a real implementation, you would fetch districts from an API
      const fetchedDistricts = [];

      if (fromProvinceId === 202) {
        // HCM
        fetchedDistricts.push(
          { id: 1442, name: "Quận 1", province_id: 202 },
          { id: 1443, name: "Quận 2", province_id: 202 },
          { id: 1444, name: "Quận 3", province_id: 202 },
          { id: 1445, name: "Quận 10", province_id: 202 },
        );
      } else if (fromProvinceId === 201) {
        // Hanoi
        fetchedDistricts.push(
          { id: 1447, name: "Quận Ba Đình", province_id: 201 },
          { id: 1448, name: "Quận Hoàn Kiếm", province_id: 201 },
        );
      } else {
        // Da Nang or other
        fetchedDistricts.push(
          { id: 1449, name: "Quận Hải Châu", province_id: 203 },
          { id: 1450, name: "Quận Thanh Khê", province_id: 203 },
        );
      }

      setSenderDistricts(fetchedDistricts);
      // Clear ward and district selection when province changes
      setFromDistrictId(null);
      setFromWardCode("");
      setNewOrder({
        ...newOrder,
        from_district_name: "",
        from_ward_name: "",
      });
      setSenderWards([]);
    }
  }, [fromProvinceId]);

  useEffect(() => {
    if (fromDistrictId) {
      // In a real implementation, you would fetch wards from an API
      const fetchedWards = [];

      // Simple mock data for different districts
      if (fromDistrictId === 1444) {
        // Quận 3 - HCM
        fetchedWards.push(
          { code: "W01", name: "Phường 1", district_id: 1444 },
          { code: "W02", name: "Phường 2", district_id: 1444 },
          { code: "W03", name: "Phường 3", district_id: 1444 },
          { code: "W14", name: "Phường 14", district_id: 1444 },
        );
      } else {
        // Default wards for other districts
        fetchedWards.push(
          {
            code: "W07",
            name: "Phường A",
            district_id: fromDistrictId,
          },
          {
            code: "W08",
            name: "Phường B",
            district_id: fromDistrictId,
          },
        );
      }

      setSenderWards(fetchedWards);
      // Set district name and clear ward selection
      const selectedDistrict = senderDistricts.find(
        (d) => d.id === fromDistrictId,
      );
      setFromWardCode("");
      setNewOrder({
        ...newOrder,
        from_district_name: selectedDistrict ? selectedDistrict.name : "",
        from_ward_name: "",
      });
    }
  }, [fromDistrictId, senderDistricts]);

  // Set ward name when ward is selected
  useEffect(() => {
    if (fromWardCode) {
      const selectedWard = senderWards.find((w) => w.code === fromWardCode);
      if (selectedWard) {
        setNewOrder({
          ...newOrder,
          from_ward_name: selectedWard.name,
        });
      }
    }
  }, [fromWardCode, senderWards]);

  // Simulate district data based on selected province
  useEffect(() => {
    if (toProvinceId) {
      // In a real implementation, you would fetch districts from an API
      const fetchedDistricts = [];

      if (toProvinceId === 202) {
        // HCM
        fetchedDistricts.push(
          { id: 1442, name: "Quận 1", province_id: 202 },
          { id: 1443, name: "Quận 2", province_id: 202 },
          { id: 1444, name: "Quận 3", province_id: 202 },
          { id: 1445, name: "Quận 10", province_id: 202 },
        );
      } else if (toProvinceId === 201) {
        // Hanoi
        fetchedDistricts.push(
          { id: 1447, name: "Quận Ba Đình", province_id: 201 },
          { id: 1448, name: "Quận Hoàn Kiếm", province_id: 201 },
        );
      } else {
        // Da Nang or other
        fetchedDistricts.push(
          { id: 1449, name: "Quận Hải Châu", province_id: 203 },
          { id: 1450, name: "Quận Thanh Khê", province_id: 203 },
        );
      }

      setDistricts(fetchedDistricts);
      // Clear ward and district selection when province changes
      setToDistrictId(null);
      setToWardCode("");
      setNewOrder({
        ...newOrder,
        to_district_name: "",
        to_ward_name: "",
      });
      setWards([]);
    }
  }, [toProvinceId]);

  // Simulate ward data based on selected district
  useEffect(() => {
    if (toDistrictId) {
      // In a real implementation, you would fetch wards from an API
      const fetchedWards = [];

      // Simple mock data for different districts
      if (toDistrictId === 1444) {
        // Quận 3 - HCM
        fetchedWards.push(
          { code: "W01", name: "Phường 1", district_id: 1444 },
          { code: "W02", name: "Phường 2", district_id: 1444 },
          { code: "W03", name: "Phường 3", district_id: 1444 },
          { code: "W14", name: "Phường 14", district_id: 1444 },
        );
      } else if (toDistrictId === 1445) {
        // Quận 10 - HCM
        fetchedWards.push(
          { code: "W04", name: "Phường 4", district_id: 1445 },
          { code: "W05", name: "Phường 5", district_id: 1445 },
          { code: "W06", name: "Phường 6", district_id: 1445 },
        );
      } else {
        // Default wards for other districts
        fetchedWards.push(
          {
            code: "W07",
            name: "Phường A",
            district_id: toDistrictId,
          },
          {
            code: "W08",
            name: "Phường B",
            district_id: toDistrictId,
          },
        );
      }

      setWards(fetchedWards);
      // Set district name and clear ward selection
      const selectedDistrict = districts.find((d) => d.id === toDistrictId);
      setToWardCode("");
      setNewOrder({
        ...newOrder,
        to_district_name: selectedDistrict ? selectedDistrict.name : "",
        to_ward_name: "",
      });
    }
  }, [toDistrictId, districts]);

  // Set ward name when ward is selected
  useEffect(() => {
    if (toWardCode) {
      const selectedWard = wards.find((w) => w.code === toWardCode);
      if (selectedWard) {
        setNewOrder({
          ...newOrder,
          to_ward_name: selectedWard.name,
        });
      }
    }
  }, [toWardCode, wards]);

  const handleServicePackageChange = (event) => {
    if (isViewMode) return;
    const selectedPackage = event.target.value;
    setServicePackage(selectedPackage);

    // Map the service package to the appropriate service_type_id for GHN API
    // According to GHN documentation:
    // - 1: Express (nhanh)
    // - 2: Standard (tiêu chuẩn)
    let serviceTypeId = 2; // Default to Standard

    if (selectedPackage === "express") {
      serviceTypeId = 1; // Express
    }

    setNewOrder({
      ...newOrder,
      servicePackage: selectedPackage,
      service_type_id: serviceTypeId,
    });
  };

  const handlePickupOptionChange = (event) => {
    if (isViewMode) return;
    setPickupOption(event.target.value);
    setNewOrder({ ...newOrder, pickupOption: event.target.value });
  };

  const handleAddProduct = (product) => {
    if (isViewMode) return;

    // Create a new item object matching the initialOrderPayload structure
    const newItem = {
      name: product.name || "",
      code: product.code || "",
      quantity: product.quantity || 1,
      price: 0, // Default price, can be updated later
      length: 0, // Default dimensions, can be updated later
      width: 0,
      height: 0,
      weight: product.weight || 0,
      category: {
        level1: "", // Default category
      },
    };

    // Add the new item to the items array
    setNewOrder({
      ...newOrder,
      items: [...(newOrder.items || []), newItem],
      weight: product.weight,
      height: product.height,
      width: product.width,
      length: product.length,
    });
  };

  // Initialize items array if empty
  useEffect(() => {
    if (!newOrder.items || newOrder.items.length === 0) {
      // Create a default item based on existing product data or empty values
      const defaultItem = {
        name: newOrder.productName || "",
        code: newOrder.productCode || "",
        quantity: parseInt(newOrder.productQuantity) || 1,
        price: parseInt(newOrder.codAmount) || 0,
        length: parseInt(newOrder.length) || 0,
        width: parseInt(newOrder.with) || 0,
        height: parseInt(newOrder.height) || 0,
        weight: parseInt(newOrder.weight) || 0,
        category: {
          level1: "Áo",
        },
      };

      // Only initialize if there's at least some data
      if (newOrder.productName || newOrder.productCode || newOrder.from_phone) {
        setNewOrder({
          ...newOrder,
          items: [defaultItem],
        });
      }
    }

    // Initialize location IDs and codes from newOrder if they exist
    // and then remove them from newOrder to avoid sending them in API calls
    if (newOrder.from_province_id) {
      setFromProvinceId(newOrder.from_province_id);
    }
    if (newOrder.from_district_id) {
      setFromDistrictId(newOrder.from_district_id);
    }
    if (newOrder.from_ward_code) {
      setFromWardCode(newOrder.from_ward_code);
    }
    if (newOrder.to_province_id) {
      setToProvinceId(newOrder.to_province_id);
    }
    if (newOrder.to_district_id) {
      setToDistrictId(newOrder.to_district_id);
    }
    if (newOrder.to_ward_code) {
      setToWardCode(newOrder.to_ward_code);
    }

    // Create a cleaned version of newOrder without location IDs and codes
    const cleanedNewOrder = { ...newOrder };
    delete cleanedNewOrder.from_province_id;
    delete cleanedNewOrder.from_district_id;
    delete cleanedNewOrder.from_ward_code;
    delete cleanedNewOrder.to_province_id;
    delete cleanedNewOrder.to_district_id;
    delete cleanedNewOrder.to_ward_code;

    setNewOrder(cleanedNewOrder);
  }, []);

  // Fetch provinces for recipient
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        setProvinceError("");

        // Get default shipping account for API token
        const accountsResponse = await getShippingAccountsByUserApi();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setProvinceError(
            "No shipping accounts found. Please add a shipping account first.",
          );
          setLoadingProvinces(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc) => acc.is_default) ||
          accountsResponse.data[0];
        const response = await getAllProvincesApi(defaultAccount.token);

        if (response.code === 200) {
          setProvinces(
            response.data.map((province) => ({
              id: province.ProvinceID,
              name: province.ProvinceName,
              code: province.Code,
            })),
          );
        } else {
          setProvinceError("Failed to load provinces");
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinceError("Error loading provinces. Please try again.");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch provinces for sender
  useEffect(() => {
    const fetchSenderProvinces = async () => {
      try {
        setLoadingSenderProvinces(true);

        // Get default shipping account for API token
        const accountsResponse = await getShippingAccountsByUserApi();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setLoadingSenderProvinces(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc) => acc.is_default) ||
          accountsResponse.data[0];

        // Fetch provinces
        const response = await getAllProvincesApi(defaultAccount.token);

        if (response.code === 200) {
          setSenderProvinces(
            response.data.map((province) => ({
              id: province.ProvinceID,
              name: province.ProvinceName,
              code: province.Code,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching sender provinces:", error);
      } finally {
        setLoadingSenderProvinces(false);
      }
    };

    fetchSenderProvinces();
  }, []);

  // Fetch districts when province changes (recipient)
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!toProvinceId) return;

      try {
        setLoadingDistricts(true);
        setDistrictError("");
        setDistricts([]);

        // Get default shipping account for API token
        const accountsResponse = await getShippingAccountsByUserApi();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setDistrictError(
            "No shipping accounts found. Please add a shipping account first.",
          );
          setLoadingDistricts(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc) => acc.is_default) ||
          accountsResponse.data[0];

        const response = await getAllDistrictsByProvinceApi(
          toProvinceId,
          defaultAccount.token,
        );

        if ((response.code = 200)) {
          setDistricts(
            response.data.map((district) => ({
              id: district.DistrictID,
              name: district.DistrictName,
              province_id: toProvinceId,
            })),
          );
        } else {
          setDistrictError("Failed to load districts");
        }

        // Clear district and ward selections
        setToDistrictId(null);
        setToWardCode("");
        setNewOrder({
          ...newOrder,
          to_district_name: "",
          to_ward_name: "",
        });
        setWards([]);
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistrictError("Error loading districts. Please try again.");
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [toProvinceId]);

  // Fetch districts when province changes (sender)
  useEffect(() => {
    const fetchSenderDistricts = async () => {
      if (!fromProvinceId) return;

      try {
        setLoadingSenderDistricts(true);
        setSenderDistricts([]);

        // Get default shipping account for API token
        const accountsResponse = await getShippingAccountsByUserApi();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setLoadingSenderDistricts(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc) => acc.is_default) ||
          accountsResponse.data[0];

        // Fetch districts
        const response = await getAllDistrictsByProvinceApi(
          fromProvinceId,
          defaultAccount.token,
        );

        if (response.code === 200) {
          setSenderDistricts(
            response.data.map((district) => ({
              id: district.DistrictID,
              name: district.DistrictName,
              province_id: fromProvinceId,
            })),
          );
        }

        // Clear district and ward selections
        setFromDistrictId(null);
        setFromWardCode("");
        setNewOrder({
          ...newOrder,
          from_district_name: "",
          from_ward_name: "",
        });
        setSenderWards([]);
      } catch (error) {
        console.error("Error fetching sender districts:", error);
      } finally {
        setLoadingSenderDistricts(false);
      }
    };

    fetchSenderDistricts();
  }, [fromProvinceId]);

  // Fetch wards when district changes (recipient)
  useEffect(() => {
    const fetchWards = async () => {
      if (!toDistrictId) return;

      try {
        setLoadingWards(true);
        setWardError("");
        setWards([]);

        // Get default shipping account for API token
        const accountsResponse = await getShippingAccountsByUserApi();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setWardError(
            "No shipping accounts found. Please add a shipping account first.",
          );
          setLoadingWards(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc) => acc.is_default) ||
          accountsResponse.data[0];

        const response = await getAllWardsByDistrictApi(
          toDistrictId,
          defaultAccount.token,
        );

        if (response.code === 200) {
          setWards(
            response.data.map((ward) => ({
              code: ward.WardCode,
              name: ward.WardName,
              district_id: toDistrictId,
            })),
          );
        } else {
          setWardError("Failed to load wards");
        }

        const selectedDistrict = districts.find((d) => d.id === toDistrictId);
        setToWardCode("");
        setNewOrder({
          ...newOrder,
          to_district_name: selectedDistrict ? selectedDistrict.name : "",
          to_ward_name: "",
        });
      } catch (error) {
        console.error("Error fetching wards:", error);
        setWardError("Error loading wards. Please try again.");
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [toDistrictId, districts]);

  // Fetch wards when district changes (sender)
  useEffect(() => {
    const fetchSenderWards = async () => {
      if (!fromDistrictId) return;

      try {
        setLoadingSenderWards(true);
        setSenderWards([]);

        // Get default shipping account for API token
        const accountsResponse = await getShippingAccountsByUserApi();
        if (
          !accountsResponse ||
          !accountsResponse.data ||
          accountsResponse.data.length === 0
        ) {
          setLoadingSenderWards(false);
          return;
        }

        const defaultAccount =
          accountsResponse.data.find((acc) => acc.is_default) ||
          accountsResponse.data[0];

        // Fetch wards
        const response = await getAllWardsByDistrictApi(
          fromDistrictId,
          defaultAccount.token,
        );

        if (response.code === 200) {
          setSenderWards(
            response.data.map((ward) => ({
              code: ward.WardCode,
              name: ward.WardName,
              district_id: fromDistrictId,
            })),
          );
        }

        const selectedDistrict = senderDistricts.find(
          (d) => d.id === fromDistrictId,
        );
        setFromWardCode("");
        setNewOrder({
          ...newOrder,
          from_district_name: selectedDistrict ? selectedDistrict.name : "",
          from_ward_name: "",
        });
      } catch (error) {
        console.error("Error fetching sender wards:", error);
      } finally {
        setLoadingSenderWards(false);
      }
    };

    fetchSenderWards();
  }, [fromDistrictId, senderDistricts]);

  const handleUseTokenForShipping = async () => {
    try {
      // Get default shipping account
      const accountsResponse = await getShippingAccountsByUserApi();
      if (
        !accountsResponse ||
        !accountsResponse.data ||
        accountsResponse.data.length === 0
      ) {
        alert(
          "No shipping accounts found. Please add a shipping account first.",
        );
        return;
      }

      const defaultAccount =
        accountsResponse.data.find((acc) => acc.is_default) ||
        accountsResponse.data[0];

      // Here you would typically call an API to get sender info from the token
      // For now, let's simulate it with a success message
      alert("Successfully retrieved sender information from GHN account");

      // In a real implementation, you would update the form with the returned data
      setNewOrder({
        ...newOrder,
        from_name: defaultAccount.account_name || "Shop Name",
        from_phone: defaultAccount.phone || "0987654321",
        from_address: defaultAccount.address || "123 Test Street",
        // Other sender fields would be populated from the API response
      });
    } catch (error) {
      console.error("Error fetching token information:", error);
      alert("Failed to retrieve information from token. Please try again.");
    }
  };

  // Cleanup old fields when updating the form
  const updateOrder = (updatedValues) => {
    // Create a new order object with the updated values
    const updatedOrder = {
      ...newOrder,
      ...updatedValues,
    };

    setNewOrder(updatedOrder);
  };

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
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
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
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: "bold", mb: 0 }}
                >
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
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Tỉnh/Thành phố <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {loadingSenderProvinces ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang tải...</Typography>
                    </Box>
                  ) : (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={isViewMode}
                    >
                      <Select
                        value={fromProvinceId || ""}
                        onChange={(e) => {
                          const provinceId = e.target.value;
                          const selectedProvince = senderProvinces.find(
                            (p) => p.id === provinceId,
                          );
                          setFromProvinceId(provinceId);
                          updateOrder({
                            from_province_name: selectedProvince
                              ? selectedProvince.name
                              : "",
                          });
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography color="text.secondary">
                                Chọn Tỉnh/Thành phố
                              </Typography>
                            );
                          }
                          const selectedProvince = senderProvinces.find(
                            (p) => p.id === selected,
                          );
                          return selectedProvince?.name || "";
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            placeholder="Tìm kiếm tỉnh thành"
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={16} />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) =>
                              setSenderProvinceSearch(e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </Box>
                        {senderProvinces
                          .filter((province) =>
                            province.name
                              .toLowerCase()
                              .includes(
                                (senderProvinceSearch || "").toLowerCase(),
                              ),
                          )
                          .map((province) => (
                            <MenuItem key={province.id} value={province.id}>
                              {province.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Quận/Huyện <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {loadingSenderDistricts ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang tải...</Typography>
                    </Box>
                  ) : (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!fromProvinceId || isViewMode}
                    >
                      <Select
                        value={fromDistrictId || ""}
                        onChange={(e) => {
                          const districtId = e.target.value;
                          const selectedDistrict = senderDistricts.find(
                            (d) => d.id === districtId,
                          );
                          setFromDistrictId(districtId);
                          updateOrder({
                            from_district_name: selectedDistrict
                              ? selectedDistrict.name
                              : "",
                          });
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography color="text.secondary">
                                Chọn Quận/Huyện
                              </Typography>
                            );
                          }
                          const selectedDistrict = senderDistricts.find(
                            (d) => d.id === selected,
                          );
                          return selectedDistrict?.name || "";
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            placeholder="Tìm kiếm quận huyện"
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={16} />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) =>
                              setSenderDistrictSearch(e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </Box>
                        {senderDistricts
                          .filter((district) =>
                            district.name
                              .toLowerCase()
                              .includes(
                                (senderDistrictSearch || "").toLowerCase(),
                              ),
                          )
                          .map((district) => (
                            <MenuItem key={district.id} value={district.id}>
                              <Box sx={{ width: "100%" }}>
                                <Typography variant="body2">
                                  {district.name} -{" "}
                                  {newOrder.from_province_name}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Phường/Xã <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {loadingSenderWards ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang tải...</Typography>
                    </Box>
                  ) : (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!fromDistrictId || isViewMode}
                    >
                      <Select
                        value={fromWardCode || ""}
                        onChange={(e) => {
                          const wardCode = e.target.value;
                          const selectedWard = senderWards.find(
                            (w) => w.code === wardCode,
                          );
                          setFromWardCode(wardCode);
                          updateOrder({
                            from_ward_name: selectedWard
                              ? selectedWard.name
                              : "",
                          });
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography color="text.secondary">
                                Chọn Phường/Xã
                              </Typography>
                            );
                          }
                          const selectedWard = senderWards.find(
                            (w) => w.code === selected,
                          );
                          return selectedWard?.name || "";
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            placeholder="Tìm kiếm phường xã"
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={16} />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) =>
                              setSenderWardSearch(e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </Box>
                        {senderWards
                          .filter((ward) =>
                            ward.name
                              .toLowerCase()
                              .includes((senderWardSearch || "").toLowerCase()),
                          )
                          .map((ward) => (
                            <MenuItem key={ward.code} value={ward.code}>
                              <Box sx={{ width: "100%" }}>
                                <Typography variant="body2">
                                  {ward.name}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
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
                    control={<Radio color="success" />}
                    label="Lấy hàng tận nơi"
                  />
                  <FormControlLabel
                    value="delivery"
                    control={<Radio color="success" />}
                    label="Gửi hàng tại bưu cục"
                  />
                </RadioGroup>
              </FormControl>

              {pickupOption === "pickup" && (
                <FormControl fullWidth margin="normal">
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
            </Paper>
          </Grid>

          {/* Bên nhận */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Bên nhận
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    required
                    value={newOrder.to_phone || ""}
                    onChange={(e) =>
                      updateOrder({
                        to_phone: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Họ tên"
                    fullWidth
                    required
                    value={newOrder.to_name || ""}
                    onChange={(e) =>
                      updateOrder({
                        to_name: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Địa chỉ"
                    fullWidth
                    required
                    value={newOrder.to_address || ""}
                    onChange={(e) =>
                      updateOrder({
                        to_address: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Tỉnh/Thành phố <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {loadingProvinces ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang tải...</Typography>
                    </Box>
                  ) : provinceError ? (
                    <Typography color="error" variant="body2">
                      {provinceError}
                    </Typography>
                  ) : (
                    <FormControl fullWidth variant="outlined" size="small">
                      <Select
                        value={toProvinceId || ""}
                        onChange={(e) => {
                          const provinceId = e.target.value;
                          const selectedProvince = provinces.find(
                            (p) => p.id === provinceId,
                          );
                          setToProvinceId(provinceId);
                          updateOrder({
                            to_province_name: selectedProvince
                              ? selectedProvince.name
                              : "",
                          });
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography color="text.secondary">
                                Chọn Tỉnh/Thành phố
                              </Typography>
                            );
                          }
                          const selectedProvince = provinces.find(
                            (p) => p.id === selected,
                          );
                          return selectedProvince?.name || "";
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            placeholder="Tìm kiếm tỉnh thành"
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={16} />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => setProvinceSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </Box>
                        {provinces
                          .filter((province) =>
                            province.name
                              .toLowerCase()
                              .includes((provinceSearch || "").toLowerCase()),
                          )
                          .map((province) => (
                            <MenuItem key={province.id} value={province.id}>
                              {province.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Quận/Huyện <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {loadingDistricts ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang tải...</Typography>
                    </Box>
                  ) : districtError ? (
                    <Typography color="error" variant="body2">
                      {districtError}
                    </Typography>
                  ) : (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!toProvinceId}
                    >
                      <Select
                        value={toDistrictId || ""}
                        onChange={(e) => {
                          const districtId = e.target.value;
                          const selectedDistrict = districts.find(
                            (d) => d.id === districtId,
                          );
                          setToDistrictId(districtId);
                          updateOrder({
                            to_district_name: selectedDistrict
                              ? selectedDistrict.name
                              : "",
                          });
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography color="text.secondary">
                                Chọn Quận/Huyện
                              </Typography>
                            );
                          }
                          const selectedDistrict = districts.find(
                            (d) => d.id === selected,
                          );
                          return selectedDistrict?.name || "";
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            placeholder="Tìm kiếm quận huyện"
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={16} />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => setDistrictSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </Box>
                        {districts
                          .filter((district) =>
                            district.name
                              .toLowerCase()
                              .includes((districtSearch || "").toLowerCase()),
                          )
                          .map((district) => (
                            <MenuItem key={district.id} value={district.id}>
                              <Box sx={{ width: "100%" }}>
                                <Typography variant="body2">
                                  {district.name} - {newOrder.to_province_name}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    Phường/Xã <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {loadingWards ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Đang tải...</Typography>
                    </Box>
                  ) : wardError ? (
                    <Typography color="error" variant="body2">
                      {wardError}
                    </Typography>
                  ) : (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      size="small"
                      disabled={!toDistrictId}
                    >
                      <Select
                        value={toWardCode || ""}
                        onChange={(e) => {
                          const wardCode = e.target.value;
                          const selectedWard = wards.find(
                            (w) => w.code === wardCode,
                          );
                          setToWardCode(wardCode);
                          updateOrder({
                            to_ward_name: selectedWard ? selectedWard.name : "",
                          });
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return (
                              <Typography color="text.secondary">
                                Chọn Phường/Xã
                              </Typography>
                            );
                          }
                          const selectedWard = wards.find(
                            (w) => w.code === selected,
                          );
                          return selectedWard?.name || "";
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                            },
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            position: "sticky",
                            top: 0,
                            bgcolor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          <TextField
                            placeholder="Tìm kiếm phường xã"
                            size="small"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={16} />
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => setWardSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </Box>
                        {wards
                          .filter((ward) =>
                            ward.name
                              .toLowerCase()
                              .includes((wardSearch || "").toLowerCase()),
                          )
                          .map((ward) => (
                            <MenuItem key={ward.code} value={ward.code}>
                              <Box sx={{ width: "100%" }}>
                                <Typography variant="body2">
                                  {ward.name}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Thông tin sản phẩm (for light package) or Thông tin kiện hàng (for heavy package) */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              {servicePackage === "light" ? (
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
                            <Typography
                              variant="h5"
                              sx={{ whiteSpace: "nowrap" }}
                            >
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
                          <Grid item xs={0} md={6}>
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
                                  // productName: e.target.value,
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
              ) : (
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
                          <Typography variant="subtitle2">
                            Kiện {index + 1}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton size="small" color="error">
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
                            name: `Kiện ${
                              (newOrder.packages?.length || 0) + 1
                            }`,
                            length: 10,
                            width: 10,
                            height: 10,
                            weight: 200,
                            convertedWeight: 200,
                          };
                          updateOrder({
                            packages: [
                              ...(newOrder.packages || []),
                              newPackage,
                            ],
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
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
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
              )}
            </Paper>
          </Grid>

          {/* Thông tin đơn hàng */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
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
                    type="number"
                    value={newOrder.weight || null}
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
                    type="number"
                    value={newOrder.length || null}
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
                    type="number"
                    value={newOrder.width || null}
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
                    type="number"
                    value={newOrder.height || null}
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
                    type="number"
                    value={newOrder.cod_amount || newOrder.codAmount || "0"}
                    onChange={(e) =>
                      updateOrder({
                        cod_amount: parseInt(e.target.value) || 0,
                        codAmount: e.target.value,
                      })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">đ</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Tổng giá trị hàng hóa"
                    fullWidth
                    type="number"
                    value={
                      newOrder.insurance_value || newOrder.totalValue || "0"
                    }
                    onChange={(e) =>
                      updateOrder({
                        insurance_value: parseInt(e.target.value) || 0,
                        totalValue: e.target.value,
                      })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">đ</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={newOrder.cashOnDeliveryFailure || false}
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
                  value={
                    newOrder.cod_failed_amount || newOrder.failureCharge || "0"
                  }
                  onChange={(e) =>
                    updateOrder({
                      cod_failed_amount: parseInt(e.target.value) || 0,
                      failureCharge: e.target.value,
                    })
                  }
                  disabled={!newOrder.cashOnDeliveryFailure}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Mã đơn riêng khách hàng"
                  fullWidth
                  placeholder="Nhập mã đơn riêng khách hàng (nếu có)"
                  value={
                    newOrder.client_order_code ||
                    newOrder.customerOrderCode ||
                    ""
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
          </Grid>

          {/* Lưu ý - Ghi chú */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "4px" }}
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
                  newOrder.required_note ||
                  newOrder.deliveryNote ||
                  "KHONGCHOXEMHANG"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  let mappedValue = value;

                  // Map old values to new API values if needed
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

          {/* Chi phí chi tiết */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "4px" }}
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
                    onChange={(e) =>
                      updateOrder({ ...newOrder, paymentParty: e.target.value })
                    }
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
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#f97316"
                  >
                    {servicePackage === "light" ? "22.000 đ" : "2.178.000 đ"}
                  </Typography>
                </Box>
              </Box>

              {/* Promotion code section - updated for better visual balance */}
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
                          ...newOrder,
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
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNjc1MzQgOS41MzMwMUw2LjQ1MDMyIDkuMjgyMUw2Ljc3OTQ0IDkuMTIyMjhMOC40OTQ3OSA4LjQ2MzA1TDYuNzkxODMgNy42OTA1M0w2LjQ0OTYzIDcuNTE2MDFMNi42OTE3OCA3LjI0OTk3TDcuNjgwNSA2LjE1MzQyTDYuMjEyNjYgNi4wNzE1NUw1Ljg2NTYxIDYuMDU0ODFMNS44MjU0NiA1LjcwOTc5TDUuNjQ1ODIgMy45ODY3N0w0LjUwMjk5IDUuMjcwMTJMNC4yODEwMyA1LjUyMzk5TDMuOTk5MDQgNS4zMDc5M0wyLjU2NDQyIDNCMEwxLjc0NzgyIDUuNzQ1MzZMMS42MTcxNiA2LjA4Njg2TDEuMjcwMTEgNi4xOTI0NkwxLjI3MDEyIDYuNjIxNzNMMC45ODUxNDYgNy44Mzg3OUwxLjIyMzY2IDguMTI4OTlMMC45NzIxMSA4LjQwNDI2TDAgOS41MDg5OEwxLjI3OTE0IDkuODMzNTlMMS42Mjk3MiA5LjkyMDYyTDEuNzQ3MTMgMTAuMjY0OUwyLjQ5MTYyIDEyTDMuODcxNDMgMTAuNjcxTDQuMTAwMzQgMTAuNDQ4MUw0LjMzODg3IDEwLjY2MDFMNi4wMTYyNiAxMi4xMTM3TDUuODk5MTMgMTAuMzczNUw1Ljg2NzA0IDEwLjAyNjFMNi4xOTc4NCAxMC4wNTE4TDYuNjc1MzQgOS41MzMwMVoiIGZpbGw9IiNFRjQ0NDQiLz4KPHBhdGggZD0iTTE3LjEyMzcgOS41MDc5OEwxNi4xMzk1IDguMzg5MTdMMTUuODk0NSA4LjEyMDg5TDE2LjE0MDIgNy44NDE0NkwxNy4xMjUgNi42MDk2M0wxNS44NTc5IDYuMTgwMDNMMTUuNTA4MiA2LjA3MDkzTDE1LjM3NjIgNS43MzE1M0wxNC41NTk2IDRMMTMuMTI1IDUuMzA3OTNMMTIuODQ2NCA1LjUyMDY0TDEyLjYyMTQgNS4yNjM0NEwxMS41MTUyIDRMMTEuMzM1NiA1LjcwOTc5TDExLjI5NTQgNi4wNTQ4MUwxMC45NDg0IDYuMDcxNTVMOS40ODAxNiA2LjE4NzkyTDEwLjQ2ODkgNy4yODQ0N0wxMC43MTc5IDcuNTM3NUwxMC4zNzU3IDcuNjkzNTZMOC40OTQ4IDguNDYzMDVMMTAuMjEwMSA5LjEzMTYyTDEwLjU0NTkgOS4yOTgzNkwxMC4zMjA5IDkuNTMzMDFMMTAuOTQ3NyAxMC4wNTE4TDExLjI3ODUgMTAuMDI2MUwxMS4yNDY0IDEwLjM3MzVMMTEuMTI5MyAxMi4xMTM3TDEyLjgwNjcgMTAuNjYwMUwxMy4wNDUyIDEwLjQ0ODFMMTMuMjc0MSAxMC42NzFMMTQuNjU0IDEyTDE1LjM5ODQgMTAuMjY0OUwxNS41MTU4IDkuOTIwNjJMMTUuODY2NCA5LjgzMzU5TDE3LjEyMzcgOS41MDc5OFoiIGZpbGw9IiNGRkQ3MDQiLz4KPHBhdGggZD0iTTEyLjY0NjggNi45MjIzOEwxMS4xODkgNi44NDc4NUwxMC44NTgxIDUuNDcwMjVMMTAuMDAyOSA2LjQ2NjY1TDguNjc1NjUgNi4xMzEyM0w5LjE4MzY0IDcuNDQyODVMOC4wMzc5OCA4LjE2MzM3TDkuMjk0NTQgOC42NjMxNkw4Ljg3OTk5IDEwLjAyODlMMTAuMTY0MSA5LjM0Nzc3TDExLjEyMjcgMTAuMjIxNEwxMS4wNjc3IDguNzY4NjlMMTIuNDA1MiA4LjM3MTk4TDExLjI0ODggNy42NzY2M0wxMi4wMTEzIDYuNjMxNjVMMTIuNjQ2OCA2LjkyMjM4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="
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
