import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import React, { useState } from "react";

import AddProductForm from "./AddProductForm";
import ProductItemRow from "./ProductItemRow";

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
    const productToAdd = { ...newProduct, id: Date.now() };
    setSavedProducts([...savedProducts, productToAdd]);
    setNewProduct({ name: "", weight: 0, quantity: 1, code: "" });
    setShowAddForm(false);
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
      onAddProduct(productsToAdd[0]);
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
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NS41MDcgMzEuMDk1SDI0LjI2MVYzMy4zMzNINTUuNTA3VjMxLjA5NVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NS41MDcgNDIuMzgxSDI0LjI2MVY0NC42MTlINTUuNTA3VjQyLjM4MVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zOS44ODEgNTMuNjY3SDI0LjI2MVY1NS45MDVIMzkuODgxVjUzLjY2N1oiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02NS45OTggMjcuOTk4VjU5LjMzM0gxMy45OThWMjAuNjY3SDU4LjY2N0w2NS45OTggMjcuOTk4Wk02MS42NjUgMjkuMzM0SDU3LjMzMVYyNS4wMDFMNjEuNjY1IDI5LjMzNFpNNjMuOTM0IDMxLjYwMUw1NS4wNjQgMjIuNzMyQzU0Ljk2ODQgMjIuNjM0MyA1NC44MzUgMjIuNjY2OCA1NC43OTQ3IDIyLjY4MTNDNTQuNzgyMiAyMi42ODk1IDU0Ljc2NjcgMjIuNjkwN0M\
ZTIobWFwcGluZyBzdHJpbmcpOwo="
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
                      <ProductItemRow
                        key={product.id}
                        product={product}
                        isSelected={selectedProducts.includes(product.id)}
                        onToggleSelect={() => handleToggleSelect(product.id)}
                        onEdit={() => {}}
                        onDelete={() => {
                          setSavedProducts(
                            savedProducts.filter((p) => p.id !== product.id),
                          );
                        }}
                      />
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
          <AddProductForm
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            onCancel={() => setShowAddForm(false)}
            onSave={handleAddNewProduct}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductListDialog;
