import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Box,
  Divider,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";

const ItemGrid = ({ items, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "success";
      case "sold_out":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={3}>
      {items.length > 0 ? (
        items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Badge
                badgeContent={
                  item.status === "pending" ? (
                    <WarningIcon fontSize="small" />
                  ) : null
                }
                color="warning"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    top: 12,
                    right: 12,
                    border: "2px solid white",
                    padding: "0 4px",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={item.images?.[0]?.url || "/placeholder-image.jpg"}
                  alt={item.name}
                  sx={{
                    objectFit: "cover",
                    borderBottom: `1px solid var(--grey-200)`,
                  }}
                />
              </Badge>
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontSize: "1rem" }}
                  >
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.status.replace("_", " ")}
                    size="small"
                    color={getStatusColor(item.status)}
                    sx={{ textTransform: "capitalize" }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: "40px",
                  }}
                >
                  {item.description}
                </Typography>

                <Grid container spacing={1} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocalOfferIcon
                        fontSize="small"
                        sx={{ color: "var(--text-light)", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <InventoryIcon
                        fontSize="small"
                        sx={{ color: "var(--text-light)", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Stock: {item.stock}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Limit: {item.purchase_limit_per_day}/day
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => onEdit(item)}
                  sx={{ color: "var(--primary-green)" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(item.id)}
                  sx={{ color: "var(--error)" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              backgroundColor: "var(--grey-100)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or add a new item
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ItemGrid;
